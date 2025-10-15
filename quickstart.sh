#!/bin/bash

# Presentation Toolkit - Quick Start Script
# This script helps you set up and test the toolkit

echo "=========================================="
echo "Presentation Toolkit - Quick Start"
echo "=========================================="
echo ""

# Check Python version
echo "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.8 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
echo "✓ Found Python $PYTHON_VERSION"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
echo "✓ Virtual environment activated"
echo ""

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip -q
pip install -r requirements.txt -q
echo "✓ Dependencies installed"
echo ""

# Check for Poppler (required for PDF conversion)
echo "Checking for Poppler (required for PDF conversion)..."
if command -v pdftoppm &> /dev/null; then
    echo "✓ Poppler is installed"
else
    echo "⚠ Poppler not found. PDF conversion will not work."
    echo "  Install with: brew install poppler (macOS)"
    echo "  or: sudo apt-get install poppler-utils (Ubuntu/Debian)"
fi
echo ""

# Make main script executable
chmod +x presentation_toolkit.py
echo "✓ Made presentation_toolkit.py executable"
echo ""

# Test the installation
echo "Testing the toolkit..."
if python presentation_toolkit.py --version &> /dev/null; then
    echo "✓ Toolkit is working!"
else
    echo "❌ There was an error testing the toolkit"
    exit 1
fi
echo ""

echo "=========================================="
echo "Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "Quick command reference:"
echo ""
echo "  Extract fonts from presentations:"
echo "    python presentation_toolkit.py extract-fonts <file_or_folder>"
echo ""
echo "  Convert PDF to PowerPoint:"
echo "    python presentation_toolkit.py pdf-to-pptx <pdf_file>"
echo ""
echo "  Get file info:"
echo "    python presentation_toolkit.py info <file>"
echo ""
echo "  Show help:"
echo "    python presentation_toolkit.py --help"
echo ""
echo "For detailed documentation, see README.md and SETUP.md"
echo ""
echo "Note: Remember to activate the virtual environment before use:"
echo "  source venv/bin/activate"
echo ""


