"""
Web Scraper - Knowledge Base Builder
Expands knowledge base from documentation
"""

import json
from typing import List, Dict
from pathlib import Path
from datetime import datetime
import hashlib

class WebScraper:
    """Web scraper for knowledge base expansion"""
    
    def __init__(self, kb_path: str = None):
        """
        Initialize scraper
        
        Args:
            kb_path: Path to knowledge base file
        """
        self.kb_path = kb_path or "data/knowledge_base/faqs.json"
        self.max_items_per_source = 20
        
        print("✅ Web Scraper initialized")
    
    def scrape_documentation(self, url: str, title: str) -> List[Dict]:
        """
        Scrape FAQ from documentation
        
        Args:
            url: URL to scrape
            title: Documentation title
            
        Returns:
            List of extracted Q&A items
        """
        print(f"🔄 Scraping {title}...")
        
        try:
            from bs4 import BeautifulSoup
            import requests
            
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            qa_items = self._extract_qa_items(soup, title)
            
            print(f"✅ Extracted {len(qa_items)} items from {title}")
            return qa_items
            
        except ImportError:
            print("⚠️  BeautifulSoup/requests not installed")
            return []
        except Exception as e:
            print(f"❌ Error scraping {url}: {e}")
            return []
    
    def _extract_qa_items(self, soup, source_title: str) -> List[Dict]:
        """Extract Q&A items from HTML"""
        items = []
        
        # Strategy 1: h3 (question) + p (answer)
        h3_tags = soup.find_all('h3')
        for h3 in h3_tags:
            question = h3.get_text(strip=True)
            p_tag = h3.find_next('p')
            if p_tag:
                answer = p_tag.get_text(strip=True)
                
                if len(question) > 10 and len(answer) > 20:
                    items.append({
                        'question': question,
                        'answer': answer,
                        'source': source_title
                    })
        
        # Remove duplicates
        seen = set()
        unique_items = []
        for item in items[:self.max_items_per_source]:
            item_hash = hashlib.md5(item['question'].encode()).hexdigest()
            if item_hash not in seen:
                seen.add(item_hash)
                unique_items.append(item)
        
        return unique_items
    
    def expand_knowledge_base(self, sources: List[Dict]) -> int:
        """
        Expand knowledge base from sources
        
        Args:
            sources: List of {url, title} dicts
            
        Returns:
            Number of items added
        """
        print(f"🚀 Expanding KB from {len(sources)} sources...")
        
        try:
            with open(self.kb_path, 'r') as f:
                kb = json.load(f)
        except FileNotFoundError:
            kb = {'faqItems': []}
        
        existing_questions = {item['question'] for item in kb['faqItems']}
        next_id = max((item['id'] for item in kb['faqItems']), default=0) + 1
        
        new_items_added = 0
        
        for source in sources:
            qa_items = self.scrape_documentation(source['url'], source['title'])
            
            for item in qa_items:
                if item['question'] not in existing_questions:
                    new_item = {
                        'id': next_id,
                        'category': f"Scraped - {source['title']}",
                        'question': item['question'],
                        'answer': item['answer'],
                        'tags': ['scraped', source['title'].lower().replace(' ', '-')],
                        'source_url': source['url'],
                        'scraped_date': datetime.now().isoformat()
                    }
                    
                    kb['faqItems'].append(new_item)
                    existing_questions.add(item['question'])
                    next_id += 1
                    new_items_added += 1
        
        # Save updated KB
        with open(self.kb_path, 'w') as f:
            json.dump(kb, f, indent=2)
        
        print(f"✅ Added {new_items_added} items")
        return new_items_added
    
    def get_scraper_stats(self) -> Dict:
        """Get scraper statistics"""
        try:
            with open(self.kb_path, 'r') as f:
                kb = json.load(f)
        except FileNotFoundError:
            return {'total_items': 0, 'scraped_items': 0, 'manual_items': 0}
        
        scraped_items = [item for item in kb['faqItems'] if 'scraped_date' in item]
        
        return {
            'total_items': len(kb['faqItems']),
            'scraped_items': len(scraped_items),
            'manual_items': len(kb['faqItems']) - len(scraped_items)
        }
