#!/bin/bash

# MOCK IDEA AI Service Startup Script

echo "🚀 Starting MOCK IDEA AI Service..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Create models directory if it doesn't exist
if [ ! -d "models" ]; then
    echo "📁 Creating models directory..."
    mkdir models
fi

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "Please edit .env file with your configuration"
fi

# Start the service
echo "🎯 Starting AI service on http://localhost:8000"
echo "📖 API documentation available at http://localhost:8000/docs"
echo "❤️ Health check at http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
