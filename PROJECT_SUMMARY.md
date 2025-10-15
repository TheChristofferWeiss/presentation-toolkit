# Presentation Toolkit - Project Summary

## Overview

**Presentation Toolkit** is a professional tool designed for event tech producers who frequently deal with last-minute presentation files in various formats. It solves two critical problems:

1. **Font Management**: Extract embedded fonts from PowerPoint (.pptx) and Keynote (.key) files to ensure proper display across different systems
2. **Format Conversion**: Convert PDF files to editable PowerPoint presentations

## Key Features

### Font Extraction
- ✅ Extract embedded fonts from PowerPoint (.pptx) files
- ✅ Extract fonts from Keynote (.key) files (macOS only)
- ✅ Identify all font references in presentations
- ✅ Organize fonts by source presentation
- ✅ Batch processing for multiple files

### PDF to PowerPoint Conversion
- ✅ Convert any PDF to PowerPoint presentation
- ✅ Each page becomes a slide with high-quality image
- ✅ Adjustable DPI for quality vs. file size balance
- ✅ Maintains aspect ratio and centers content
- ✅ Batch conversion of multiple PDFs

### User Experience
- ✅ Simple command-line interface
- ✅ Colorful, informative output
- ✅ Progress bars for batch operations
- ✅ Verbose mode for detailed information
- ✅ Comprehensive error handling

## Project Structure

```
presentation-toolkit/
├── presentation_toolkit.py    # Main CLI application
├── font_extractor.py          # Font extraction logic
├── pdf_converter.py           # PDF conversion logic
├── examples.py                # Code examples
├── test_demo.py              # Demo and test script
├── __init__.py               # Package initialization
│
├── quickstart.sh             # Automated setup script
├── requirements.txt          # Python dependencies
│
├── README.md                 # User documentation
├── SETUP.md                  # Installation guide
├── QUICK_REFERENCE.md        # Command cheat sheet
├── PROJECT_SUMMARY.md        # This file
├── LICENSE                   # MIT License
└── .gitignore               # Git ignore rules
```

## Technical Stack

### Core Libraries
- **python-pptx**: PowerPoint file manipulation
- **pdf2image**: PDF to image conversion
- **Pillow**: Image processing
- **fonttools**: Font file analysis
- **click**: CLI framework
- **colorama**: Cross-platform colored terminal output
- **tqdm**: Progress bars

### External Dependencies
- **Poppler**: Required for PDF rendering (system package)
- **PyObjC** (optional): For Keynote support on macOS

## Use Cases

### 1. Last-Minute Presentation Prep
```bash
# Someone emails you 5 presentations at 11 PM
python presentation_toolkit.py extract-fonts ./urgent_files/ -v
# All fonts extracted and ready to install
```

### 2. Font Backup for Events
```bash
# Before a conference, backup all fonts from presentations
python presentation_toolkit.py extract-fonts ./conference_2024/ --output ./font_backup/
# Safe backup of all embedded fonts
```

### 3. PDF Presenter Slides
```bash
# Speaker sends PDF instead of PowerPoint
python presentation_toolkit.py pdf-to-pptx speaker_slides.pdf
# Now you have an editable PPTX file
```

### 4. Batch Processing
```bash
# Process an entire directory of mixed files
python presentation_toolkit.py extract-fonts ./presentations/
python presentation_toolkit.py pdf-to-pptx ./pdfs/
# Everything processed automatically
```

## Installation

### Quick Start (Recommended)
```bash
cd presentation-toolkit
./quickstart.sh
```

### Manual Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Poppler (macOS)
brew install poppler

# Install Poppler (Ubuntu/Debian)
sudo apt-get install poppler-utils
```

## Usage Examples

### Extract Fonts
```bash
# Single file
python presentation_toolkit.py extract-fonts presentation.pptx

# Directory
python presentation_toolkit.py extract-fonts ./urgent_presentations/ -v

# Custom output
python presentation_toolkit.py extract-fonts file.pptx --output ./fonts/
```

### Convert PDF
```bash
# Single file
python presentation_toolkit.py pdf-to-pptx document.pdf

# Directory
python presentation_toolkit.py pdf-to-pptx ./pdfs/

# High quality
python presentation_toolkit.py pdf-to-pptx file.pdf --dpi 400
```

### Get File Info
```bash
python presentation_toolkit.py info presentation.pptx
```

## Output Structure

```
presentation-toolkit/
├── extracted_fonts/           # Extracted fonts
│   ├── presentation1/
│   │   ├── Arial.ttf
│   │   └── CustomFont.otf
│   └── presentation2/
│       └── AnotherFont.ttf
│
└── converted_pptx/           # Converted presentations
    ├── document1.pptx
    └── document2.pptx
```

## Features in Detail

### Font Extraction

**How it works:**
1. Opens presentation file as ZIP archive (PPTX format)
2. Scans `ppt/fonts/` directory for embedded fonts
3. Extracts font files (.ttf, .otf)
4. Parses XML to find all font references
5. Saves fonts organized by presentation name

**Supported formats:**
- .pptx (PowerPoint) - Full support
- .key (Keynote) - macOS only, limited support

**Output:**
- Extracted font files in organized folders
- List of referenced fonts in presentation

### PDF Conversion

**How it works:**
1. Converts each PDF page to high-resolution image
2. Creates blank PowerPoint presentation
3. Adds one slide per page
4. Inserts page image scaled to fit slide
5. Maintains aspect ratio and centers content

**Quality settings:**
- DPI 100-150: Small file size, preview quality
- DPI 300 (default): High quality for projection
- DPI 400+: Archive/print quality

## Testing

Run the demo to test functionality:
```bash
python test_demo.py
```

This will:
1. Create sample PPTX and PDF files
2. Demonstrate font extraction
3. Demonstrate PDF conversion
4. Show expected output

## Limitations & Notes

### Font Extraction
- Only embedded fonts can be extracted
- Some presentations reference system fonts without embedding
- Keynote support requires macOS
- Modern Keynote files may use proprietary formats

### PDF Conversion
- Requires Poppler system package
- Converted slides are images (not editable text)
- File size increases with higher DPI
- Complex PDFs with forms may not convert perfectly

## Future Enhancements

Potential features for future versions:
- [ ] GUI interface for non-technical users
- [ ] Cloud storage integration (Dropbox, Google Drive)
- [ ] Email integration for automated processing
- [ ] Font installation automation
- [ ] PowerPoint to PDF conversion
- [ ] Batch rename/organize files
- [ ] Web service API
- [ ] Docker container for easy deployment

## Support & Documentation

- **Quick Start**: See `QUICK_REFERENCE.md`
- **Installation**: See `SETUP.md`
- **User Guide**: See `README.md`
- **Code Examples**: See `examples.py`
- **Demo**: Run `test_demo.py`

## License

MIT License - See LICENSE file for details

## Author

Created for event tech producers who deal with last-minute presentation chaos.

---

**Version**: 1.0.0  
**Created**: October 2025  
**Platform**: Cross-platform (Python 3.8+)  
**Status**: Production ready


