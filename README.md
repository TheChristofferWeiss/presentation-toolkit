# Presentation Toolkit

A powerful tool for event tech producers to handle last-minute presentation files and conversions.

## 🌐 **NEW: Web Interface Available!**

Use the toolkit in your browser with a beautiful drag-and-drop UI:
```bash
./start_web.sh
```
Then open: http://localhost:8080

**See**: `WEB_INTERFACE_GUIDE.md` for complete web UI documentation

## 🎬 **NEW: Interactive Presentation System!**

Transform PPTX files into interactive web presentations with animations and real-time control:

```bash
npm install
npm run dev
```

**Features:**
- Convert PPTX to interactive web presentations
- GSAP-powered animations and transitions  
- Real-time presenter controls
- Slide notes and preview
- Fullscreen presentation mode
- Supabase backend integration

**See**: `docs/PRESENTATION_SYSTEM.md` for complete architecture documentation

## Features

- **🎬 Interactive Presentations**: Convert PPTX to web presentations with GSAP animations (NEW!)
- **🌐 Web Interface**: Beautiful browser-based UI with drag-and-drop
- **🔍 Font Hunter**: Automatically hunt for fonts across 10 free repositories and generate acquisition reports
- **📦 Font Extraction**: Extract embedded fonts from PowerPoint (.pptx) and Keynote files
- **📄 PDF Conversion**: Convert PDF files to PowerPoint presentations with images
- **⚡ Batch Processing**: Process multiple files at once
- **📊 Smart Reports**: Generate beautiful HTML reports with download and purchase links
- **🗂️ Organized Output**: Fonts and converted files saved in separate, organized folders

## Installation

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. For PDF to image conversion, install Poppler:
   - macOS: `brew install poppler`
   - Ubuntu/Debian: `sudo apt-get install poppler-utils`
   - Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases/

## Usage

### 🌐 Web Interface (Easiest Way!)

Start the web server and use the toolkit in your browser:

```bash
./start_web.sh
```

Then open **http://localhost:8080** in your browser.

**Features:**
- Drag & drop file upload
- Visual results with statistics
- One-click font hunting
- Download reports and fonts
- No command line needed!

**See**: `WEB_INTERFACE_GUIDE.md` for full documentation

---

### Command Line Interface

### 🔍 Hunt for Fonts (Most Powerful Feature!)

The Font Hunter automatically searches for fonts across 10 free repositories, downloads Google Fonts, and generates a comprehensive HTML report.

```bash
python presentation_toolkit.py hunt-fonts <file_or_directory>
```

Examples:
```bash
# Hunt for fonts in a presentation
python presentation_toolkit.py hunt-fonts presentation.pptx

# Process all presentations in a folder
python presentation_toolkit.py hunt-fonts ./presentations/

# Custom project name
python presentation_toolkit.py hunt-fonts presentation.pptx -p "EventName2024"

# Verbose output
python presentation_toolkit.py hunt-fonts presentation.pptx -v
```

**Output**: 
- Auto-downloaded Google Fonts (ready to install)
- Beautiful HTML report with links to free fonts
- Shopping list for commercial fonts with marketplace links

**See**: `FONT_HUNTER_GUIDE.md` for complete documentation

### Extract Fonts from Presentations

```bash
python presentation_toolkit.py extract-fonts <file_or_directory>
```

Examples:
```bash
# Extract fonts from a single file
python presentation_toolkit.py extract-fonts presentation.pptx

# Process all presentations in a folder
python presentation_toolkit.py extract-fonts ./presentations/

# Specify custom output folder
python presentation_toolkit.py extract-fonts presentation.pptx --output ./my_fonts/
```

### Convert PDF to PowerPoint

```bash
python presentation_toolkit.py pdf-to-pptx <pdf_file>
```

Examples:
```bash
# Convert a single PDF
python presentation_toolkit.py pdf-to-pptx document.pdf

# Convert with custom output
python presentation_toolkit.py pdf-to-pptx document.pdf --output ./converted/

# Adjust image DPI (default: 300)
python presentation_toolkit.py pdf-to-pptx document.pdf --dpi 200
```

### Process Multiple Files

```bash
# Extract fonts from all presentations in a directory
python presentation_toolkit.py extract-fonts ./urgent_presentations/

# Convert all PDFs in a directory
python presentation_toolkit.py pdf-to-pptx ./pdfs/
```

## Output Structure

```
presentation-toolkit/
├── extracted_fonts/           # Extracted fonts organized by source file
│   ├── presentation1/
│   │   ├── Arial.ttf
│   │   └── Helvetica.ttf
│   └── presentation2/
│       └── CustomFont.otf
└── converted_pptx/           # PDFs converted to PowerPoint
    ├── document1.pptx
    └── document2.pptx
```

## Supported Formats

- **Font Hunting**: .pptx (PowerPoint), .key (Keynote - macOS only)
- **Font Extraction**: .pptx (PowerPoint), .key (Keynote - macOS only)  
- **PDF Conversion**: .pdf

## Documentation

- **docs/PRESENTATION_SYSTEM.md** - Interactive presentation system architecture (NEW!)
- **WEB_INTERFACE_GUIDE.md** - Web interface documentation
- **FONT_HUNTER_GUIDE.md** - Complete guide to the Font Hunter feature
- **QUICK_REFERENCE.md** - Command cheat sheet
- **START_HERE.md** - Quick start guide
- **SETUP.md** - Installation and setup
- **TROUBLESHOOTING.md** - Common issues and solutions
- **PROJECT_SUMMARY.md** - Technical overview

## Notes

- Keynote font extraction requires macOS with pyobjc installed
- Font extraction from .pptx files works by analyzing embedded fonts in the file
- PDF conversion creates one slide per page with the page rendered as an image
- Extracted fonts are copied (not moved) from presentations

## Troubleshooting

**PDF conversion fails**: Make sure Poppler is installed on your system.

**Keynote files not working**: Keynote processing requires macOS. Install pyobjc: `pip install pyobjc-framework-Cocoa`

**Fonts not found**: Some presentations may reference fonts without embedding them. Only embedded fonts can be extracted.

