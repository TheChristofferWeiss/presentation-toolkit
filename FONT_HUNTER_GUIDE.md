# Font Hunter Guide 🔍

## What is Font Hunter?

**Font Hunter** is an advanced feature that goes beyond simple font extraction. Instead of just pulling out embedded fonts, it:

1. **Analyzes** your presentations to find ALL referenced fonts
2. **Hunts** for those fonts across 10 major free font repositories
3. **Auto-downloads** fonts from Google Fonts
4. **Generates** a beautiful HTML report with direct links to download or purchase fonts

## The Problem It Solves

As an event tech producer, you often receive presentations that reference fonts you don't have installed. The Font Hunter:

- ✅ Automatically finds free versions of fonts
- ✅ Downloads Google Fonts directly to your computer
- ✅ Provides direct links to other free font repositories
- ✅ Creates a shopping list for commercial fonts
- ✅ Eliminates manual font searching
- ✅ Ensures you can display presentations correctly

## Quick Start

```bash
# Hunt for fonts in a presentation
python presentation_toolkit.py hunt-fonts presentation.pptx

# Process entire folder
python presentation_toolkit.py hunt-fonts ./urgent_presentations/

# Use custom project name
python presentation_toolkit.py hunt-fonts presentation.pptx --project-name "Conference2024"
```

## Setup

### 1. Get a Google Fonts API Key (Free)

The Font Hunter uses the Google Fonts API to auto-download free fonts.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the "Google Fonts Developer API"
4. Go to "Credentials" and create an API key
5. Copy your API key

### 2. Add API Key to .env File

Edit the `.env` file in the project root:

```bash
# .env
GOOGLE_FONTS_API_KEY=your_api_key_here
```

**Your API key is already set**: `AIzaSyA-ehkUb0QQ7-wNzMlXV2MCHD8GGcM6sps`

## How It Works

### Phase 1: Analysis

The Font Hunter analyzes your presentation files (.pptx or .key) and creates a list of all referenced fonts.

```
Analyzing presentations...
  ✓ Found 12 unique fonts to hunt for
```

### Phase 2: The Hunt

For each font, it searches in this order:

1. **Google Fonts** (auto-downloads if found) ✅
2. **Font Squirrel**
3. **DaFont**
4. **1001 Fonts**
5. **Behance**
6. **Dribbble**
7. **FontSpace**
8. **Urban Fonts**
9. **Abstract Fonts**
10. **The League of Moveable Type**

If found in any free repository, it provides a direct download link. If not found anywhere, it's flagged as commercial.

### Phase 3: The Report

Generates a comprehensive HTML report categorizing fonts:

- **✅ Auto-Downloaded**: Already on your computer, ready to install
- **🆓 Free Fonts**: Found on free sites, click to download
- **💰 Commercial**: Not found free, links to purchase

## The Output

After running Font Hunter, you get a complete "Font Kit" for your event:

```
hunted_fonts/
└── YourProject/
    ├── fonts_downloaded/          # Auto-downloaded from Google Fonts
    │   ├── Roboto.ttf
    │   ├── Open_Sans.ttf
    │   └── Lato.ttf
    └── font_acquisition_report.html   # Your action plan
```

## The HTML Report

The report is beautifully designed and provides:

### Summary Dashboard
- Number of auto-downloaded fonts
- Number of free fonts found (manual download)
- Number of commercial fonts

### Auto-Downloaded Fonts Section
- Font name and badge
- File location
- Available variants (bold, italic, etc.)
- Link to Google Fonts page

### Free Fonts Section
- Font name and badge
- Repository where it was found
- Direct download link
- License reminder

### Commercial Fonts Section
- Font name and badge
- Search links to 5 major marketplaces:
  - Adobe Fonts
  - MyFonts
  - Fonts.com
  - Linotype
  - Font Shop

## Command Options

```bash
python presentation_toolkit.py hunt-fonts [OPTIONS] INPUT_PATH

Options:
  -p, --project-name TEXT   Project name for output folder
  -o, --output TEXT        Output directory (default: hunted_fonts)
  -k, --api-key TEXT       Google Fonts API key (or use .env)
  -v, --verbose            Show detailed output
  --help                   Show this message and exit
```

## Usage Examples

### Single Presentation

```bash
python presentation_toolkit.py hunt-fonts keynote.pptx -v
```

Output:
```
hunted_fonts/
└── keynote/
    ├── fonts_downloaded/
    └── font_acquisition_report.html
```

### Multiple Presentations

```bash
python presentation_toolkit.py hunt-fonts ./conference_presentations/
```

Analyzes ALL presentations in the folder and creates one unified font kit.

### Custom Project Name

```bash
python presentation_toolkit.py hunt-fonts presentation.pptx -p "TechConf2024"
```

Output:
```
hunted_fonts/
└── TechConf2024/
    ├── fonts_downloaded/
    └── font_acquisition_report.html
```

### Custom Output Directory

```bash
python presentation_toolkit.py hunt-fonts slides.pptx -o ./event_fonts/
```

## Real-World Workflow

### Scenario: Last-Minute Presentation at 11 PM

1. **Receive** urgent presentation files via email
2. **Save** them to a folder: `urgent_files/`
3. **Run Font Hunter**:
   ```bash
   python presentation_toolkit.py hunt-fonts ./urgent_files/ -p "MidnightEmergency" -v
   ```
4. **Open** the generated HTML report in your browser
5. **Install** auto-downloaded fonts (double-click .ttf files)
6. **Download** free fonts from the links provided
7. **Purchase** commercial fonts if needed (or find alternatives)
8. **Done** - All fonts ready for the event computer!

### Scenario: Event Preparation

1. **Collect** all presentation files for the event
2. **Run Font Hunter** on the entire directory:
   ```bash
   python presentation_toolkit.py hunt-fonts ./EventSlides2024/ -p "EventSlides"
   ```
3. **Review** the HTML report
4. **Create** a complete font backup for the event computers
5. **Share** the report with your team for font procurement

## Tips & Best Practices

### 1. Always Use Project Names

Use meaningful project names to organize your font kits:

```bash
python presentation_toolkit.py hunt-fonts slides.pptx -p "ClientName_EventDate"
```

### 2. Keep the HTML Reports

The reports are a record of what fonts were needed. Archive them with your event files.

### 3. Verify Licenses

Even for "free" fonts, always check the license on the source site. Some are free for personal use but require a license for commercial use.

### 4. Adobe Creative Cloud Tip

If your company has Adobe Creative Cloud, you already have access to Adobe Fonts (thousands of commercial fonts). Check the commercial fonts section of the report first!

### 5. Font Alternatives

If a commercial font is too expensive, the report's search links can help you find similar free alternatives on sites like Font Squirrel.

## Troubleshooting

### No Google Fonts Downloaded

**Problem**: Google Fonts section is empty

**Solutions**:
- Check your API key is set in `.env`
- Verify the API key is valid
- Make sure Google Fonts Developer API is enabled in Google Cloud Console
- Check internet connection

### Report Opens Blank

**Problem**: HTML report doesn't display correctly

**Solution**: Make sure you're opening it in a modern browser (Chrome, Firefox, Safari, Edge).

### Can't Find Any Fonts

**Problem**: All fonts flagged as commercial

**Possible reasons**:
- Presentation uses only commercial fonts (common in corporate environments)
- Font names are slightly different (e.g., "Arial" vs "Arial Regular")
- Presentation uses very specialized/custom fonts

**Solution**: Use the commercial search links to find the fonts, or look for similar free alternatives.

## Integration with Existing Toolkit

Font Hunter integrates seamlessly with other features:

```bash
# 1. Extract embedded fonts first
python presentation_toolkit.py extract-fonts presentation.pptx

# 2. Hunt for missing fonts
python presentation_toolkit.py hunt-fonts presentation.pptx

# 3. Convert any PDFs
python presentation_toolkit.py pdf-to-pptx document.pdf
```

## Advanced: Using as Python Module

```python
from font_hunter import FontHunter

# Initialize
hunter = FontHunter(api_key="your_api_key")

# Hunt for specific fonts
fonts_to_find = ['Roboto', 'Montserrat', 'Custom Font']
results = hunter.hunt_fonts(fonts_to_find, project_name="MyEvent")

# Results include:
# - google_fonts_downloaded: List of auto-downloaded fonts
# - free_fonts_found: List of fonts found on free repos
# - commercial_fonts: List of likely commercial fonts
# - report_path: Path to HTML report
```

## Font Repositories Searched

Font Hunter searches these 10 repositories in order:

1. **Google Fonts** - 1000+ high-quality free fonts (API)
2. **Font Squirrel** - Curated collection of commercial-use fonts
3. **DaFont** - 60,000+ fonts (check licenses)
4. **1001 Fonts** - Large collection with clear licensing
5. **Behance** - Designer portfolios with free fonts
6. **Dribbble** - Creative community fonts
7. **FontSpace** - 100,000+ fonts
8. **Urban Fonts** - Free and shareware
9. **Abstract Fonts** - Public domain fonts
10. **The League of Moveable Type** - Open-source type foundry

## Support

For issues with Font Hunter:

1. Check `.env` file has correct API key
2. Run with `-v` flag for detailed output
3. Verify internet connection
4. Check `TROUBLESHOOTING.md` for common issues

---

**Font Hunter makes font management effortless for event tech producers. No more scrambling to find fonts at the last minute!** 🎯


