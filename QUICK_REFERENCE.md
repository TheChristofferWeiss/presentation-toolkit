# Quick Reference Card

## Most Common Commands

### 🔍 Hunt for Fonts (Recommended!)

```bash
# Hunt for fonts in a presentation (auto-downloads + generates report)
python presentation_toolkit.py hunt-fonts presentation.pptx

# All presentations in a folder
python presentation_toolkit.py hunt-fonts ./urgent_presentations/ -v

# Custom project name
python presentation_toolkit.py hunt-fonts presentation.pptx -p "Event2024"
```

**Output**: Auto-downloaded fonts + HTML report with links

### Extract Fonts

```bash
# Single presentation (extract embedded fonts only)
python presentation_toolkit.py extract-fonts presentation.pptx

# All presentations in a folder (common for last-minute batch processing)
python presentation_toolkit.py extract-fonts ./urgent_presentations/ -v

# Custom output folder
python presentation_toolkit.py extract-fonts file.pptx --output ./fonts_backup/
```

### Convert PDF to PowerPoint

```bash
# Single PDF
python presentation_toolkit.py pdf-to-pptx document.pdf

# All PDFs in a folder
python presentation_toolkit.py pdf-to-pptx ./pdf_files/

# High-quality conversion (higher DPI)
python presentation_toolkit.py pdf-to-pptx document.pdf --dpi 400

# Lower file size (lower DPI)
python presentation_toolkit.py pdf-to-pptx document.pdf --dpi 150
```

### Get File Info

```bash
# Analyze a presentation
python presentation_toolkit.py info presentation.pptx
```

## Common Workflows

### Last-Minute Presentation Prep (Complete Solution!)

When someone sends you files at the last minute:

```bash
# 1. Create a folder for the urgent files
mkdir urgent_files
# Move/copy their files there

# 2. HUNT for all fonts (automatically finds & downloads!)
python presentation_toolkit.py hunt-fonts ./urgent_files/ -p "UrgentEvent" -v
# This creates: hunted_fonts/UrgentEvent/font_acquisition_report.html

# 3. Convert any PDFs they sent
python presentation_toolkit.py pdf-to-pptx ./urgent_files/

# 4. Open the HTML report
open hunted_fonts/UrgentEvent/font_acquisition_report.html
# Install auto-downloaded fonts, download free ones, purchase commercial if needed

# 5. Done! All fonts ready for your event computer
```

### Alternative: Just Extract Embedded Fonts

If you only need embedded fonts:

```bash
python presentation_toolkit.py extract-fonts ./urgent_files/ -v
```

### Font Backup Before Event

```bash
# Create organized font backup from all presentations
python presentation_toolkit.py extract-fonts ./event_presentations/ --output ./font_backup_2024/
```

### PDF Import

```bash
# Convert presenter's PDF slides to editable PowerPoint
python presentation_toolkit.py pdf-to-pptx speaker_slides.pdf --output ./ready_presentations/
```

## Tips & Tricks

### DPI Settings for PDF Conversion

- **High quality** (for projection): `--dpi 300` (default)
- **Archive quality**: `--dpi 400`
- **Quick preview**: `--dpi 150`
- **Small file size**: `--dpi 100`

### Verbose Mode

Add `-v` flag to see detailed progress:
```bash
python presentation_toolkit.py extract-fonts file.pptx -v
```

### Batch Processing

The toolkit automatically processes all matching files in a directory:
```bash
# Processes ALL .pptx files in the folder
python presentation_toolkit.py extract-fonts ./presentations/

# Processes ALL .pdf files in the folder
python presentation_toolkit.py pdf-to-pptx ./pdfs/
```

## Output Locations

- **Extracted fonts**: `extracted_fonts/<presentation_name>/`
- **Converted presentations**: `converted_pptx/`
- **Temporary files**: `temp/` (auto-cleaned)

## File Support

| Feature | .pptx | .key | .pdf |
|---------|-------|------|------|
| Font Extraction | ✅ | ✅* | ❌ |
| Convert to PPTX | N/A | ❌ | ✅ |

*Keynote support requires macOS

## Troubleshooting Quick Fixes

**PDF conversion fails?**
```bash
# macOS
brew install poppler

# Ubuntu/Debian
sudo apt-get install poppler-utils
```

**Module not found?**
```bash
pip install -r requirements.txt
```

**Permission denied?**
```bash
chmod +x presentation_toolkit.py
```

## Emergency Cheat Sheet

```bash
# 1. Setup (first time only)
./quickstart.sh

# 2. HUNT for fonts (recommended - auto-finds & downloads!)
python presentation_toolkit.py hunt-fonts file.pptx -v

# 3. Extract embedded fonts only
python presentation_toolkit.py extract-fonts file.pptx -v

# 4. Convert PDF to PowerPoint
python presentation_toolkit.py pdf-to-pptx file.pdf -v

# 5. Process entire folder
python presentation_toolkit.py hunt-fonts ./folder/ -p "ProjectName" -v
python presentation_toolkit.py pdf-to-pptx ./folder/ -v
```

## Getting Help

```bash
# General help
python presentation_toolkit.py --help

# Command-specific help
python presentation_toolkit.py hunt-fonts --help
python presentation_toolkit.py extract-fonts --help
python presentation_toolkit.py pdf-to-pptx --help
```

## What Command Should I Use?

| Need | Command | Output |
|------|---------|--------|
| **Find ALL fonts** (free + commercial) | `hunt-fonts` | Auto-downloaded fonts + HTML report |
| Extract embedded fonts only | `extract-fonts` | Font files in folders |
| Convert PDF to PowerPoint | `pdf-to-pptx` | PPTX file with images |
| Get file information | `info` | Font list & file details |

**💡 Tip**: Use `hunt-fonts` for the most comprehensive solution!

