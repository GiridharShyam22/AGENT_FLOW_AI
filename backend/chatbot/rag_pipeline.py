"""
RAG Pipeline - Retrieval-Augmented Generation
Handles semantic search and grounding of responses
"""

import numpy as np
from typing import List, Dict, Tuple
import json
from pathlib import Path

# Try to import sentence_transformers, fallback to TF-IDF if not available (to save 500MB+ RAM on Render!)
try:
    from sentence_transformers import SentenceTransformer
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False
    print("⚠️  sentence-transformers not installed, using lightweight TF-IDF Embedder to save RAM!")

class TfidfEmbedder:
    """Lightweight TF-IDF embedder for low-RAM environments (like Render Free Tier)"""
    def __init__(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.is_fitted = False
        
    def fit(self, texts):
        if not texts:
            texts = ["dummy text to fit vectorizer"]
        self.vectorizer.fit(texts)
        self.is_fitted = True
        
    def encode(self, text, convert_to_numpy=True):
        if not self.is_fitted:
            self.fit([text])
        # Returns sparse matrix, convert to dense 1D array
        return self.vectorizer.transform([text]).toarray()[0].astype(np.float32)

class RAGPipeline:
    """Retrieval-Augmented Generation Pipeline"""
    
    def __init__(self, knowledge_base: dict, top_k: int = 2, similarity_threshold: float = 0.15):
        self.knowledge_base = knowledge_base
        self.top_k = top_k
        self.similarity_threshold = similarity_threshold
        
        print("🔧 Initializing RAG Pipeline...")
        
        if HAS_TRANSFORMERS:
            try:
                print("  📥 Loading embedding model (all-MiniLM-L6-v2)...")
                self.embeddings_model = SentenceTransformer('all-MiniLM-L6-v2')
                print("  ✅ Embedding model loaded")
            except Exception as e:
                print(f"  ⚠️  Failed to load model: {e}")
                self.embeddings_model = TfidfEmbedder()
                global HAS_TRANSFORMERS
                HAS_TRANSFORMERS = False
        else:
            self.embeddings_model = TfidfEmbedder()
        
        self._prepare_knowledge_base()
        print("✅ RAG Pipeline initialized\n")
    
    def _prepare_knowledge_base(self):
        self.kb_items = []
        self.kb_embeddings = []
        
        print(f"  📚 Embedding {len(self.knowledge_base['faqItems'])} FAQ items...")
        
        # If using TF-IDF, we must fit on all text first!
        texts = []
        for item in self.knowledge_base['faqItems']:
            text = f"{item['question']} {item['answer']} {' '.join(item.get('tags', []))}"
            texts.append(text)
            
        if not HAS_TRANSFORMERS:
            self.embeddings_model.fit(texts)
        
        for i, item in enumerate(self.knowledge_base['faqItems']):
            text = texts[i]
            self.kb_items.append({
                'id': item['id'],
                'question': item['question'],
                'answer': item['answer'],
                'category': item['category'],
                'tags': item.get('tags', []),
                'text': text
            })
            embedding = self.embeddings_model.encode(text, convert_to_numpy=True)
            self.kb_embeddings.append(embedding)
        
        self.kb_embeddings = np.array(self.kb_embeddings)
        print(f"  ✅ Embedded {len(self.kb_items)} items")

    def add_document(self, text: str, filename: str = "Uploaded Document"):
        paragraphs = [p.strip() for p in text.split('\n\n') if len(p.strip()) > 20]
        
        new_embeddings = []
        for i, p in enumerate(paragraphs):
            item = {
                'id': f'dynamic_{filename}_{i}',
                'question': f'Excerpt from {filename}',
                'answer': p,
                'category': 'Uploaded Document',
                'tags': ['dynamic', filename],
                'text': p
            }
            self.kb_items.append(item)
            embedding = self.embeddings_model.encode(p, convert_to_numpy=True)
            new_embeddings.append(embedding)
            
        if new_embeddings:
            new_embeddings_array = np.array(new_embeddings)
            if len(self.kb_embeddings) > 0:
                self.kb_embeddings = np.vstack([self.kb_embeddings, new_embeddings_array])
            else:
                self.kb_embeddings = new_embeddings_array
            
        print(f"✅ Added {len(paragraphs)} chunks from {filename} to Vector DB")
        
    def retrieve(self, query: str) -> List[Dict]:
        query_embedding = self.embeddings_model.encode(query, convert_to_numpy=True)
        similarities = self._cosine_similarity(query_embedding, self.kb_embeddings)
        
        top_indices = np.argsort(similarities)[::-1][:self.top_k]
        
        results = []
        for idx in top_indices:
            score = similarities[idx]
            if score >= self.similarity_threshold:
                results.append({
                    'id': self.kb_items[idx]['id'],
                    'question': self.kb_items[idx]['question'],
                    'answer': self.kb_items[idx]['answer'],
                    'category': self.kb_items[idx]['category'],
                    'tags': self.kb_items[idx]['tags'],
                    'score': float(score)
                })
        return results
    
    def _cosine_similarity(self, a: np.ndarray, b: np.ndarray) -> np.ndarray:
        a_norm = a / (np.linalg.norm(a) + 1e-8)
        b_norm = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-8)
        return np.dot(b_norm, a_norm)
    
    def generate_context(self, retrieved_items: List[Dict]) -> Tuple[str, List[Dict]]:
        if not retrieved_items:
            return "", []
        
        context_parts = []
        citations = []
        
        for i, item in enumerate(retrieved_items, 1):
            context_parts.append(
                f"[Source {i} - {item['category']}]\n"
                f"Q: {item['question']}\n"
                f"A: {item['answer']}\n"
            )
            citations.append({
                'id': item['id'],
                'question': item['question'],
                'category': item['category'],
                'relevance_score': item['score'],
                'source_number': i
            })
        return "\n".join(context_parts), citations
    
    def is_on_topic(self, query: str, threshold: float = 0.15) -> bool:
        results = self.retrieve(query)
        if not results:
            return False
        return results[0]['score'] >= threshold
    
    def get_kb_stats(self) -> Dict:
        categories = {}
        for item in self.kb_items:
            cat = item['category']
            categories[cat] = categories.get(cat, 0) + 1
        return {
            'total_items': len(self.kb_items),
            'categories': categories,
            'categories_count': len(categories)
        }
