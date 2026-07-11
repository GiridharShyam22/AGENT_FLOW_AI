import urllib.request
import json
import time

API_URL = "http://127.0.0.0:8000/chat"

# A set of test questions to evaluate the RAG chatbot
TEST_QUESTIONS = [
    {
        "type": "on_topic",
        "question": "What is tool calling in AI agents?",
        "expected_topic": True
    },
    {
        "type": "on_topic",
        "question": "How do agents maintain memory?",
        "expected_topic": True
    },
    {
        "type": "on_topic",
        "question": "What is a multi-agent system?",
        "expected_topic": True
    },
    {
        "type": "off_topic",
        "question": "What is the capital of France?",
        "expected_topic": False
    },
    {
        "type": "off_topic",
        "question": "How do I bake a chocolate cake?",
        "expected_topic": False
    }
]

def run_evaluation():
    print("="*60)
    print("🤖 AGENTFLOW AI - RAG CHATBOT EVALUATION 🤖")
    print("="*60)
    print(f"Testing {len(TEST_QUESTIONS)} questions against the local backend...\n")
    
    passed_tests = 0

    for idx, q in enumerate(TEST_QUESTIONS, 1):
        print(f"Test {idx}: {q['question']}")
        print(f"Type: {q['type'].upper()} | Expected is_on_topic: {q['expected_topic']}")
        
        start_time = time.time()
        
        try:
            req = urllib.request.Request(
                API_URL, 
                data=json.dumps({"message": q["question"]}).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
                
            latency = time.time() - start_time
            
            # Extract metrics
            is_on_topic = result.get("is_on_topic", False)
            confidence = result.get("confidence", 0.0)
            sources = result.get("sources", [])
            
            # Determine Pass/Fail based on expected on-topic flag
            passed = (is_on_topic == q['expected_topic'])
            if passed:
                passed_tests += 1
                
            print(f"Result: {'✅ PASS' if passed else '❌ FAIL'}")
            print(f"Latency: {latency:.2f}s | Confidence: {confidence:.2f}")
            print(f"Sources cited: {len(sources)}")
            print("-" * 60)
            
        except Exception as e:
            print(f"❌ Error hitting API: {e}")
            print("-" * 60)
            
    print("\n" + "="*60)
    print(f"EVALUATION COMPLETE: {passed_tests}/{len(TEST_QUESTIONS)} Passed ({(passed_tests/len(TEST_QUESTIONS))*100:.0f}%)")
    print("="*60 + "\n")

if __name__ == "__main__":
    # Ensure URL is set to localhost
    API_URL = "http://127.0.0.1:8000/chat"
    run_evaluation()
