# Web Interface Guide 🌐

## Overview

The **Presentation Toolkit Web Interface** provides a simple, beautiful browser-based UI for all the toolkit's features. No command line needed!

## Features

- 🎨 **Modern, Beautiful UI** - Gradient design with drag-and-drop
- 📤 **Easy File Upload** - Drag & drop or click to browse
- 🔍 **Font Hunter** - Hunt for fonts across 10 repositories
- 📦 **Font Extraction** - Extract embedded fonts from presentations
- 📄 **PDF Conversion** - Convert PDFs to PowerPoint
- 📊 **Visual Results** - See stats and download reports
- 💾 **Easy Downloads** - Download fonts, reports, and converted files

## Quick Start

### Option 1: Using the Startup Script (Recommended)

```bash
cd /Users/christoffer/presentation-toolkit
./start_web.sh
```

This will:
1. Check dependencies
2. Activate virtual environment
3. Start the web server
4. Open at http://localhost:5000

### Option 2: Manual Start

```bash
cd /Users/christoffer/presentation-toolkit
source venv/bin/activate  # Activate virtual environment
python web_app.py
```

Then open your browser to: **http://localhost:5000**

## How to Use

### 1. Upload a File

**Drag & Drop:**
- Drag your presentation or PDF file onto the upload area
- Or click the upload area to browse for files

**Supported Files:**
- `.pptx` - PowerPoint presentations
- `.key` - Keynote presentations (macOS)
- `.pdf` - PDF documents

**File Size:** Up to 100MB

### 2. Choose an Action

After uploading, you'll see action buttons:

#### For Presentations (.pptx, .key):

**🔍 Hunt for Fonts**
- Analyzes the presentation
- Searches 10 free font repositories
- Auto-downloads Google Fonts
- Generates HTML report
- Shows you exactly what to do

**📦 Extract Embedded Fonts**
- Extracts fonts embedded in the file
- Lists all referenced fonts
- Saves fonts to organized folder

#### For PDFs:

**📄 Convert to PowerPoint**
- Converts each PDF page to a slide
- Creates editable PowerPoint file
- Adjustable quality (300 DPI default)

### 3. View Results

The interface shows:
- **Statistics** - Visual counters for fonts found
- **Download Buttons** - Get reports, fonts, or converted files
- **Font Lists** - See all fonts detected
- **Success Messages** - Clear status updates

### 4. Download Your Results

**For Font Hunter:**
- **📊 View Full HTML Report** - Opens detailed report in new tab
- **📦 Download Fonts** - ZIP file of all auto-downloaded fonts

**For Font Extraction:**
- Fonts saved to `extracted_fonts/` folder on server
- Can access directly from file system

**For PDF Conversion:**
- **📥 Download PowerPoint File** - Get your converted .pptx

## Screenshots & Interface Elements

### Upload Area
```
╔═══════════════════════════════════════════╗
║                                           ║
║                   📁                      ║
║                                           ║
║     Drop your file here or click to       ║
║                 browse                    ║
║                                           ║
║   Supported: .pptx, .key, .pdf (100MB)   ║
║                                           ║
╚═══════════════════════════════════════════╝
```

### Action Buttons
After upload, large colorful buttons appear:
- **Purple gradient** - Hunt for Fonts (primary action)
- **Blue** - Extract Embedded Fonts
- **Green** - Convert to PowerPoint (PDFs only)

### Results Display
Beautiful cards showing:
- Large numbers for statistics
- Color-coded status indicators
- Download links as prominent buttons
- Font lists in clean format

## Real-World Workflow

### Scenario: Last-Minute Presentation

1. **Open Web Interface**
   ```bash
   ./start_web.sh
   ```
   Browser opens to http://localhost:5000

2. **Upload File**
   - Drag `urgent_presentation.pptx` onto the upload area
   - See "✅ File uploaded successfully!"

3. **Click "🔍 Hunt for Fonts"**
   - Processing indicator appears
   - Wait 10-30 seconds (depends on number of fonts)

4. **View Results**
   ```
   Font Hunt Results
   ✅ Auto-Downloaded: 5
   🆓 Free Fonts Found: 2
   💰 Commercial Fonts: 1
   ```

5. **Download Everything**
   - Click "📊 View Full HTML Report" - Opens in new tab
   - Click "📦 Download Fonts" - Gets ZIP with 5 Google Fonts
   - Install fonts by double-clicking .ttf files
   - Follow report links for the other 2 free fonts
   - Check commercial font links if needed

6. **Done!** All fonts ready for event computer.

## Advanced Features

### API Key Configuration

The interface shows a warning if Google Fonts API key is not configured.

**To configure:**
1. Edit `.env` file:
   ```
   GOOGLE_FONTS_API_KEY=your_key_here
   ```
2. Restart web server
3. Warning disappears, auto-download works!

### Batch Processing

To process multiple files:
1. Upload first file, process it
2. Results stay on screen
3. Upload next file (page doesn't reload)
4. Process that one
5. Repeat as needed

### Quality Settings (PDF Conversion)

Default DPI is 300 (high quality). To adjust:
- Edit in browser console or
- Use the CLI for more control:
  ```bash
  python presentation_toolkit.py pdf-to-pptx file.pdf --dpi 400
  ```

## Accessing Your Files

All outputs are saved in these directories:

```
presentation-toolkit/
├── uploads/              # Uploaded files (temporary)
├── hunted_fonts/         # Font Hunter results
│   └── [filename]/
│       ├── fonts_downloaded/
│       └── font_acquisition_report.html
├── extracted_fonts/      # Extracted embedded fonts
│   └── [filename]/
└── converted_pptx/       # PDF conversions
    └── [filename].pptx
```

You can access these folders directly from Finder/Explorer.

## Network Access

### Local Only (Default)
- Accessible at: http://localhost:5000
- Only from your computer
- Secure, no external access

### Network Access (Optional)
To allow access from other devices on your network:

1. Edit `web_app.py`, change last line:
   ```python
   app.run(debug=True, host='0.0.0.0', port=5000)
   ```
   (Already set to 0.0.0.0)

2. Find your IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   
   # Windows
   ipconfig
   ```

3. Access from other devices:
   ```
   http://YOUR_IP_ADDRESS:5000
   ```

**⚠️ Security Note:** Only do this on trusted networks!

## Troubleshooting

### Port Already in Use

**Error:** "Address already in use"

**Solution:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port - edit web_app.py:
app.run(debug=True, host='0.0.0.0', port=5001)
```

### Upload Fails

**Error:** File upload fails or times out

**Possible causes:**
1. File too large (>100MB)
2. Network issue
3. Disk space

**Solutions:**
- Use smaller files
- Check disk space: `df -h`
- Use CLI for very large files

### Cannot Access from Browser

**Error:** "This site can't be reached"

**Solutions:**
1. Check server is running
2. Verify URL: http://localhost:5000
3. Try: http://127.0.0.1:5000
4. Check firewall settings

### Results Not Displaying

**Error:** Upload works but processing fails

**Solutions:**
1. Check terminal for error messages
2. Verify file format (.pptx, .key, .pdf)
3. Try with smaller/simpler file
4. Check Python packages: `pip install -r requirements.txt`

### Fonts Not Auto-Downloading

**Error:** Hunt finds fonts but doesn't download them

**Cause:** Google Fonts API key not configured

**Solution:**
1. Add API key to `.env`:
   ```
   GOOGLE_FONTS_API_KEY=AIzaSyA-ehkUb0QQ7-wNzMlXV2MCHD8GGcM6sps
   ```
2. Restart web server

## Stopping the Server

**Method 1:** Press `CTRL+C` in the terminal

**Method 2:** Close the terminal window

**Method 3:** Kill the process:
```bash
lsof -ti:5000 | xargs kill
```

## Tips & Best Practices

1. **Keep Browser Tab Open**
   - Results disappear if you navigate away
   - Download everything you need before closing

2. **Use Descriptive Filenames**
   - Results are organized by filename
   - `ClientName_Event_Date.pptx` is better than `presentation1.pptx`

3. **Clean Up Regularly**
   - Uploaded files stay in `uploads/`
   - Delete old files periodically to save space

4. **Bookmark the URL**
   - Add http://localhost:5000 to bookmarks
   - Quick access next time

5. **Use for Demonstrations**
   - Great for showing colleagues how it works
   - Much easier than teaching CLI

## Comparison: Web vs. CLI

| Feature | Web Interface | Command Line |
|---------|---------------|--------------|
| **Ease of Use** | ⭐⭐⭐⭐⭐ Click and drag | ⭐⭐⭐ Type commands |
| **Visual Feedback** | ⭐⭐⭐⭐⭐ Beautiful UI | ⭐⭐ Text output |
| **Batch Processing** | ⭐⭐⭐ Upload one at a time | ⭐⭐⭐⭐⭐ Process folders |
| **Customization** | ⭐⭐ Basic options | ⭐⭐⭐⭐⭐ All options |
| **Speed** | ⭐⭐⭐⭐ Fast for single files | ⭐⭐⭐⭐⭐ Fastest for bulk |
| **Learning Curve** | ⭐⭐⭐⭐⭐ Instant | ⭐⭐ Need to learn commands |
| **Sharing** | ⭐⭐⭐⭐⭐ Easy to demo | ⭐⭐ Hard to show |

**Recommendation:**
- **Web Interface** - For individual files, demos, and less technical users
- **CLI** - For batch processing, automation, and advanced options

## Integration with CLI

You can use both interfaces interchangeably:
- Upload via web, process some files
- Use CLI for batch operations
- All outputs go to same folders
- Access results from either interface

## FAQ

**Q: Can I use this on a server for my team?**
A: Yes! Deploy to a server and your team can access it via browser. Consider adding authentication for security.

**Q: Does it work offline?**
A: Partially. Font extraction and PDF conversion work offline. Font Hunter needs internet to search repositories and download fonts.

**Q: Can I customize the look?**
A: Yes! Edit `templates/index.html` to change colors, layout, etc.

**Q: Is it safe to upload sensitive files?**
A: Files stay on your local machine (or server you control). Not sent to external services except for Google Fonts API queries.

**Q: Can multiple people use it at once?**
A: Yes, Flask supports multiple concurrent connections. For heavy usage, consider a production WSGI server.

**Q: What happens to uploaded files?**
A: Stored temporarily in `uploads/` folder. Clean up manually or they persist until deleted.

## Next Steps

1. **Try it now:**
   ```bash
   ./start_web.sh
   ```

2. **Upload a test file** and explore features

3. **Bookmark** http://localhost:5000 for easy access

4. **Share** with colleagues who find CLI intimidating

5. **Read** `FONT_HUNTER_GUIDE.md` for details on the hunt feature

---

**The web interface makes font management accessible to everyone on your team!** 🎨


