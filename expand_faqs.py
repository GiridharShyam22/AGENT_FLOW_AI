import json

with open("data/knowledge_base/faqs.json", "r") as f:
    data = json.load(f)

# Expanded answers
expansions = {
    "agent_001": "An autonomous AI agent is a system powered by an LLM that can plan, reason, and take actions to achieve a specific goal without continuous human intervention. It uses the LLM as its 'brain' to decide which tools to call and what steps to take next. By utilizing advanced prompting techniques such as Chain-of-Thought and ReAct, the agent is capable of breaking down complex user requests into smaller, actionable sub-tasks, executing them iteratively until the main objective is completely resolved.",
    
    "agent_002": "A standard chatbot simply generates text responses based on your input, effectively functioning as a conversational interface over static training data. An agent, however, can execute code, browse the web, read files, and trigger APIs (tool calling) to solve complex, multi-step problems autonomously. Because agents possess agency, they can dynamically fetch real-time information, fix their own errors based on environmental feedback, and orchestrate complex workflows rather than just answering questions.",
    
    "agent_003": "ReAct (Reasoning and Acting) is a prompting framework that forces the LLM to write down its thought process before executing a tool. For example, it outputs 'Thought: I need to search the web -> Action: SearchWeb()'. This drastically improves reliability because it allows the agent to formulate a logical plan, observe the outcome of its action, and subsequently reason about whether the task is complete or if a different strategy is required, greatly reducing hallucinations.",
    
    "agent_004": "To prevent infinite loops, you should implement a 'max_iterations' limit in your agent loop. You can also prompt the LLM to yield or explicitly call a 'stop' tool when it determines it cannot solve the problem or needs human assistance. In production, adding deterministic state checks, budget limits on API calls, and timeout triggers ensures that runaway agents are safely halted before consuming excessive compute resources.",
    
    "tool_001": "Tool calling is a capability where you provide an LLM with a schema of available functions (like 'search_web' or 'get_weather'). The LLM decides when to use a tool and generates the exact JSON arguments needed to execute it. The system then runs the function and feeds the result back to the LLM. This essentially bridges the gap between text generation and software execution, giving the LLM 'hands' to manipulate digital environments and interact with external systems.",
    
    "tool_002": "When the LLM calls a tool, your application executes the tool locally. You then take the result (e.g., a JSON string or raw text) and append it to the conversation history as a new message with role='tool' or role='function', then call the LLM again. The LLM reads this newly injected context, understands the output of its action, and synthesizes a final natural language response or decides to execute yet another tool based on the data it received.",
    
    "tool_003": "Yes! You can give an agent a 'code_interpreter' tool. The LLM generates a Python script, your system executes it in an isolated sandbox (like Docker), and returns the standard output or error back to the agent so it can fix bugs or proceed. This allows agents to perform highly complex data analysis, scrape web pages, manipulate files, and build applications on the fly by writing and running actual software.",
    
    "mem_001": "Agents maintain memory by storing conversation history. For short-term memory, the full transcript is passed in the context window. For long-term memory, past interactions are summarized or stored in a vector database and retrieved using RAG when relevant. More advanced architectures utilize entity extraction to populate structured memory graphs (knowledge graphs), enabling the agent to retain specific facts about users and projects over weeks or months without ballooning the prompt context.",
    
    "mem_002": "When the context window is exceeded, the LLM will fail or hallucinate due to token limits. To solve this, developers use techniques like 'context sliding' (dropping oldest messages), recursive summarization of past messages, or offloading knowledge to a vector store. By systematically compressing older logs and retrieving only semantically relevant history on demand, agents can maintain coherent, virtually infinite conversations without hitting hard token ceilings.",
    
    "mem_003": "A system prompt is the foundational instruction set given to an agent at the very beginning of the context window. It defines the agent's persona, its goals, the rules it must follow, and the specific formatting it should use when outputting text or calling tools. A robust system prompt also outlines constraints and safety guardrails, dictating what the agent is strictly prohibited from doing, ensuring predictable and secure behavior in production.",
    
    "mem_004": "To summarize old memory, you run a background LLM process that takes chunks of the oldest conversation history and asks the LLM to 'Extract the key facts and decisions'. You then replace those verbose raw messages with the single dense summary block. This memory condensation process saves token costs and speeds up inference time while ensuring that the core context and narrative arc of the conversation are perfectly preserved for the agent to reference.",
    
    "multi_001": "A multi-agent system involves multiple specialized AI agents working together to solve a complex task. For example, a 'Coder' agent might write code, while a 'Reviewer' agent critiques it, and a 'Manager' agent orchestrates the workflow between them. By separating concerns and assigning unique system prompts and tools to individual agents, the overall system becomes significantly more capable, resilient, and capable of handling complex software engineering pipelines.",
    
    "multi_002": "Popular frameworks include Microsoft AutoGen, CrewAI, and LangGraph. These frameworks provide primitives for defining specialized agents, tools, and the routing logic (like state machines or hierarchical structures) to pass messages between them. LangGraph focuses heavily on deterministic graph flows, AutoGen excels at conversational multi-agent chat patterns, and CrewAI simplifies role-playing agent orchestration for complex workflows.",
    
    "multi_003": "Agents communicate by passing messages to a central orchestrator or directly to each other. Frameworks like LangGraph use a state graph where the output of one agent becomes the input state for the next, acting like a conversational assembly line. In decentralized setups, agents can broadcast messages to a shared memory pool or message bus, allowing relevant agents to subscribe, analyze, and respond to updates independently.",
    
    "multi_004": "A supervisor (or router) agent is a top-level agent that doesn't solve tasks directly. Instead, it analyzes the user's request and decides which specialized sub-agent (e.g., the Research Agent or the Coding Agent) should handle it. The supervisor acts as a traffic controller, delegating work, aggregating the results from the sub-agents, and presenting a unified, final answer back to the user, ensuring highly efficient task distribution.",
    
    "rag_001": "Retrieval-Augmented Generation (RAG) improves an agent by giving it access to external, up-to-date, or proprietary knowledge that wasn't in its training data. Instead of hallucinating facts, the agent retrieves documents from a vector store and uses them to ground its answers. This drastically increases factual accuracy, provides a mechanism for citing sources, and allows the AI to answer highly specialized questions about private corporate data.",
    
    "rag_002": "Ideally, an agent should use a hybrid approach. Dense vector search (embeddings) is great for semantic meaning and conceptual matches, while keyword search (BM25) is better for exact matches on names, acronyms, or specific IDs. By combining both through reciprocal rank fusion (RRF), the agent benefits from understanding broad intent while never missing documents that contain exact product numbers or unique identifiers.",
    
    "rag_003": "Chunking is the process of breaking large documents (like PDFs or books) into smaller, overlapping segments before embedding them into a vector database. This ensures that the RAG retrieval returns precise, focused context instead of overwhelming the LLM with entire documents. Advanced chunking strategies involve semantic splitting, which breaks text at logical boundaries like paragraphs or headers, rather than arbitrary character limits, preserving context.",
    
    "rag_004": "To prevent hallucinations, explicitly add instructions to your agent's system prompt like: 'You must ONLY answer using the provided context. If the answer is not in the context, say you do not know.' Additionally, you can add a post-generation verification step where a secondary LLM checks if the generated answer is fully supported by the retrieved documents before returning it to the user.",
    
    "rag_005": "Yes. An advanced agent can be equipped with a 'save_to_memory' tool. If it learns a new fact or successfully solves a novel bug during a conversation, it can call this tool to embed the solution into its vector database for future reference. This creates a self-improving agent that continuously expands its knowledge base organically as it interacts with users and solves increasingly complex problems."
}

for item in data["faqItems"]:
    if item["id"] in expansions:
        item["answer"] = expansions[item["id"]]

with open("data/knowledge_base/faqs.json", "w") as f:
    json.dump(data, f, indent=2)

print("Expanded all FAQs!")
