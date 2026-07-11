# Quick Start Guide - AgentFlow Support Bot

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies (2 minutes)

```bash
cd techflow-support-bot
pip install -r requirements.txt
```

### Step 2: Set API Key (1 minute)

```bash
# Option A: Export as environment variable
export ANTHROPIC_API_KEY="sk-ant-your-api-key-here"

# Option B: Create .env file
echo "ANTHROPIC_API_KEY=sk-ant-your-key" > .env
```

Get your API key from: https://console.anthropic.com/account/keys

### Step 3: Start Backend (1 minute)

```bash
python backend/app.py
```

You should see:
```
✅ AGENTFLOW SUPPORT BOT READY!
🌐 API running on http://0.0.0.0:8000
```

### Step 4: Start Frontend (New Terminal)

```bash
cd frontend
python -m http.server 8080
```

### Step 5: Open Browser

Visit: **http://localhost:8080**

Done! 🎉

---

## 💬 Try It Out

Ask questions like:
- "How do I create an account?"
- "What are the pricing plans?"
- "How do I enable two-factor authentication?"
- "Can I share projects with my team?"

---

## 🧪 Run Tests

```bash
python run_evaluation.py
```

Expected output:
```
Pass Rate: 95%
Average Confidence: 0.88
On-Topic Accuracy: 95.0%
```

---

## 🎮 Interactive Demo

```bash
python example_usage.py
```

This runs example queries and enters interactive mode.

---

## ⚙️ Customization

### Add Your Own FAQs

Edit `data/knowledge_base/faqs.json`:

```json
{
  "faqItems": [
    {
      "id": 21,
      "category": "Your Category",
      "question": "Your question?",
      "answer": "Your answer",
      "tags": ["tag1", "tag2"]
    }
  ]
}
```

Then restart backend. Changes take effect immediately!

### Change Model

Edit `backend/chatbot/core.py`:

```python
# Line in _call_claude_api()
model="claude-3-opus-20240229"  # Use Opus (more powerful)
# or
model="claude-3-haiku-20240307" # Use Haiku (faster, cheaper)
```

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check API key is set
echo $ANTHROPIC_API_KEY

# If empty, set it
export ANTHROPIC_API_KEY="sk-ant-..."

# Verify Python version
python --version  # Should be 3.9+

# Try installing dependencies again
pip install -r requirements.txt --force-reinstall
```

### Frontend won't load

```bash
# Make sure frontend server is running
# Terminal should show: Serving HTTP on 0.0.0.0 port 8080

# Try different port
cd frontend
python -m http.server 8081

# Visit http://localhost:8081
```

### Bot says "Connecting..."

```bash
# Check backend is running
curl http://localhost:8000/health

# Check CORS is working
curl -X OPTIONS http://localhost:8000/chat

# Check browser console for errors
# Press F12 to open developer tools
```

### Slow responses

- Check internet connection
- Verify Claude API is responsive  
- Reduce TOP_K in backend/app.py from 3 to 1

### "ANTHROPIC_API_KEY" error

```bash
# Get key from https://console.anthropic.com
# Then set it:
export ANTHROPIC_API_KEY="sk-ant-your-key"

# Verify it's set
echo $ANTHROPIC_API_KEY
```

---

## 📁 File Locations

| Component | Location |
|-----------|----------|
| Backend Server | `backend/app.py` |
| Frontend UI | `frontend/index.html` |
| Knowledge Base | `data/knowledge_base/faqs.json` |
| Tests | `data/test_questions.json` |
| Test Runner | `run_evaluation.py` |
| Examples | `example_usage.py` |
| Config | `.env.example` → `.env` |
| Requirements | `requirements.txt` |

---

## 🚀 What's Next?

1. **Learn** - Read `README.md` for full documentation
2. **Explore** - Check out `backend/` and `frontend/` code
3. **Customize** - Add your own knowledge base items
4. **Deploy** - See README.md for deployment options
5. **Integrate** - Add to your own application

---

## 📞 Quick Help

| Issue | Solution |
|-------|----------|
| API Key Error | Get from https://console.anthropic.com |
| Import Error | Run `pip install -r requirements.txt` |
| Port Already in Use | Use different port: `python -m http.server 8081` |
| Slow Response | Reduce `TOP_K_RETRIEVAL` from 3 to 1 |
| CORS Error | Check frontend URL is http://localhost:8080 |

---

## ✨ Features to Try

- ✅ Ask on-topic questions ("How do I create an account?")
- ✅ Get off-topic detection ("What's the weather?")
- ✅ See source citations  
- ✅ View confidence scores
- ✅ Try different questions
- ✅ Run evaluation tests
- ✅ Customize knowledge base

---

**Happy Chatting! 🤖**

For more details, see `README.md`

