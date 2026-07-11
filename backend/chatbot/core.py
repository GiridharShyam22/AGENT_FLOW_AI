"""
Chatbot Core Module
Main chatbot logic with Ollama integration
"""

from typing import Dict, List
from datetime import datetime
import os
import json


class ChatbotCore:
    """Main chatbot implementation"""

    def __init__(self, rag_pipeline):
        """
        Initialize chatbot

        Args:
            rag_pipeline: RAGPipeline instance
        """
        self.rag_pipeline = rag_pipeline
        self.conversation_history = {}

        self.system_prompt = """You are AgentFlow Support Bot, a helpful customer service assistant for AgentFlow project management platform.

Your responsibilities:
1. Answer questions about AgentFlow features, pricing, and usage
2. Provide clear, concise, and helpful responses
3. Cite sources when using information from the knowledge base
4. Stay focused on AgentFlow-related topics
5. Be professional and friendly

Knowledge Base Context:
{context}

When responding:
- Use information from the knowledge base (marked with [Source X])
- Format citations as: (Source: Category - Question)
- If question is off-topic, politely redirect to support topics
- Keep responses concise and actionable"""

        # Define tools for Ollama to use
        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "search_web",
                    "description": "Search the web for real-time information when the knowledge base lacks an answer.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "The search query to look up on the web"
                            }
                        },
                        "required": ["query"]
                    }
                }
            }
        ]

        print("✅ Chatbot core initialized\n")

    def generate_response(self, user_message: str, conversation_id: str = None) -> Dict:
        """
        Generate response to user message
        """

        print(f"  🔄 Processing: {user_message[:50]}...")

        # Check if on-topic
        is_on_topic = self.rag_pipeline.is_on_topic(user_message)

        # Retrieve relevant items
        retrieved_items = self.rag_pipeline.retrieve(user_message)

        # Generate context
        context, citations = self.rag_pipeline.generate_context(retrieved_items)

        # Calculate confidence
        if retrieved_items:
            avg_confidence = sum(item["score"] for item in retrieved_items) / len(retrieved_items)
        else:
            avg_confidence = 0.0

        # Prepare system prompt
        system_prompt = self.system_prompt.format(
            context=context if context else "No knowledge base items found."
        )

        # Generate AI response
        try:
            groq_key = os.environ.get("GROQ_API_KEY")
            if groq_key:
                response_text = self._call_groq(user_message, system_prompt, groq_key)
            else:
                response_text = self._call_ollama(user_message, system_prompt)

        except Exception as e:
            print(f"⚠️ Ollama error: {e}")
            print("Using fallback response...\n")

            response_text = self._generate_fallback_response(
                user_message,
                retrieved_items,
                is_on_topic,
            )

        formatted_response = self._format_response_with_citations(
            response_text,
            citations,
        )

        # Store history
        if conversation_id:

            if conversation_id not in self.conversation_history:
                self.conversation_history[conversation_id] = []

            self.conversation_history[conversation_id].append(
                {
                    "timestamp": datetime.now().isoformat(),
                    "user": user_message,
                    "assistant": formatted_response,
                    "on_topic": is_on_topic,
                    "confidence": avg_confidence,
                }
            )

        print(f"✅ Response generated (confidence: {avg_confidence:.0%})\n")

        return {
            "response": formatted_response,
            "sources": citations,
            "confidence": min(avg_confidence, 1.0),
            "is_on_topic": is_on_topic,
        }

    def _call_groq(self, user_message: str, system_prompt: str, api_key: str) -> str:
        try:
            from groq import Groq
            client = Groq(api_key=api_key)
            response = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(str(e))

    def _call_ollama(self, user_message: str, system_prompt: str) -> str:
        """
        Generate response using local Ollama
        """

        try:
            import ollama

            response = ollama.chat(
                model="llama3.2:latest",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": user_message,
                    },
                ],
            )

            return response["message"]["content"]

        except ImportError:
            raise Exception(
                "Ollama Python library is not installed.\nRun:\n\npip install ollama"
            )

        except Exception as e:
            raise Exception(str(e))

    def _generate_fallback_response(
        self,
        user_message: str,
        retrieved_items: List[Dict],
        is_on_topic: bool,
    ) -> str:
        """Generate fallback response without AI"""

        if not is_on_topic or not retrieved_items:

            return (
                "Thank you for your question! I'm AgentFlow Support Bot, specialized in helping with AgentFlow. "
                "Your question appears to be outside my area of expertise. "
                "Please ask me about AgentFlow features, pricing, account management, or technical issues. "
                "Our support team is available at support@agentflow.app."
            )

        top_item = retrieved_items[0]

        response = f"Based on our knowledge base:\n\n{top_item['answer']}\n\n"

        if len(retrieved_items) > 1:

            response += "Related topics:\n"

            for item in retrieved_items[1:]:
                response += f"• {item['question']}\n"

        return response

    def _format_response_with_citations(
        self,
        response: str,
        citations: List[Dict],
    ) -> str:
        """Format response with citations"""

        if not citations:
            return response

        citation_text = "\n\n**Sources:**\n"

        for citation in citations:
            citation_text += (
                f'- {citation["category"]}: "{citation["question"]}"\n'
            )

        return response + citation_text

    def get_conversation(self, conversation_id: str) -> List[Dict]:
        """Get conversation history"""
        return self.conversation_history.get(conversation_id, [])

    def clear_conversation(self, conversation_id: str):
        """Clear conversation history"""

        if conversation_id in self.conversation_history:
            del self.conversation_history[conversation_id]