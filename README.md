# AgentFlow AI - RAG Support Bot

An enterprise-grade, offline-first AI Knowledge Platform built with **Retrieval-Augmented Generation (RAG)**, **FastAPI**, and **Ollama**.

## 🎯 Domain & Goal
This project focuses on the domain of **Enterprise SaaS Customer Support**. The bot acts as an intelligent assistant for a fictional SaaS platform ("AgentFlow"). It answers questions strictly constrained by a local knowledge base (`faqs.json`), providing immediate, accurate responses regarding account management, billing, privacy, and feature usage without risking data leaks or hallucinations.

## 🏗️ Architecture & Approach
We utilized a **Pretrained Model + Strong Prompting** approach, enhanced by a custom **RAG Layer**.

- **Frontend:** React + Vite. Features a stunning dark monochrome UI, real-time token streaming, user authentication, and an interactive suggestion board.
- **Backend:** FastAPI (Python). Exposes endpoints for chat, streaming (`Server-Sent Events`), and system health.
- **AI Core:** `Ollama` running `Llama 3.2` locally.
- **RAG Pipeline:** `sentence-transformers` (`all-MiniLM-L6-v2`) handles local embeddings. It processes `faqs.json` into memory, performs cosine similarity searches against incoming user queries, and injects the top-K relevant chunks directly into the LLM's system prompt alongside strict grounding instructions.

### Why this approach? (Tradeoffs Navigated)
**Tradeoff:** Cloud API (OpenAI) vs. Local Inference (Ollama)
We explicitly chose to run the LLM locally via Ollama. 
- *Pro:* 100% data privacy. Enterprise customer queries never leave the network, which is critical for a support bot handling sensitive account questions.
- *Con:* Requires more local compute and RAM than simply hitting an external API, and response generation speed depends heavily on the host machine's hardware.
- *Mitigation:* We mitigate the slower token generation speeds of local inference by implementing full **Server-Sent Events (SSE) streaming**. Time-To-First-Token (TTFT) is nearly instant, providing a seamless user experience while the rest of the answer generates.

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- [Ollama](https://ollama.ai/) installed locally

### 1. Start Ollama
Ensure Ollama is running and you have pulled the `llama3.2` model:
```bash
ollama run llama3.2:latest
```

### 2. Backend Setup (FastAPI)
Navigate to the `backend/` directory, install dependencies, and start the server:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload
```
The backend will run on `http://localhost:8000`

### 3. Frontend Setup (React/Vite)
Open a new terminal, navigate to the `frontend/` directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## ✨ Features
- **Strict Grounding:** The bot politely refuses to answer off-topic questions not covered by the `faqs.json` knowledge base.
- **Source Citations:** RAG pipeline appends specific document citations to every generated answer.
- **Real-time Streaming:** Token-by-token streaming response (SSE) for a snappy user experience.
- **Evaluation Script:** Included a standalone script (`backend/eval.py`) to systematically test the RAG pipeline's accuracy against a batch of questions.
