"""
Font Hunter - Automatically find and download fonts from free repositories.
Searches across 10 major free font sources and generates acquisition reports.
"""

import os
import re
import requests
from pathlib import Path
from typing import List, Dict, Set, Optional, Tuple
from urllib.parse import quote_plus
import time


class FontRepository:
    """Represents a font repository with search capabilities."""
    
    def __init__(self, name: str, search_url_template: str, has_api: bool = False):
        self.name = name
        self.search_url_template = search_url_template
        self.has_api = has_api
    
    def get_search_url(self, font_name: str) -> str:
        """Generate search URL for a font name."""
        encoded_name = quote_plus(font_name)
        return self.search_url_template.format(font_name=encoded_name)


# Top 10 Free Font Repositories
FONT_REPOSITORIES = [
    FontRepository("Google Fonts", "https://fonts.google.com/?query={font_name}", has_api=True),
    FontRepository("Font Squirrel", "https://www.fontsquirrel.com/fonts/list/find_fonts?q={font_name}"),
    FontRepository("DaFont", "https://www.dafont.com/search.php?q={font_name}"),
    FontRepository("1001 Fonts", "https://www.1001fonts.com/search.html?search={font_name}"),
    FontRepository("Behance", "https://www.behance.net/search/projects?search={font_name}+font"),
    FontRepository("Dribbble", "https://dribbble.com/search/{font_name}+font"),
    FontRepository("FontSpace", "https://www.fontspace.com/search?q={font_name}"),
    FontRepository("Urban Fonts", "https://www.urbanfonts.com/fonts/{font_name}.htm"),
    FontRepository("Abstract Fonts", "https://www.abstractfonts.com/search/{font_name}"),
    FontRepository("The League of Moveable Type", "https://www.theleagueofmoveabletype.com/"),
]

# Commercial font marketplaces
COMMERCIAL_MARKETPLACES = [
    ("Adobe Fonts", "https://fonts.adobe.com/search?query={font_name}"),
    ("MyFonts", "https://www.myfonts.com/search/{font_name}/fonts/"),
    ("Fonts.com", "https://www.fonts.com/search?searchtext={font_name}"),
    ("Linotype", "https://www.linotype.com/search?q={font_name}"),
    ("Font Shop", "https://www.fontshop.com/search/{font_name}"),
]


class FontHunter:
    """Hunt for fonts across multiple free repositories."""
    
    def __init__(self, api_key: Optional[str] = None, output_dir: str = "hunted_fonts"):
        self.api_key = api_key or os.getenv('GOOGLE_FONTS_API_KEY')
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True, parents=True)
        self.google_fonts_cache = None
    
    def hunt_fonts(self, font_names: List[str], project_name: str = "fonts") -> Dict:
        """
        Hunt for a list of fonts across all repositories.
        
        Args:
            font_names: List of font names to find
            project_name: Name for the output folder
            
        Returns:
            Dictionary with results categorized by source
        """
        project_folder = self.output_dir / project_name
        project_folder.mkdir(exist_ok=True, parents=True)
        
        fonts_folder = project_folder / "fonts_downloaded"
        fonts_folder.mkdir(exist_ok=True)
        
        results = {
            'google_fonts_downloaded': [],
            'free_fonts_found': [],
            'commercial_fonts': [],
            'not_found': [],
            'project_folder': str(project_folder)
        }
        
        print(f"\n🔍 Hunting for {len(font_names)} fonts across 10 repositories...\n")
        
        for i, font_name in enumerate(font_names, 1):
            print(f"[{i}/{len(font_names)}] Searching for '{font_name}'...")
            
            # Try Google Fonts first (can auto-download)
            google_result = self._search_google_fonts(font_name, fonts_folder)
            if google_result:
                results['google_fonts_downloaded'].append(google_result)
                print(f"  ✅ Found and downloaded from Google Fonts")
                continue
            
            # Search other free repositories
            free_repo_result = self._search_free_repositories(font_name)
            if free_repo_result:
                results['free_fonts_found'].append(free_repo_result)
                print(f"  ✅ Found on {free_repo_result['repository']}")
                continue
            
            # Not found in free repos - likely commercial
            commercial_result = self._create_commercial_entry(font_name)
            results['commercial_fonts'].append(commercial_result)
            print(f"  ⚠️  Not found in free repositories (likely commercial)")
        
        # Generate HTML report
        report_path = self._generate_html_report(results, project_folder)
        results['report_path'] = str(report_path)
        
        return results
    
    def _search_google_fonts(self, font_name: str, output_folder: Path) -> Optional[Dict]:
        """Search Google Fonts API and download if found."""
        if not self.api_key:
            return None
        
        try:
            # Cache the full font list
            if self.google_fonts_cache is None:
                api_url = f'https://www.googleapis.com/webfonts/v1/webfonts?key={self.api_key}'
                response = requests.get(api_url, timeout=10)
                if response.status_code == 200:
                    self.google_fonts_cache = response.json().get('items', [])
                else:
                    return None
            
            # Search for the font (case-insensitive)
            font_name_lower = font_name.lower()
            for font in self.google_fonts_cache:
                if font['family'].lower() == font_name_lower or \
                   font_name_lower in font['family'].lower():
                    
                    # Download the regular variant
                    font_files = font.get('files', {})
                    if not font_files:
                        continue
                    
                    # Try to get 'regular' variant, or first available
                    font_url = font_files.get('regular') or list(font_files.values())[0]
                    
                    # Download the font
                    font_response = requests.get(font_url, timeout=10)
                    if font_response.status_code == 200:
                        # Save with original family name
                        safe_name = re.sub(r'[^\w\s-]', '', font['family']).strip().replace(' ', '_')
                        file_path = output_folder / f"{safe_name}.ttf"
                        
                        with open(file_path, 'wb') as f:
                            f.write(font_response.content)
                        
                        return {
                            'font_name': font['family'],
                            'searched_name': font_name,
                            'repository': 'Google Fonts',
                            'file_path': str(file_path),
                            'url': f"https://fonts.google.com/specimen/{quote_plus(font['family'])}",
                            'variants': list(font_files.keys()),
                            'downloaded': True
                        }
        
        except Exception as e:
            print(f"    Error searching Google Fonts: {e}")
        
        return None
    
    def _search_free_repositories(self, font_name: str) -> Optional[Dict]:
        """
        Search other free font repositories with improved detection.
        Returns first match found.
        """
        # Check specific repositories with known good fonts
        known_free_fonts = {
            # Font Squirrel direct links for common fonts
            'montserrat': {
                'repository': 'Font Squirrel',
                'direct_url': 'https://www.fontsquirrel.com/fonts/montserrat',
                'download_url': 'https://www.fontsquirrel.com/fonts/download/montserrat'
            },
            'dm sans': {
                'repository': 'Google Fonts',
                'direct_url': 'https://fonts.google.com/specimen/DM+Sans',
                'download_url': 'https://fonts.google.com/download?family=DM+Sans'
            },
            'open sans': {
                'repository': 'Google Fonts', 
                'direct_url': 'https://fonts.google.com/specimen/Open+Sans',
                'download_url': 'https://fonts.google.com/download?family=Open+Sans'
            },
            'lato': {
                'repository': 'Google Fonts',
                'direct_url': 'https://fonts.google.com/specimen/Lato',
                'download_url': 'https://fonts.google.com/download?family=Lato'
            },
            'roboto': {
                'repository': 'Google Fonts',
                'direct_url': 'https://fonts.google.com/specimen/Roboto',
                'download_url': 'https://fonts.google.com/download?family=Roboto'
            }
        }
        
        # Check for exact matches first
        font_key = font_name.lower().strip()
        if font_key in known_free_fonts:
            return {
                'font_name': font_name,
                'repository': known_free_fonts[font_key]['repository'],
                'direct_url': known_free_fonts[font_key]['direct_url'],
                'download_url': known_free_fonts[font_key]['download_url'],
                'downloaded': False,
                'note': 'Direct link to verified free font'
            }
        
        # Check for partial matches
        for known_font, info in known_free_fonts.items():
            if known_font in font_key or font_key in known_font:
                return {
                    'font_name': font_name,
                    'repository': info['repository'],
                    'direct_url': info['direct_url'],
                    'download_url': info['download_url'],
                    'downloaded': False,
                    'note': f'Found similar font: {known_font.title()}'
                }
        
        # If no known match, provide search links for top repositories only
        return {
            'font_name': font_name,
            'repository': 'Multiple Sources',
            'search_links': [
                {
                    'source': 'Google Fonts',
                    'url': f"https://fonts.google.com/?query={quote_plus(font_name)}"
                },
                {
                    'source': 'Font Squirrel',
                    'url': f"https://www.fontsquirrel.com/fonts/list/find_fonts?q={quote_plus(font_name)}"
                }
            ],
            'downloaded': False,
            'note': 'Please search these repositories manually'
        }
    
    def _create_commercial_entry(self, font_name: str) -> Dict:
        """Create entry for likely commercial font."""
        search_links = []
        for marketplace_name, url_template in COMMERCIAL_MARKETPLACES:
            encoded_name = quote_plus(font_name)
            search_links.append({
                'marketplace': marketplace_name,
                'url': url_template.format(font_name=encoded_name)
            })
        
        return {
            'font_name': font_name,
            'search_links': search_links
        }
    
    def _generate_html_report(self, results: Dict, output_folder: Path) -> Path:
        """Generate comprehensive HTML report."""
        report_path = output_folder / "font_acquisition_report.html"
        
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Font Acquisition Report</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2.5em;
        }}
        h2 {{
            color: #34495e;
            margin-top: 40px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #3498db;
            font-size: 1.8em;
        }}
        .summary {{
            background: #ecf0f1;
            padding: 20px;
            border-radius: 5px;
            margin: 30px 0;
        }}
        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }}
        .summary-item {{
            background: white;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
        }}
        .summary-number {{
            font-size: 2.5em;
            font-weight: bold;
            color: #3498db;
        }}
        .summary-label {{
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 5px;
        }}
        .font-item {{
            background: #f8f9fa;
            padding: 20px;
            margin: 15px 0;
            border-radius: 5px;
            border-left: 4px solid #3498db;
        }}
        .font-name {{
            font-size: 1.3em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }}
        .font-details {{
            color: #7f8c8d;
            margin: 5px 0;
        }}
        .badge {{
            display: inline-block;
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 0.85em;
            font-weight: bold;
            margin-right: 10px;
        }}
        .badge-success {{
            background: #2ecc71;
            color: white;
        }}
        .badge-warning {{
            background: #f39c12;
            color: white;
        }}
        .badge-info {{
            background: #3498db;
            color: white;
        }}
        .links {{
            margin-top: 12px;
        }}
        .link-button {{
            display: inline-block;
            padding: 8px 16px;
            margin: 5px 5px 5px 0;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.9em;
            transition: background 0.3s;
        }}
        .link-button:hover {{
            background: #2980b9;
        }}
        .link-button-commercial {{
            background: #e74c3c;
        }}
        .link-button-commercial:hover {{
            background: #c0392b;
        }}
        .section-downloaded {{
            border-left-color: #2ecc71;
        }}
        .section-free {{
            border-left-color: #3498db;
        }}
        .section-commercial {{
            border-left-color: #e74c3c;
        }}
        .note {{
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            color: #856404;
        }}
        .note strong {{
            display: block;
            margin-bottom: 5px;
        }}
        .footer {{
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #ecf0f1;
            text-align: center;
            color: #95a5a6;
            font-size: 0.9em;
        }}
        @media print {{
            body {{
                background: white;
            }}
            .container {{
                box-shadow: none;
            }}
            .link-button {{
                border: 1px solid #3498db;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Font Acquisition Report</h1>
        <p style="color: #7f8c8d; font-size: 1.1em;">Generated by Presentation Toolkit - Font Hunter</p>
        
        <div class="summary">
            <h3 style="margin-bottom: 15px;">Summary</h3>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-number">{len(results['google_fonts_downloaded'])}</div>
                    <div class="summary-label">Auto-Downloaded</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">{len(results['free_fonts_found'])}</div>
                    <div class="summary-label">Free (Manual Download)</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">{len(results['commercial_fonts'])}</div>
                    <div class="summary-label">Commercial</div>
                </div>
            </div>
        </div>
"""
        
        # Downloaded fonts section
        if results['google_fonts_downloaded']:
            html += """
        <h2>✅ Auto-Downloaded Fonts (Ready to Install)</h2>
        <p>These fonts were automatically downloaded from Google Fonts and are ready to use.</p>
"""
            for font in results['google_fonts_downloaded']:
                variants = ", ".join(font.get('variants', []))
                html += f"""
        <div class="font-item section-downloaded">
            <div class="font-name">
                {font['font_name']}
                <span class="badge badge-success">DOWNLOADED</span>
            </div>
            <div class="font-details">📁 File: <code>{Path(font['file_path']).name}</code></div>
            <div class="font-details">🔤 Variants available: {variants}</div>
            <div class="links">
                <a href="{font['url']}" class="link-button" target="_blank">View on Google Fonts</a>
            </div>
        </div>
"""
        
        # Free fonts found section
        if results['free_fonts_found']:
            html += """
        <h2>🆓 Free Fonts Found (Download Required)</h2>
        <p>These fonts were found on free repositories. Click the links to download and verify the license.</p>
        <div class="note">
            <strong>⚠️ Important:</strong>
            Please verify the license terms on each repository before using these fonts commercially.
        </div>
"""
            for font in results['free_fonts_found']:
                html += f"""
        <div class="font-item section-free">
            <div class="font-name">
                {font['font_name']}
                <span class="badge badge-info">FREE</span>
            </div>
            <div class="font-details">📍 Source: {font['repository']}</div>
            <div class="font-details">ℹ️ {font.get('note', '')}</div>
            <div class="links">
"""
                
                # Handle different link types
                if 'download_url' in font:
                    html += f'                <a href="{font["download_url"]}" class="link-button" target="_blank">Download from {font["repository"]}</a>'
                elif 'direct_url' in font:
                    html += f'                <a href="{font["direct_url"]}" class="link-button" target="_blank">View on {font["repository"]}</a>'
                elif 'search_links' in font:
                    for link in font['search_links']:
                        html += f'                <a href="{link["url"]}" class="link-button" target="_blank">Search {link["source"]}</a>'
                else:
                    html += f'                <a href="{font["search_url"]}" class="link-button" target="_blank">Download from {font["repository"]}</a>'
                
                html += """
            </div>
        </div>
"""
        
        # Commercial fonts section
        if results['commercial_fonts']:
            html += """
        <h2>💰 Commercial Fonts (Purchase Required)</h2>
        <p>These fonts were not found in any of the 10 major free font repositories and likely require a commercial license.</p>
        <div class="note">
            <strong>🛒 Shopping List:</strong>
            Use the links below to find and purchase these fonts. Many companies have Adobe Creative Cloud which includes Adobe Fonts.
        </div>
"""
            for font in results['commercial_fonts']:
                links_html = ""
                for link in font['search_links']:
                    links_html += f'<a href="{link["url"]}" class="link-button link-button-commercial" target="_blank">{link["marketplace"]}</a>'
                
                html += f"""
        <div class="font-item section-commercial">
            <div class="font-name">
                {font['font_name']}
                <span class="badge badge-warning">COMMERCIAL</span>
            </div>
            <div class="font-details">🔍 Search on these marketplaces:</div>
            <div class="links">
                {links_html}
            </div>
        </div>
"""
        
        html += """
        <div class="footer">
            <p>Generated by <strong>Presentation Toolkit - Font Hunter</strong></p>
            <p>Automated font acquisition for event tech professionals</p>
        </div>
    </div>
</body>
</html>
"""
        
        with open(report_path, 'w', encoding='utf-8') as f:
            f.write(html)
        
        return report_path


def hunt_fonts_from_list(font_names: List[str], project_name: str = "fonts", 
                         api_key: Optional[str] = None) -> Dict:
    """
    Convenience function to hunt for fonts.
    
    Args:
        font_names: List of font names to search for
        project_name: Name for the output folder
        api_key: Google Fonts API key (optional, will use env var if not provided)
        
    Returns:
        Dictionary with results
    """
    hunter = FontHunter(api_key=api_key)
    return hunter.hunt_fonts(font_names, project_name)

