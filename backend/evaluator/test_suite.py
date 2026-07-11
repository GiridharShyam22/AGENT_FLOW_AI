"""
Evaluation Test Suite
Comprehensive testing framework for chatbot
"""

import json
from typing import List, Dict
from datetime import datetime

class ChatbotEvaluator:
    """Evaluate chatbot responses"""
    
    def __init__(self, chatbot_core, test_data_path: str = None):
        """
        Initialize evaluator
        
        Args:
            chatbot_core: ChatbotCore instance
            test_data_path: Path to test questions
        """
        self.chatbot_core = chatbot_core
        self.test_data_path = test_data_path or "data/test_questions.json"
        self.results = []
    
    def load_test_data(self) -> List[Dict]:
        """Load test questions"""
        try:
            with open(self.test_data_path, 'r') as f:
                test_data = json.load(f)
            print(f"✅ Loaded {len(test_data['tests'])} test questions\n")
            return test_data['tests']
        except FileNotFoundError:
            print(f"❌ Test file not found: {self.test_data_path}")
            return []
    
    def run_tests(self) -> Dict:
        """Run all tests"""
        print("\n" + "="*70)
        print("🧪 RUNNING CHATBOT EVALUATION SUITE")
        print("="*70 + "\n")
        
        tests = self.load_test_data()
        
        if not tests:
            return {'error': 'No test data loaded'}
        
        self.results = []
        passed = 0
        failed = 0
        
        for i, test in enumerate(tests, 1):
            print(f"Test {i}/{len(tests)}: {test['question'][:50]}...")
            
            result = self._run_single_test(test)
            self.results.append(result)
            
            if result['passed']:
                passed += 1
                print(f"  ✅ PASSED (confidence: {result['confidence']:.0%})")
            else:
                failed += 1
                print(f"  ❌ FAILED ({result['failure_reason']})")
            print()
        
        # Calculate metrics
        metrics = self._calculate_metrics(passed, failed)
        self._print_summary(metrics)
        
        return metrics
    
    def _run_single_test(self, test: Dict) -> Dict:
        """Run a single test"""
        question = test['question']
        expected_on_topic = test.get('expected_on_topic', True)
        
        try:
            # Get response
            response_data = self.chatbot_core.generate_response(question)
            
            response = response_data['response']
            sources = response_data['sources']
            confidence = response_data['confidence']
            is_on_topic = response_data['is_on_topic']
            
            # Evaluate
            passed = True
            failure_reason = ""
            
            # Check response length
            if not response or len(response.strip()) < 20:
                passed = False
                failure_reason = "Response too short"
            
            # Check on-topic
            if is_on_topic != expected_on_topic:
                passed = False
                failure_reason = f"Expected on_topic={expected_on_topic}, got {is_on_topic}"
            
            # Check confidence
            if expected_on_topic and confidence < 0.2:
                passed = False
                failure_reason = f"Low confidence: {confidence:.2f}"
            
            return {
                'question': question,
                'passed': passed,
                'failure_reason': failure_reason,
                'response': response[:100] + "..." if len(response) > 100 else response,
                'confidence': confidence,
                'is_on_topic': is_on_topic,
                'sources_found': len(sources),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'question': question,
                'passed': False,
                'failure_reason': str(e),
                'response': "",
                'confidence': 0,
                'is_on_topic': False,
                'sources_found': 0,
                'timestamp': datetime.now().isoformat()
            }
    
    def _calculate_metrics(self, passed: int, failed: int) -> Dict:
        """Calculate metrics"""
        total = passed + failed
        pass_rate = (passed / total * 100) if total > 0 else 0
        
        avg_confidence = sum(r['confidence'] for r in self.results) / len(self.results) if self.results else 0
        on_topic_accuracy = sum(1 for r in self.results if r['is_on_topic']) / len(self.results) if self.results else 0
        
        return {
            'total_tests': total,
            'passed': passed,
            'failed': failed,
            'pass_rate': pass_rate,
            'average_confidence': avg_confidence,
            'on_topic_accuracy': on_topic_accuracy,
            'timestamp': datetime.now().isoformat()
        }
    
    def _print_summary(self, metrics: Dict):
        """Print summary"""
        print("="*70)
        print("📊 TEST RESULTS SUMMARY")
        print("="*70)
        print(f"Total Tests: {metrics['total_tests']}")
        print(f"Passed: {metrics['passed']} ✅")
        print(f"Failed: {metrics['failed']} ❌")
        print(f"Pass Rate: {metrics['pass_rate']:.1f}%")
        print(f"Average Confidence: {metrics['average_confidence']:.2f}")
        print(f"On-Topic Accuracy: {metrics['on_topic_accuracy']:.1f}%")
        print("="*70 + "\n")
    
    def save_results(self, output_path: str = "data/evaluation_results.json"):
        """Save results to file"""
        results_data = {
            'timestamp': datetime.now().isoformat(),
            'metrics': self._calculate_metrics(
                sum(1 for r in self.results if r['passed']),
                sum(1 for r in self.results if not r['passed'])
            ),
            'detailed_results': self.results
        }
        
        with open(output_path, 'w') as f:
            json.dump(results_data, f, indent=2)
        
        print(f"✅ Results saved to {output_path}")
    
    def generate_report(self) -> str:
        """Generate human-readable report"""
        if not self.results:
            return "No test results available"
        
        passed = sum(1 for r in self.results if r['passed'])
        failed = sum(1 for r in self.results if not r['passed'])
        
        report = f"""
CHATBOT EVALUATION REPORT
Generated: {datetime.now().isoformat()}

SUMMARY
-------
Total Tests Run: {len(self.results)}
Passed: {passed} ✅
Failed: {failed} ❌
Pass Rate: {passed/len(self.results)*100:.1f}%

DETAILED RESULTS
----------------
"""
        
        for i, result in enumerate(self.results, 1):
            status = "✅ PASS" if result['passed'] else "❌ FAIL"
            report += f"\nTest {i}: {status}\n"
            report += f"  Question: {result['question']}\n"
            report += f"  Confidence: {result['confidence']:.2f}\n"
            report += f"  On-Topic: {result['is_on_topic']}\n"
            if result['failure_reason']:
                report += f"  Reason: {result['failure_reason']}\n"
        
        return report
