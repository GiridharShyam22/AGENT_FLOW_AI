import json

data = {
    "faqItems": [
        {
            "id": "agent_001",
            "question": "What is an autonomous AI agent?",
            "answer": "An autonomous AI agent is a system powered by an LLM that can plan, reason, and take actions to achieve a specific goal without continuous human intervention. It uses the LLM as its 'brain' to decide which tools to call and what steps to take next.",
            "category": "Agent Basics",
            "tags": ["agents", "llm", "basics"]
        },
        {
            "id": "agent_002",
            "question": "How does an agent differ from a standard chatbot?",
            "answer": "A standard chatbot simply generates text responses based on your input. An agent, however, can execute code, browse the web, read files, and trigger APIs (tool calling) to solve complex, multi-step problems autonomously.",
            "category": "Agent Basics",
            "tags": ["chatbot", "comparison", "tools"]
        },
        {
            "id": "agent_003",
            "question": "What is tool calling (function calling)?",
            "answer": "Tool calling is a capability where you provide an LLM with a schema of available functions (like 'search_web' or 'get_weather'). The LLM decides when to use a tool and generates the exact JSON arguments needed to execute it. The system then runs the function and feeds the result back to the LLM.",
            "category": "Tool Calling",
            "tags": ["functions", "tools", "json"]
        },
        {
            "id": "agent_004",
            "question": "How do I prevent my agent from getting stuck in an infinite loop?",
            "answer": "To prevent infinite loops, you should implement a 'max_iterations' limit in your agent loop. You can also prompt the LLM to yield or explicitly call a 'stop' tool when it determines it cannot solve the problem or needs human assistance.",
            "category": "Agent Basics",
            "tags": ["loops", "errors", "safety"]
        },
        {
            "id": "mem_001",
            "question": "How do agents maintain memory over long conversations?",
            "answer": "Agents maintain memory by storing conversation history. For short-term memory, the full transcript is passed in the context window. For long-term memory, past interactions are summarized or stored in a vector database and retrieved using RAG when relevant.",
            "category": "Memory & Context",
            "tags": ["memory", "vector db", "context"]
        },
        {
            "id": "mem_002",
            "question": "What happens when an agent exceeds the context window?",
            "answer": "When the context window is exceeded, the LLM will fail or hallucinate. To solve this, developers use techniques like 'context sliding' (dropping oldest messages), recursive summarization of past messages, or offloading knowledge to a vector store.",
            "category": "Memory & Context",
            "tags": ["context window", "tokens", "limits"]
        },
        {
            "id": "multi_001",
            "question": "What is a multi-agent system?",
            "answer": "A multi-agent system involves multiple specialized AI agents working together to solve a complex task. For example, a 'Coder' agent might write code, while a 'Reviewer' agent critiques it, and a 'Manager' agent orchestrates the workflow between them.",
            "category": "Multi-Agent Systems",
            "tags": ["multi-agent", "orchestration", "collaboration"]
        },
        {
            "id": "multi_002",
            "question": "What are some popular frameworks for building multi-agent systems?",
            "answer": "Popular frameworks include Microsoft AutoGen, CrewAI, and LangGraph. These frameworks provide primitives for defining specialized agents, tools, and the routing logic (like state machines or hierarchical structures) to pass messages between them.",
            "category": "Multi-Agent Systems",
            "tags": ["frameworks", "autogen", "crewai"]
        },
        {
            "id": "rag_001",
            "question": "How does RAG improve an AI agent?",
            "answer": "Retrieval-Augmented Generation (RAG) improves an agent by giving it access to external, up-to-date, or proprietary knowledge that wasn't in its training data. Instead of hallucinating facts, the agent retrieves documents from a vector store and uses them to ground its answers.",
            "category": "RAG Integration",
            "tags": ["rag", "grounding", "hallucination"]
        },
        {
            "id": "rag_002",
            "question": "Should my agent use dense vector search or keyword search?",
            "answer": "Ideally, an agent should use a hybrid approach. Dense vector search (embeddings) is great for semantic meaning and conceptual matches, while keyword search (BM25) is better for exact matches on names, acronyms, or specific IDs.",
            "category": "RAG Integration",
            "tags": ["vector search", "bm25", "hybrid"]
        }
    ]
}

with open('../data/knowledge_base/faqs.json', 'w') as f:
    json.dump(data, f, indent=2)

print("Updated faqs.json successfully.")
