"""
AgentFlow Support Bot - FastAPI Backend
Main application server with streaming support
"""

import os
import json
import asyncio
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Prevent PyTorch/Tokenizers deadlocks on macOS threadpools
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent))

from chatbot.core import ChatbotCore
from chatbot.rag_pipeline import RAGPipeline
from database import connect_to_mongo, close_mongo_connection
import auth_routes

app = FastAPI(
    title="AgentFlow Support Bot API",
    description="AI-powered customer service chatbot with RAG",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)

class ChatRequest(BaseModel):
    message: str
    model: str = "llama3.2:latest"
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    sources: List[dict]
    confidence: float
    is_on_topic: bool

class HealthResponse(BaseModel):
    status: str
    rag_ready: bool
    model_ready: bool

chatbot_core = None
rag_pipeline = None

@app.on_event("startup")
async def startup_event():
    global chatbot_core, rag_pipeline

    print("\n" + "="*70)
    print("🚀 INITIALIZING AGENTFLOW BOT")
    print("="*70)

    try:
        await connect_to_mongo()
        
        kb_path = Path(__file__).parent.parent / "data" / "knowledge_base" / "faqs.json"
        print(f"\n📚 Loading knowledge base from: {kb_path}")

        with open(kb_path, 'r') as f:
            knowledge_base = json.load(f)

        print(f"✅ Loaded {len(knowledge_base['faqItems'])} FAQ items")

        print("\n🔧 Initializing RAG pipeline...")
        rag_pipeline = RAGPipeline(knowledge_base)

        print("\n🤖 Initializing chatbot core...")
        chatbot_core = ChatbotCore(rag_pipeline)

        print("\n" + "="*70)
        print("✅ AGENTFLOW BOT READY!")
        print("="*70)
        print(f"\n🌐 API running on http://0.0.0.0:8000")
        print(f"📖 API docs available at http://0.0.0.0:8000/docs")
        print("="*70 + "\n")

    except Exception as e:
        print(f"\n❌ ERROR DURING INITIALIZATION:")
        print(f"   {str(e)}")
        import traceback
        traceback.print_exc()
        raise

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {
        "name": "AgentFlow Support Bot",
        "description": "AI-powered customer service chatbot",
        "version": "1.0.0",
        "endpoints": {
            "chat": "POST /chat",
            "chat_stream": "POST /chat/stream",
            "health": "GET /health",
            "knowledge_base": "GET /knowledge-base",
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        rag_ready=rag_pipeline is not None,
        model_ready=chatbot_core is not None
    )

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG pipeline not initialized")
    
    try:
        content = await file.read()
        text = content.decode("utf-8")
        
        # Add to RAG pipeline (we will implement this method in rag.py)
        rag_pipeline.add_document(text, filename=file.filename)
        
        return {"status": "success", "message": f"Successfully embedded {file.filename}"}
    except Exception as e:
        print(f"❌ Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not chatbot_core or not rag_pipeline:
        raise HTTPException(status_code=503, detail="Chatbot not ready")

    if not request.message or len(request.message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        response_data = chatbot_core.generate_response(
            request.message,
            request.conversation_id
        )
        return ChatResponse(
            response=response_data['response'],
            sources=response_data['sources'],
            confidence=response_data['confidence'],
            is_on_topic=response_data['is_on_topic']
        )
    except Exception as e:
        print(f"❌ Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint using Server-Sent Events.
    Streams the Ollama response token-by-token for instant feedback.
    """
    if not chatbot_core or not rag_pipeline:
        raise HTTPException(status_code=503, detail="Chatbot not ready")

    if not request.message or len(request.message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    async def generate():
        try:
            # Run RAG retrieval first (fast — local numpy ops)
            is_on_topic = rag_pipeline.is_on_topic(request.message)
            retrieved_items = rag_pipeline.retrieve(request.message)
            context, citations = rag_pipeline.generate_context(retrieved_items)

            if retrieved_items:
                confidence = sum(item["score"] for item in retrieved_items) / len(retrieved_items)
            else:
                confidence = 0.0

            # 🚀 Fast-path: If the user clicked a suggestion, bypass Ollama and return the exact answer instantly
            exact_match = None
            for item in rag_pipeline.kb_items:
                if item["question"].strip().lower() == request.message.strip().lower():
                    exact_match = item
                    break
            
            if exact_match:
                # Stream the answer in one chunk
                yield f"data: {json.dumps({'type': 'token', 'content': exact_match['answer']})}\n\n"
                
                # Append citation
                citation_text = f"\n\n**Sources:**\n- {exact_match['category']}: \"{exact_match['question']}\"\n"
                yield f"data: {json.dumps({'type': 'token', 'content': citation_text})}\n\n"
                
                # Send done event
                yield f"data: {json.dumps({'type': 'done', 'sources': [exact_match], 'confidence': 1.0, 'is_on_topic': True})}\n\n"
                return

            system_prompt = chatbot_core.system_prompt.format(
                context=context if context else "No knowledge base items found."
            )

            # Stream token-by-token from Ollama
            try:
            import os
            groq_key = os.environ.get("GROQ_API_KEY")

            if groq_key:
                from groq import AsyncGroq
                client = AsyncGroq(api_key=groq_key)
                
                stream = await client.chat.completions.create(
                    model="llama3-8b-8192",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user",   "content": request.message},
                    ],
                    stream=True,
                )

                full_response = ""
                async for chunk in stream:
                    token = chunk.choices[0].delta.content or ""
                    if token:
                        full_response += token
                        yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"
                        
            else:
                from ollama import AsyncClient
                
                stream = await AsyncClient().chat(
                    model=request.model,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user",   "content": request.message},
                    ],
                    stream=True,
                    options={"num_predict": 200, "num_ctx": 2048}
                )

                full_response = ""
                tool_calls = []
                async for chunk in stream:
                    if chunk.get("message") and chunk["message"].get("tool_calls"):
                        tool_calls = chunk["message"]["tool_calls"]
                        break
                        
                    token = chunk["message"].get("content", "")
                    if token:
                        full_response += token
                        # Send token as SSE
                        yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

                # If Ollama decided to call a tool
                if tool_calls:
                    tool_msg = '\n\n*Agent is searching the web...*\n\n'
                    yield f"data: {json.dumps({'type': 'token', 'content': tool_msg})}\n\n"
                    
                    for call in tool_calls:
                        if call["function"]["name"] == "search_web":
                            query = call["function"]["arguments"].get("query", "")
                            # Simulated search result for prototype
                            tool_result = f"Web search results for '{query}': AgentFlow v2.0 includes dynamic RAG, local models, and real-time tool calling!"
                            
                            # Second pass to generate final answer
                            stream2 = await AsyncClient().chat(
                                model=request.model,
                                messages=[
                                    {"role": "system", "content": system_prompt},
                                    {"role": "user",   "content": request.message},
                                    {"role": "assistant", "content": "", "tool_calls": tool_calls},
                                    {"role": "tool", "content": tool_result}
                                ],
                                stream=True,
                                options={"num_predict": 200, "num_ctx": 2048}
                            )
                            
                            async for chunk2 in stream2:
                                token = chunk2["message"].get("content", "")
                                if token:
                                    full_response += token
                                    yield f"data: {json.dumps({'type': 'token', 'content': token})}\n\n"

                # Append citations to final response
                if citations:
                    citation_text = "\n\n**Sources:**\n"
                    for c in citations:
                        citation_text += f'- {c["category"]}: "{c["question"]}"\n'
                    full_response += citation_text
                    yield f"data: {json.dumps({'type': 'token', 'content': citation_text})}\n\n"

                # Send metadata as final event
                yield f"data: {json.dumps({'type': 'done', 'sources': citations, 'confidence': min(confidence, 1.0), 'is_on_topic': is_on_topic})}\n\n"

            except Exception as e:
                # Fallback: send full response at once
                fallback = chatbot_core._generate_fallback_response(
                    request.message, retrieved_items, is_on_topic
                )
                formatted = chatbot_core._format_response_with_citations(fallback, citations)
                yield f"data: {json.dumps({'type': 'token', 'content': formatted})}\n\n"
                yield f"data: {json.dumps({'type': 'done', 'sources': citations, 'confidence': min(confidence, 1.0), 'is_on_topic': is_on_topic})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


@app.get("/knowledge-base")
async def get_knowledge_base():
    if not rag_pipeline:
        raise HTTPException(status_code=503, detail="RAG not ready")
    stats = rag_pipeline.get_kb_stats()
    return {
        "total_items": stats['total_items'],
        "categories": stats['categories'],
        "categories_count": stats['categories_count'],
        "status": "ready"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
