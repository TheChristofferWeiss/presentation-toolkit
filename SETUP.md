# Setup Guide

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation Steps

### 1. Install Python Dependencies

```bash
cd /Users/christoffer/presentation-toolkit
pip install -r requirements.txt
```

Or if you prefer using a virtual environment (recommended):

```bash
cd /Users/christoffer/presentation-toolkit

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Install Poppler (for PDF conversion)

Poppler is required for PDF to image conversion.

**macOS:**
```bash
brew install poppler
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install poppler-utils
```

**Windows:**
1. Download from: https://github.com/oschwartz10612/poppler-windows/releases/
2. Extract to a location (e.g., `C:\Program Files\poppler`)
3. Add the `bin` folder to your PATH environment variable

### 3. (Optional) Keynote Support on macOS

For Keynote file support, install PyObjC:

```bash
pip install pyobjc-framework-Cocoa
```

Note: Keynote support is only available on macOS.

## Verify Installation

Test that everything is installed correctly:

```bash
# Test the CLI
python presentation_toolkit.py --help

# You should see the help menu with available commands
```

## Quick Start

### Extract Fonts from a Presentation

```bash
# Single file
python presentation_toolkit.py extract-fonts myfile.pptx

# Entire directory
python presentation_toolkit.py extract-fonts ./presentations/

# With verbose output
python presentation_toolkit.py extract-fonts myfile.pptx -v
```

### Convert PDF to PowerPoint

```bash
# Single file
python presentation_toolkit.py pdf-to-pptx document.pdf

# Entire directory
python presentation_toolkit.py pdf-to-pptx ./pdfs/

# With custom DPI
python presentation_toolkit.py pdf-to-pptx document.pdf --dpi 200
```

### Get File Information

```bash
python presentation_toolkit.py info presentation.pptx
```

## Troubleshooting

### PDF Conversion Fails

**Error:** `PDFInfoNotInstalledError` or similar

**Solution:** Make sure Poppler is installed and in your PATH:
```bash
# Test if Poppler is installed
pdftoppm -h

# If not found, install Poppler (see step 2 above)
```

### Permission Errors

**Error:** Permission denied when running scripts

**Solution:** Make the script executable:
```bash
chmod +x presentation_toolkit.py
```

### Module Not Found Errors

**Error:** `ModuleNotFoundError: No module named 'pptx'` or similar

**Solution:** Make sure you've installed all dependencies:
```bash
pip install -r requirements.txt
```

If using a virtual environment, make sure it's activated before running the toolkit.

### Keynote Files Not Working

**Error:** Issues with .key files

**Notes:**
- Keynote support is limited to macOS
- Some newer Keynote files may use proprietary formats that are difficult to parse
- Focus on .pptx files for best results

## Directory Structure After Setup

```
presentation-toolkit/
├── presentation_toolkit.py    # Main CLI tool
├── font_extractor.py          # Font extraction module
├── pdf_converter.py           # PDF conversion module
├── examples.py                # Example usage scripts
├── requirements.txt           # Python dependencies
├── README.md                 # User guide
├── SETUP.md                  # This file
├── .gitignore
├── extracted_fonts/          # Created when extracting fonts
├── converted_pptx/           # Created when converting PDFs
└── temp/                     # Temporary files (auto-cleaned)
```

## Next Steps

1. Read the [README.md](README.md) for detailed usage instructions
2. Check out [examples.py](examples.py) for code examples
3. Start processing your files!

## Support

If you encounter issues:
1. Check that all dependencies are installed
2. Verify Poppler is in your PATH (for PDF conversion)
3. Make sure you're using Python 3.8 or higher
4. Try running with verbose flag (-v) to see detailed error messages


