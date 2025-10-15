# 🎯 START HERE - Presentation Toolkit v2.0

## Welcome to Your Font Management Solution!

This toolkit solves your biggest event production headaches:
- ✅ Last-minute presentations with missing fonts
- ✅ PDFs that need to be converted to PowerPoint
- ✅ Hours spent searching for fonts online

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd /Users/christoffer/presentation-toolkit
./quickstart.sh
```

This installs all required Python packages and verifies your setup.

### Step 2: Your First Font Hunt

```bash
# If you have a presentation file:
python presentation_toolkit.py hunt-fonts your_presentation.pptx -v

# The toolkit will:
# 1. Analyze the presentation
# 2. Search 10 free font repositories
# 3. Auto-download Google Fonts
# 4. Generate a beautiful HTML report
# 5. Open the report in your browser
```

### Step 3: Review the Report

The HTML report shows:
- **✅ Auto-Downloaded**: Fonts ready to install (just double-click the .ttf files)
- **🆓 Free Fonts**: Click the links to download from free repositories
- **💰 Commercial**: Click to search/purchase on font marketplaces

## 📖 What Can This Do?

### 🔍 Font Hunter (THE KILLER FEATURE!)

**Problem**: Someone sends you a presentation and you don't have the fonts.

**Solution**:
```bash
python presentation_toolkit.py hunt-fonts presentation.pptx
```

**What you get**:
- Fonts from Google Fonts automatically downloaded
- Direct links to download other free fonts
- Shopping links for commercial fonts
- Beautiful HTML report with everything organized

**Read**: `FONT_HUNTER_GUIDE.md` for complete details

---

### 📦 Font Extractor

**Problem**: Need to extract embedded fonts from a presentation.

**Solution**:
```bash
python presentation_toolkit.py extract-fonts presentation.pptx
```

**What you get**:
- All embedded fonts extracted to `extracted_fonts/`
- List of all fonts referenced in the presentation

---

### 📄 PDF to PowerPoint Converter

**Problem**: Speaker sends PDF instead of PowerPoint.

**Solution**:
```bash
python presentation_toolkit.py pdf-to-pptx document.pdf
```

**What you get**:
- PowerPoint file with each page as an image slide
- Editable in PowerPoint
- Saved to `converted_pptx/`

---

## 🎬 Real-World Example

**Scenario**: It's 11 PM. Speaker emails 3 presentations and 1 PDF. Event is tomorrow.

```bash
# 1. Save files to a folder
mkdir tomorrows_event
# Move the files there

# 2. Hunt for all fonts
python presentation_toolkit.py hunt-fonts ./tomorrows_event/ -p "TomorrowEvent" -v

# Output:
# hunted_fonts/TomorrowEvent/
# ├── fonts_downloaded/           ← Install these now!
# └── font_acquisition_report.html  ← Your action plan

# 3. Convert the PDF
python presentation_toolkit.py pdf-to-pptx ./tomorrows_event/speaker.pdf

# 4. Open the HTML report
open hunted_fonts/TomorrowEvent/font_acquisition_report.html

# 5. Follow the report:
#    - Install auto-downloaded fonts (double-click .ttf files)
#    - Download free fonts from links in report
#    - Purchase commercial fonts if needed (or find free alternatives)

# 6. Go to bed knowing you have all the fonts! 😴
```

## ⚙️ Configuration

### Google Fonts API Key

Your API key is already configured in `.env`:
```
GOOGLE_FONTS_API_KEY=AIzaSyA-ehkUb0QQ7-wNzMlXV2MCHD8GGcM6sps
```

This enables automatic font downloads from Google Fonts (1000+ free fonts).

### Change Settings

Edit the `.env` file to update your API key if needed.

## 📚 Full Documentation

- **FONT_HUNTER_GUIDE.md** - Complete Font Hunter documentation
- **QUICK_REFERENCE.md** - Quick command reference (print this!)
- **README.md** - Full user guide
- **SETUP.md** - Detailed installation guide
- **TROUBLESHOOTING.md** - Common issues and solutions
- **PROJECT_SUMMARY.md** - Technical overview

## 🆘 Quick Help

### Show all commands
```bash
python presentation_toolkit.py --help
```

### Get help for specific command
```bash
python presentation_toolkit.py hunt-fonts --help
python presentation_toolkit.py extract-fonts --help
python presentation_toolkit.py pdf-to-pptx --help
```

### Test the toolkit
```bash
python test_demo.py
```

This creates sample files and demonstrates all features.

## 🎯 Which Command Should I Use?

| Your Need | Command to Use | Output |
|-----------|----------------|--------|
| **Find fonts automatically** | `hunt-fonts` | Auto-downloads + HTML report with all fonts |
| Just extract embedded fonts | `extract-fonts` | Font files in organized folders |
| Convert PDF to PowerPoint | `pdf-to-pptx` | Editable PPTX with images |
| See what's in a file | `info` | File analysis |

**💡 Recommendation**: Start with `hunt-fonts` - it's the most comprehensive!

## ❓ FAQ

**Q: Do I need to pay for anything?**
A: No! The toolkit is free. Google Fonts API is free. You only pay for commercial fonts if you choose to purchase them.

**Q: Will this work on Windows/Mac/Linux?**
A: Yes! Cross-platform Python application.

**Q: What if a font isn't found?**
A: The HTML report will provide search links to 5 commercial marketplaces. You can also look for similar free alternatives.

**Q: Can I use this for multiple events?**
A: Absolutely! Use different project names for each event:
```bash
python presentation_toolkit.py hunt-fonts ./event1/ -p "Event1"
python presentation_toolkit.py hunt-fonts ./event2/ -p "Event2"
```

**Q: How do I install the fonts I download?**
A: 
- macOS: Double-click the .ttf/.otf file → Click "Install Font"
- Windows: Right-click the font file → "Install"
- Linux: Copy to `~/.fonts/` or use Font Manager

## 🔥 Pro Tips

1. **Use descriptive project names**: `-p "ClientName_EventDate_VenueName"`
2. **Keep the HTML reports**: They're a record of what fonts you needed
3. **Check Adobe Fonts first**: If you have Creative Cloud, check commercial fonts there
4. **Archive font kits**: Keep the `hunted_fonts/` folder for each event
5. **Use verbose mode**: Add `-v` to see detailed progress

## 🎉 You're Ready!

The hardest part of event tech production just got easier. No more:
- ❌ Manually searching for fonts
- ❌ Scrambling at midnight for missing typefaces  
- ❌ Font-related presentation failures

Instead:
- ✅ One command to find everything
- ✅ Automated downloads
- ✅ Clear action plan
- ✅ Professional HTML reports

**Run your first font hunt now:**
```bash
python presentation_toolkit.py hunt-fonts your_file.pptx -v
```

---

**Questions?** Check `TROUBLESHOOTING.md` or `FONT_HUNTER_GUIDE.md`

**Ready to dive deep?** Read `FONT_HUNTER_GUIDE.md` for advanced features

**Need quick reference?** Print `QUICK_REFERENCE.md` and keep it handy!


