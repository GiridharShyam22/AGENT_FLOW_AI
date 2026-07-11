"""
RAG Pipeline - Retrieval-Augmented Generation
Handles semantic search and grounding of responses
"""

import numpy as np
from typing import List, Dict, Tuple
import json
from pathlib import Path

# Try to import sentence_transformers, fallback to mock if not available
try:
    from sentence_transformers import SentenceTransformer
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False
    print("⚠️  sentence-transformers not installed, using mock embeddings")


class MockEmbedder:
    """Mock embedder for when sentence-transformers is not available"""
    def encode(self, text, convert_to_numpy=True):
        """Generate mock embedding"""
        # Simple hash-based embedding for demo
        import hashlib
        hash_obj = hashlib.md5(text.encode())
        hash_bytes = hash_obj.digest()
        embedding = np.frombuffer(hash_bytes, dtype=np.float32)
        # Expand to 384 dimensions
        embedding = np.tile(embedding, (12,))[:384]
        return embedding / (np.linalg.norm(embedding) + 1e-8)


class RAGPipeline:
    """Retrieval-Augmented Generation Pipeline"""
    
    def __init__(self, knowledge_base: dict, top_k: int = 2, similarity_threshold: float = 0.25):
        """
        Initialize RAG pipeline
        
        Args:
            knowledge_base: Dictionary with FAQ items
            top_k: Number of top results to retrieve
            similarity_threshold: Minimum similarity score
        """
        self.knowledge_base = knowledge_base
        self.top_k = top_k
        self.similarity_threshold = similarity_threshold
        
        print("🔧 Initializing RAG Pipeline...")
        
        # Load or create embedder
        if HAS_TRANSFORMERS:
            try:
                print("  📥 Loading embedding model (all-MiniLM-L6-v2)...")
                self.embeddings_model = SentenceTransformer('all-MiniLM-L6-v2')
                print("  ✅ Embedding model loaded")
            except Exception as e:
                print(f"  ⚠️  Failed to load model: {e}")
                self.embeddings_model = MockEmbedder()
        else:
            self.embeddings_model = MockEmbedder()
        
        # Prepare knowledge base
        self._prepare_knowledge_base()
        print("✅ RAG Pipeline initialized\n")
    
    def _prepare_knowledge_base(self):
        """Prepare and embed knowledge base"""
        self.kb_items = []
        self.kb_embeddings = []
        
        print(f"  📚 Embedding {len(self.knowledge_base['faqItems'])} FAQ items...")
        
        for item in self.knowledge_base['faqItems']:
            # Combine text for embedding
            text = f"{item['question']} {item['answer']} {' '.join(item.get('tags', []))}"
            
            self.kb_items.append({
                'id': item['id'],
                'question': item['question'],
                'answer': item['answer'],
                'category': item['category'],
                'tags': item.get('tags', []),
                'text': text
            })
            
            # Embed the item
            embedding = self.embeddings_model.encode(text, convert_to_numpy=True)
            self.kb_embeddings.append(embedding)
        
        self.kb_embeddings = np.array(self.kb_embeddings)
        print(f"  ✅ Embedded {len(self.kb_items)} items")

    def add_document(self, text: str, filename: str = "Uploaded Document"):
        """Dynamically add a new document to the knowledge base"""
        # Simple chunking by paragraph
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
            
            # Embed the chunk
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
        """
        Retrieve top-k most relevant documents
        
        Args:
            query: User query
            
        Returns:
            List of relevant FAQ items
        """
        # Embed query
        query_embedding = self.embeddings_model.encode(query, convert_to_numpy=True)
        
        # Compute similarities
        similarities = self._cosine_similarity(query_embedding, self.kb_embeddings)
        
        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1][:self.top_k]
        
        # Build results
        results = []
        for idx in top_indices:
            score = similarities[idx]
            
            # Filter by threshold
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
        """Compute cosine similarity"""
        a_norm = a / (np.linalg.norm(a) + 1e-8)
        b_norm = b / (np.linalg.norm(b, axis=1, keepdims=True) + 1e-8)
        return np.dot(b_norm, a_norm)
    
    def generate_context(self, retrieved_items: List[Dict]) -> Tuple[str, List[Dict]]:
        """Generate context string from retrieved items"""
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
    
    def is_on_topic(self, query: str, threshold: float = 0.25) -> bool:
        """Determine if query is on-topic"""
        results = self.retrieve(query)
        
        if not results:
            return False
        
        return results[0]['score'] >= threshold
    
    def get_kb_stats(self) -> Dict:
        """Get knowledge base statistics"""
        categories = {}
        for item in self.kb_items:
            cat = item['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        return {
            'total_items': len(self.kb_items),
            'categories': categories,
            'categories_count': len(categories)
        }
