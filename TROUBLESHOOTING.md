# Troubleshooting Guide

Common issues and solutions for Presentation Toolkit.

## Installation Issues

### "Command not found: python3"

**Problem**: Python is not installed or not in PATH

**Solution**:
```bash
# macOS (using Homebrew)
brew install python3

# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip

# Verify installation
python3 --version
```

### "No module named 'pptx'" or similar import errors

**Problem**: Dependencies not installed

**Solution**:
```bash
# Make sure you're in the project directory
cd /Users/christoffer/presentation-toolkit

# Install all dependencies
pip install -r requirements.txt

# Or with pip3
pip3 install -r requirements.txt

# If using virtual environment (recommended)
source venv/bin/activate
pip install -r requirements.txt
```

### "Permission denied" when running scripts

**Problem**: Scripts don't have execute permissions

**Solution**:
```bash
chmod +x presentation_toolkit.py
chmod +x quickstart.sh
chmod +x test_demo.py

# Or run with python explicitly
python3 presentation_toolkit.py --help
```

## PDF Conversion Issues

### "PDFInfoNotInstalledError" or "Unable to get page count"

**Problem**: Poppler not installed

**Solution**:
```bash
# macOS
brew install poppler

# Ubuntu/Debian
sudo apt-get install poppler-utils

# Windows
# Download from: https://github.com/oschwartz10612/poppler-windows/releases/
# Extract and add to PATH

# Verify installation
pdftoppm -h
```

### PDF conversion is very slow

**Problem**: High DPI setting

**Solution**:
```bash
# Use lower DPI for faster conversion
python presentation_toolkit.py pdf-to-pptx file.pdf --dpi 150

# Default is 300, which is good but slower
# DPI 100-150: Fast, good for previews
# DPI 200-300: Balanced
# DPI 400+: Slow, very high quality
```

### Converted PowerPoint files are huge

**Problem**: Too high DPI setting

**Solution**:
```bash
# Reduce DPI to decrease file size
python presentation_toolkit.py pdf-to-pptx file.pdf --dpi 150

# Or for even smaller files
python presentation_toolkit.py pdf-to-pptx file.pdf --dpi 100
```

### PDF conversion produces poor quality images

**Problem**: DPI too low

**Solution**:
```bash
# Increase DPI for better quality
python presentation_toolkit.py pdf-to-pptx file.pdf --dpi 400

# For projection/screen: 300 (default) is usually fine
# For print: Use 400+
```

## Font Extraction Issues

### "No embedded fonts found"

**Problem**: This is actually normal in many cases

**Explanation**:
- Many presentations use system fonts without embedding them
- Fonts are only embedded when specifically chosen in PowerPoint settings
- Referenced fonts are still shown in the output

**Solution**:
- Check the "Referenced fonts" list in verbose mode
- Use `-v` flag to see all font references:
  ```bash
  python presentation_toolkit.py extract-fonts file.pptx -v
  ```

### Keynote files not working

**Problem**: Keynote support limitations

**Notes**:
- Keynote support only works on macOS
- Requires PyObjC: `pip install pyobjc-framework-Cocoa`
- Newer Keynote files may use proprietary formats
- Limited compared to PowerPoint support

**Solution**:
```bash
# macOS only
pip install pyobjc-framework-Cocoa

# Or convert Keynote to PowerPoint first:
# Open in Keynote → File → Export To → PowerPoint
```

### Can't find fonts in extracted folder

**Problem**: Looking in wrong location

**Solution**:
```bash
# Fonts are organized by presentation name
# Check: extracted_fonts/<presentation_name>/

# Example structure:
# extracted_fonts/
#   ├── my_presentation/
#   │   ├── font1.ttf
#   │   └── font2.otf
#   └── another_presentation/
#       └── font3.ttf

# List all extracted fonts
find extracted_fonts -name "*.ttf" -o -name "*.otf"
```

## File Processing Issues

### "File not found" errors

**Problem**: Incorrect file path

**Solution**:
```bash
# Use absolute paths
python presentation_toolkit.py extract-fonts /full/path/to/file.pptx

# Or make sure you're in the right directory
pwd
ls -la

# Use quotes for paths with spaces
python presentation_toolkit.py extract-fonts "My Presentation.pptx"
```

### Processing a directory doesn't find any files

**Problem**: Files in subdirectories or wrong extension

**Notes**:
- The tool only processes files directly in the specified directory
- It doesn't recurse into subdirectories
- File extensions must match exactly (.pptx, .key, .pdf)

**Solution**:
```bash
# Check what files are in the directory
ls -la ./presentations/

# Make sure files have correct extensions
# If files are in subdirectories, process each one:
python presentation_toolkit.py extract-fonts ./presentations/folder1/
python presentation_toolkit.py extract-fonts ./presentations/folder2/
```

### "BadZipFile" or "File is not a zip file" error

**Problem**: Corrupted or incompatible file format

**Solution**:
- File may be corrupted - try opening in PowerPoint first
- Old .ppt files (not .pptx) are not supported
- Convert .ppt to .pptx: Open in PowerPoint → Save As → .pptx
- For Keynote: Try exporting as PowerPoint first

## Output Issues

### Can't find output files

**Problem**: Not looking in correct output directory

**Solution**:
```bash
# Default output locations:
ls -la extracted_fonts/    # For font extraction
ls -la converted_pptx/     # For PDF conversion

# Or specify custom output
python presentation_toolkit.py extract-fonts file.pptx --output ./my_fonts/
python presentation_toolkit.py pdf-to-pptx file.pdf --output ./my_pptx/
```

### Output directory already exists error

**Problem**: Not actually an error - tool creates/uses existing directories

**Notes**:
- The tool automatically creates output directories if they don't exist
- Existing directories are used without error
- Files with same names may be overwritten

## Performance Issues

### Very slow when processing many files

**Problem**: Processing files sequentially

**Tips**:
```bash
# Use verbose mode to see progress
python presentation_toolkit.py extract-fonts ./folder/ -v

# For PDFs, reduce DPI
python presentation_toolkit.py pdf-to-pptx ./folder/ --dpi 150

# Process smaller batches if needed
```

### Running out of disk space

**Problem**: Large PDF conversions or many files

**Solution**:
```bash
# Check disk space
df -h

# Reduce DPI for smaller files
python presentation_toolkit.py pdf-to-pptx file.pdf --dpi 150

# Clean up temp directory
rm -rf temp/

# Process files in smaller batches
```

## Platform-Specific Issues

### macOS: "Cannot execute binary file"

**Problem**: Using Linux binary on macOS

**Solution**:
```bash
# Run with Python explicitly
python3 presentation_toolkit.py --help

# Or fix shebang if needed
which python3
# Update first line of presentation_toolkit.py if needed
```

### Windows: "python3: command not found"

**Problem**: Python command is different on Windows

**Solution**:
```cmd
# Use 'python' instead of 'python3'
python presentation_toolkit.py --help

# Or use 'py'
py presentation_toolkit.py --help
```

### Linux: Permission issues with fonts

**Problem**: Font files created without proper permissions

**Solution**:
```bash
# Fix permissions after extraction
chmod 644 extracted_fonts/*/*.ttf
chmod 644 extracted_fonts/*/*.otf
```

## Getting More Help

### Enable verbose mode

```bash
# Add -v flag to any command for detailed output
python presentation_toolkit.py extract-fonts file.pptx -v
python presentation_toolkit.py pdf-to-pptx file.pdf -v
```

### Check file info

```bash
# Get detailed information about a file
python presentation_toolkit.py info file.pptx
```

### Run the demo

```bash
# Test with sample files
python test_demo.py
```

### Check dependencies

```bash
# Verify Python version (need 3.8+)
python3 --version

# Check installed packages
pip list | grep pptx
pip list | grep pdf2image
pip list | grep Pillow

# Check Poppler
pdftoppm -h
```

## Common Error Messages Decoded

| Error Message | Likely Cause | Quick Fix |
|---------------|--------------|-----------|
| `FileNotFoundError` | Wrong path or file doesn't exist | Check file path, use absolute path |
| `ModuleNotFoundError` | Missing Python package | `pip install -r requirements.txt` |
| `PDFInfoNotInstalledError` | Poppler not installed | `brew install poppler` (macOS) |
| `BadZipFile` | Corrupted file or wrong format | Try opening file first, convert old .ppt |
| `Permission denied` | Script not executable | `chmod +x presentation_toolkit.py` |
| `Command not found` | Python not in PATH | Use full path or install Python |

## Still Having Issues?

1. Try the quickstart script:
   ```bash
   ./quickstart.sh
   ```

2. Run the test demo:
   ```bash
   python test_demo.py
   ```

3. Check that all requirements are met:
   - Python 3.8+ installed
   - All pip packages installed
   - Poppler installed (for PDF conversion)
   - Sufficient disk space

4. Try with a simple test file first before processing important files

## Emergency Quick Fix

If nothing works, try a complete reinstall:

```bash
# Go to project directory
cd /Users/christoffer/presentation-toolkit

# Remove virtual environment if exists
rm -rf venv/

# Create fresh virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Install Poppler
brew install poppler  # macOS

# Test
python presentation_toolkit.py --help
```


