#!/usr/bin/env python3
"""
Standalone evaluation script for AgentFlow Support Bot
Run tests without needing the server running
"""

import sys
import os
import json
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

def main():
    print("\n" + "="*70)
    print("🧪 AGENTFLOW SUPPORT BOT - EVALUATION SUITE")
    print("="*70 + "\n")
    
    try:
        from chatbot.core import ChatbotCore
        from chatbot.rag_pipeline import RAGPipeline
        from evaluator.test_suite import ChatbotEvaluator
        
        # Load knowledge base
        kb_path = Path(__file__).parent / "data" / "knowledge_base" / "faqs.json"
        print(f"📚 Loading knowledge base from: {kb_path}")
        
        with open(kb_path, 'r') as f:
            knowledge_base = json.load(f)
        
        print(f"✅ Loaded {len(knowledge_base['faqItems'])} FAQ items\n")
        
        # Initialize RAG pipeline
        print("🔧 Initializing RAG pipeline...")
        rag_pipeline = RAGPipeline(knowledge_base)
        
        # Initialize chatbot
        print("\n🤖 Initializing chatbot core...")
        chatbot_core = ChatbotCore(rag_pipeline)
        
        # Run evaluator
        print("\n🧪 Starting evaluation suite...\n")
        evaluator = ChatbotEvaluator(
            chatbot_core,
            test_data_path=str(Path(__file__).parent / "data" / "test_questions.json")
        )
        
        # Run all tests
        metrics = evaluator.run_tests()
        
        # Save results
        results_path = Path(__file__).parent / "data" / "evaluation_results.json"
        evaluator.save_results(str(results_path))
        
        # Print report
        print("\n" + evaluator.generate_report())
        
        # Return exit code
        if metrics['pass_rate'] >= 80:
            print("✅ Evaluation PASSED! Pass rate >= 80%\n")
            return 0
        else:
            print("⚠️  Evaluation OK but pass rate < 80%\n")
            return 1
            
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("\nPlease install dependencies:")
        print("  pip install -r requirements.txt")
        return 1
    except Exception as e:
        print(f"\n❌ Error during evaluation: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
