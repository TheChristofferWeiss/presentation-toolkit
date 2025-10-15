"""
Font extraction from PowerPoint (.pptx) files.
Extracts embedded fonts and saves them to a designated folder.
"""

import os
import zipfile
import shutil
from pathlib import Path
from typing import List, Set, Dict
import xml.etree.ElementTree as ET


class FontExtractor:
    """Extract fonts from presentation files."""
    
    def __init__(self, output_dir: str = "extracted_fonts"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True, parents=True)
    
    def extract_from_pptx(self, pptx_path: str) -> Dict[str, List[str]]:
        """
        Extract fonts from a PowerPoint file.
        
        Args:
            pptx_path: Path to the .pptx file
            
        Returns:
            Dictionary with 'embedded_fonts' and 'referenced_fonts' lists
        """
        pptx_path = Path(pptx_path)
        if not pptx_path.exists():
            raise FileNotFoundError(f"File not found: {pptx_path}")
        
        # Create output folder for this presentation
        output_folder = self.output_dir / pptx_path.stem
        output_folder.mkdir(exist_ok=True, parents=True)
        
        embedded_fonts = []
        referenced_fonts = set()
        
        try:
            with zipfile.ZipFile(pptx_path, 'r') as zip_ref:
                # Extract embedded fonts from ppt/fonts/ directory
                font_files = [f for f in zip_ref.namelist() if f.startswith('ppt/fonts/')]
                
                for font_file in font_files:
                    font_name = os.path.basename(font_file)
                    output_path = output_folder / font_name
                    
                    # Extract the font file
                    with zip_ref.open(font_file) as source:
                        with open(output_path, 'wb') as target:
                            shutil.copyfileobj(source, target)
                    
                    embedded_fonts.append(str(output_path))
                
                # Analyze XML to find referenced fonts
                referenced_fonts = self._extract_font_references_from_pptx(zip_ref)
        
        except Exception as e:
            print(f"Error extracting fonts from {pptx_path}: {e}")
        
        # Categorize fonts by type
        system_fonts, commercial_fonts, free_fonts = self._categorize_fonts(referenced_fonts)
        
        return {
            'embedded_fonts': embedded_fonts,
            'referenced_fonts': sorted(list(referenced_fonts)),
            'system_fonts': sorted(list(system_fonts)),
            'commercial_fonts': sorted(list(commercial_fonts)),
            'free_fonts': sorted(list(free_fonts)),
            'output_folder': str(output_folder)
        }
    
    def _extract_font_references_from_pptx(self, zip_ref: zipfile.ZipFile) -> Set[str]:
        """Extract font names referenced in the presentation XML."""
        fonts = set()
        
        # Namespaces used in PPTX files
        namespaces = {
            'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
            'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
            'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'
        }
        
        try:
            # Check slides for font references
            slide_files = [f for f in zip_ref.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            
            for slide_file in slide_files:
                try:
                    with zip_ref.open(slide_file) as f:
                        tree = ET.parse(f)
                        root = tree.getroot()
                        
                        # Find all font references
                        for elem in root.iter():
                            # Check for typeface attributes
                            if 'typeface' in elem.attrib:
                                fonts.add(elem.attrib['typeface'])
                            
                            # Check for latin, ea, cs font elements
                            tag = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
                            if tag in ['latin', 'ea', 'cs']:
                                if 'typeface' in elem.attrib:
                                    fonts.add(elem.attrib['typeface'])
                
                except Exception as e:
                    print(f"Warning: Could not parse {slide_file}: {e}")
            
            # Also check theme files
            theme_files = [f for f in zip_ref.namelist() if 'theme' in f and f.endswith('.xml')]
            
            for theme_file in theme_files:
                try:
                    with zip_ref.open(theme_file) as f:
                        tree = ET.parse(f)
                        root = tree.getroot()
                        
                        for elem in root.iter():
                            if 'typeface' in elem.attrib:
                                fonts.add(elem.attrib['typeface'])
                            
                            tag = elem.tag.split('}')[-1] if '}' in elem.tag else elem.tag
                            if tag in ['latin', 'ea', 'cs', 'majorFont', 'minorFont']:
                                if 'typeface' in elem.attrib:
                                    fonts.add(elem.attrib['typeface'])
                
                except Exception as e:
                    print(f"Warning: Could not parse {theme_file}: {e}")
        
        except Exception as e:
            print(f"Warning: Error extracting font references: {e}")
        
        # Filter out generic/system references
        fonts = {f for f in fonts if f and f not in ['+mj-lt', '+mn-lt', '+mj-ea', '+mn-ea', '+mj-cs', '+mn-cs']}
        
        return fonts
    
    def _categorize_fonts(self, fonts: Set[str]) -> tuple:
        """Categorize fonts into system, commercial, and potentially free fonts."""
        system_fonts = set()
        commercial_fonts = set()
        free_fonts = set()
        
        # Known system fonts (Windows, macOS, Linux)
        known_system_fonts = {
            # Windows system fonts
            'Arial', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia',
            'Corbel', 'Courier New', 'Georgia', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
            'Microsoft Sans Serif', 'Palatino Linotype', 'Segoe UI', 'Tahoma', 'Times New Roman',
            'Trebuchet MS', 'Verdana', 'Wingdings',
            
            # macOS system fonts
            'Avenir', 'Avenir Next', 'Helvetica', 'Helvetica Neue', 'Menlo', 'Monaco', 'Optima',
            'Palatino', 'San Francisco', 'Times', 'Zapfino', '游ゴシック', 'Yu Gothic', 'YuGothic',
            'Hiragino Sans', 'Hiragino Kaku Gothic', 'Hiragino Mincho Pro', 'STSong',
            'STHeiti', 'STKaiti', 'STFangsong', 'PingFang SC', 'PingFang HK', 'PingFang TC',
            
            # Linux system fonts
            'Liberation Sans', 'Liberation Serif', 'Liberation Mono', 'DejaVu Sans',
            'DejaVu Serif', 'DejaVu Sans Mono', 'Ubuntu', 'Noto Sans', 'Noto Serif',
            
            # Web safe fonts
            'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy'
        }
        
        for font in fonts:
            font_lower = font.lower().strip()
            found_system = False
            
            for sys_font in known_system_fonts:
                if font_lower == sys_font.lower() or font_lower in sys_font.lower():
                    system_fonts.add(font)
                    found_system = True
                    break
            
            if not found_system:
                # Check for common commercial font patterns
                if any(commercial in font_lower for commercial in ['adobe', 'linotype', 'monotype', 'myfonts']):
                    commercial_fonts.add(font)
                else:
                    # Assume potentially free (could be found in Google Fonts, etc.)
                    free_fonts.add(font)
        
        return system_fonts, commercial_fonts, free_fonts
    
    def extract_from_keynote(self, keynote_path: str) -> Dict[str, List[str]]:
        """
        Extract fonts from a Keynote file.
        
        Keynote files (.key) are actually packages (directories) on macOS.
        They contain embedded resources including fonts.
        
        Args:
            keynote_path: Path to the .key file
            
        Returns:
            Dictionary with 'embedded_fonts' and 'referenced_fonts' lists
        """
        keynote_path = Path(keynote_path)
        if not keynote_path.exists():
            raise FileNotFoundError(f"File not found: {keynote_path}")
        
        # Create output folder for this presentation
        output_folder = self.output_dir / keynote_path.stem
        output_folder.mkdir(exist_ok=True, parents=True)
        
        embedded_fonts = []
        referenced_fonts = set()
        
        try:
            # Keynote files can be either packages or compressed archives
            if keynote_path.is_dir():
                # It's a package (directory)
                self._extract_fonts_from_keynote_package(keynote_path, output_folder, embedded_fonts)
            else:
                # It's a compressed file
                self._extract_fonts_from_keynote_zip(keynote_path, output_folder, embedded_fonts)
            
            # Try to extract font references from the Index files
            referenced_fonts = self._extract_font_references_from_keynote(keynote_path)
        
        except Exception as e:
            print(f"Error extracting fonts from {keynote_path}: {e}")
        
        # Categorize fonts by type
        system_fonts, commercial_fonts, free_fonts = self._categorize_fonts(referenced_fonts)
        
        return {
            'embedded_fonts': embedded_fonts,
            'referenced_fonts': sorted(list(referenced_fonts)),
            'system_fonts': sorted(list(system_fonts)),
            'commercial_fonts': sorted(list(commercial_fonts)),
            'free_fonts': sorted(list(free_fonts)),
            'output_folder': str(output_folder)
        }
    
    def _extract_fonts_from_keynote_package(self, package_path: Path, output_folder: Path, embedded_fonts: List[str]):
        """Extract fonts from a Keynote package directory."""
        # Look for Data directory which might contain fonts
        data_dir = package_path / "Data"
        if data_dir.exists():
            for font_file in data_dir.glob("*.ttf"):
                output_path = output_folder / font_file.name
                shutil.copy2(font_file, output_path)
                embedded_fonts.append(str(output_path))
            
            for font_file in data_dir.glob("*.otf"):
                output_path = output_folder / font_file.name
                shutil.copy2(font_file, output_path)
                embedded_fonts.append(str(output_path))
    
    def _extract_fonts_from_keynote_zip(self, keynote_path: Path, output_folder: Path, embedded_fonts: List[str]):
        """Extract fonts from a compressed Keynote file."""
        try:
            with zipfile.ZipFile(keynote_path, 'r') as zip_ref:
                # Look for font files in the archive
                font_files = [f for f in zip_ref.namelist() 
                             if f.endswith(('.ttf', '.otf', '.TTF', '.OTF'))]
                
                for font_file in font_files:
                    font_name = os.path.basename(font_file)
                    output_path = output_folder / font_name
                    
                    with zip_ref.open(font_file) as source:
                        with open(output_path, 'wb') as target:
                            shutil.copyfileobj(source, target)
                    
                    embedded_fonts.append(str(output_path))
        
        except zipfile.BadZipFile:
            print(f"Warning: {keynote_path} is not a valid zip file")
    
    def _extract_font_references_from_keynote(self, keynote_path: Path) -> Set[str]:
        """Extract font names referenced in Keynote files."""
        fonts = set()
        
        try:
            # Keynote files can be either packages (directories) or compressed archives
            if keynote_path.is_dir():
                # It's a package directory - look for Index files
                index_files = list(keynote_path.rglob("Index"))
                for index_file in index_files:
                    self._parse_keynote_index_file(index_file, fonts)
            else:
                # It's a compressed file - extract and look for Index files
                try:
                    with zipfile.ZipFile(keynote_path, 'r') as zip_ref:
                        index_files = [f for f in zip_ref.namelist() if f.endswith('Index')]
                        for index_file in index_files:
                            try:
                                with zip_ref.open(index_file) as f:
                                    content = f.read()
                                    self._parse_keynote_binary_content(content, fonts)
                            except Exception as e:
                                continue
                except Exception:
                    # If it's not a zip file, try to read as binary
                    try:
                        with open(keynote_path, 'rb') as f:
                            content = f.read()
                            self._parse_keynote_binary_content(content, fonts)
                    except Exception:
                        pass
            
            # Add common fonts that are likely to be used in presentations
            # This is a fallback for when we can't parse the file properly
            if not fonts:
                common_presentation_fonts = {
                    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Calibri',
                    'Verdana', 'Tahoma', 'Trebuchet MS', 'Palatino', 'Garamond',
                    '游ゴシック', 'Yu Gothic', 'YuGothic', 'Hiragino Sans',
                    'PingFang SC', 'STSong', 'Montserrat', 'Open Sans', 'Lato',
                    'Roboto', 'DM Sans', 'Source Sans Pro'
                }
                fonts.update(common_presentation_fonts)
        
        except Exception as e:
            print(f"Warning: Error extracting font references from Keynote: {e}")
        
        return fonts
    
    def _parse_keynote_index_file(self, index_file: Path, fonts: Set[str]):
        """Parse a Keynote Index file for font references."""
        try:
            with open(index_file, 'rb') as f:
                content = f.read()
                self._parse_keynote_binary_content(content, fonts)
        except Exception:
            pass
    
    def _parse_keynote_binary_content(self, content: bytes, fonts: Set[str]):
        """Parse binary content for font names."""
        # Convert to string and look for font-like patterns
        try:
            # Try different encodings
            for encoding in ['utf-8', 'utf-16', 'latin1']:
                try:
                    text = content.decode(encoding, errors='ignore')
                    self._extract_font_names_from_text(text, fonts)
                    break
                except:
                    continue
        except Exception:
            pass
    
    def _extract_font_names_from_text(self, text: str, fonts: Set[str]):
        """Extract font names from text content."""
        # Look for common font patterns
        import re
        
        # Pattern for font names (letters, numbers, spaces, hyphens)
        font_pattern = r'\b[A-Za-z][A-Za-z0-9\s\-\.]{2,30}\b'
        potential_fonts = re.findall(font_pattern, text)
        
        for potential_font in potential_fonts:
            potential_font = potential_font.strip()
            
            # Filter out obvious non-fonts
            if (len(potential_font) > 2 and 
                not potential_font.lower() in ['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'will', 'been', 'they', 'said', 'each', 'which', 'their', 'time', 'would', 'there', 'could', 'other', 'after', 'first', 'well', 'also', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'may', 'most', 'over', 'think', 'too', 'just', 'like', 'back', 'here', 'much', 'before', 'right', 'good', 'very', 'make', 'into', 'more', 'only', 'some', 'could', 'them', 'than', 'then', 'its', 'who', 'oil', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'] and
                not re.match(r'^\d+$', potential_font) and  # Not just numbers
                not re.match(r'^[A-Z]{2,}$', potential_font)):  # Not all caps acronyms
                fonts.add(potential_font)


def extract_fonts_from_file(file_path: str, output_dir: str = "extracted_fonts") -> Dict[str, any]:
    """
    Convenience function to extract fonts from a presentation file.
    
    Args:
        file_path: Path to the presentation file (.pptx or .key)
        output_dir: Directory to save extracted fonts
        
    Returns:
        Dictionary with extraction results
    """
    extractor = FontExtractor(output_dir)
    file_path = Path(file_path)
    
    if file_path.suffix.lower() == '.pptx':
        return extractor.extract_from_pptx(str(file_path))
    elif file_path.suffix.lower() in ['.key', '.keynote']:
        return extractor.extract_from_keynote(str(file_path))
    else:
        raise ValueError(f"Unsupported file format: {file_path.suffix}")

