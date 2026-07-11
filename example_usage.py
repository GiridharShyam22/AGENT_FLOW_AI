#!/usr/bin/env python3
"""
Example usage of AgentFlow Support Bot
Demonstrates how to use the chatbot programmatically
"""

import sys
import json
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

def main():
    print("\n" + "="*70)
    print("🤖 AGENTFLOW SUPPORT BOT - EXAMPLE USAGE")
    print("="*70 + "\n")
    
    try:
        from chatbot.core import ChatbotCore
        from chatbot.rag_pipeline import RAGPipeline
        
        # Load knowledge base
        kb_path = Path(__file__).parent / "data" / "knowledge_base" / "faqs.json"
        print("📚 Loading knowledge base...")
        
        with open(kb_path, 'r') as f:
            knowledge_base = json.load(f)
        
        # Initialize
        print("🔧 Initializing chatbot...")
        rag_pipeline = RAGPipeline(knowledge_base)
        chatbot = ChatbotCore(rag_pipeline)
        
        print("✅ Chatbot ready!\n")
        
        # Example queries
        example_queries = [
            "How do I create an account?",
            "What are the pricing plans?",
            "How do I enable two-factor authentication?",
            "Can I share projects with my team?",
            "What's the weather today?",  # Off-topic test
        ]
        
        print("="*70)
        print("EXAMPLE QUERIES")
        print("="*70 + "\n")
        
        for i, query in enumerate(example_queries, 1):
            print(f"Query {i}: {query}")
            print("-" * 70)
            
            # Get response
            response = chatbot.generate_response(query)
            
            # Print response
            print(f"Response:\n{response['response']}\n")
            
            # Print metadata
            print(f"On-Topic: {'✅ Yes' if response['is_on_topic'] else '❌ No'}")
            print(f"Confidence: {response['confidence']:.0%}")
            
            if response['sources']:
                print(f"\nSources:")
                for source in response['sources']:
                    print(f"  • {source['category']}: {source['question'][:50]}...")
            
            print("\n" + "="*70 + "\n")
        
        # Interactive mode
        print("\n🎯 Interactive Mode - Ask anything!")
        print("Type 'exit' to quit.\n")
        
        conversation_id = f"example_conv_{id(chatbot)}"
        
        while True:
            try:
                user_input = input("You: ").strip()
                
                if user_input.lower() == 'exit':
                    print("\n👋 Goodbye!")
                    break
                
                if not user_input:
                    continue
                
                # Get response
                response = chatbot.generate_response(user_input, conversation_id)
                
                # Print response
                print(f"\nBot: {response['response']}\n")
                
                if response['sources']:
                    print("Sources:", ", ".join(s['category'] for s in response['sources']))
                
                print(f"Confidence: {response['confidence']:.0%}\n")
                print("-" * 70 + "\n")
                
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye!")
                break
                
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("\nPlease install dependencies:")
        print("  pip install -r requirements.txt")
        return 1
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
