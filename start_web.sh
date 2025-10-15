#!/bin/bash

# Presentation Toolkit - Web Interface Startup Script

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                              ║"
echo "║              🌐 Presentation Toolkit - Web Interface                         ║"
echo "║                                                                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8 or higher."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "⚠️  Virtual environment not found. Run ./quickstart.sh first."
    echo ""
    read -p "Create virtual environment now? (y/N): " response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        exit 1
    fi
else
    source venv/bin/activate
fi

echo "✓ Virtual environment activated"
echo ""

# Check if Flask is installed
if ! python -c "import flask" 2>/dev/null; then
    echo "📦 Installing Flask..."
    pip install Flask Werkzeug
    echo "✓ Flask installed"
fi

echo "🚀 Starting web server..."
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "  🌐 Web Interface will open at:"
echo ""
echo "     http://localhost:5000"
echo ""
echo "  📝 What you can do:"
echo "     • Upload presentations and PDFs"
echo "     • Hunt for fonts across 10 repositories"
echo "     • Extract embedded fonts"
echo "     • Convert PDFs to PowerPoint"
echo "     • Download results and reports"
echo ""
echo "  ⚙️  Press CTRL+C to stop the server"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Start the web application
python web_app.py


