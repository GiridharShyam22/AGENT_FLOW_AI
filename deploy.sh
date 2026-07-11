#!/bin/bash
set -e

echo "🚀 Starting AgentFlow AI Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "📦 Building and starting containers in detached mode..."
docker-compose up --build -d

echo "⏳ Waiting for Ollama to initialize (15s)..."
sleep 15

echo "🧠 Pulling Llama 3.2 model into Ollama container (this may take a few minutes)..."
docker exec -it agentflow-ollama ollama run llama3.2:latest "Hello!" > /dev/null 2>&1 || true

echo "✅ Deployment successful!"
echo "🌐 Frontend available at: http://localhost"
echo "🔌 Backend API available at: http://localhost:8000"
echo "🗄️  MongoDB available at: mongodb://localhost:27017"
