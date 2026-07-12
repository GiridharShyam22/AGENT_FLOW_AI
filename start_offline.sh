#!/bin/bash
echo "Starting AgentFlow AI offline..."

# 1. Start Backend
echo "Setting up Backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo "Setting up Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!
cd ..

echo "==========================================================="
echo "✅ AgentFlow AI is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop both servers."
echo "==========================================================="

wait $BACKEND_PID $FRONTEND_PID
