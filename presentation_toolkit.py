#!/usr/bin/env python3
"""
Presentation Toolkit - Main CLI Interface
A tool for event tech producers to handle presentation files.
"""

import os
import sys
from pathlib import Path
from typing import List
import click
from colorama import Fore, Style, init
from tqdm import tqdm
from dotenv import load_dotenv

from font_extractor import FontExtractor, extract_fonts_from_file
from pdf_converter import PDFToPPTXConverter, convert_pdf_to_pptx
from font_hunter import FontHunter, hunt_fonts_from_list

# Load environment variables from .env file
load_dotenv()

# Initialize colorama for cross-platform colored output
init(autoreset=True)


def print_success(message: str):
    """Print success message in green."""
    print(f"{Fore.GREEN}✓ {message}{Style.RESET_ALL}")


def print_error(message: str):
    """Print error message in red."""
    print(f"{Fore.RED}✗ {message}{Style.RESET_ALL}")


def print_warning(message: str):
    """Print warning message in yellow."""
    print(f"{Fore.YELLOW}⚠ {message}{Style.RESET_ALL}")


def print_info(message: str):
    """Print info message in blue."""
    print(f"{Fore.BLUE}ℹ {message}{Style.RESET_ALL}")


def get_files_from_path(path: str, extensions: List[str]) -> List[Path]:
    """
    Get all files with specified extensions from a path.
    
    Args:
        path: File or directory path
        extensions: List of file extensions (e.g., ['.pptx', '.key'])
        
    Returns:
        List of Path objects
    """
    path = Path(path)
    files = []
    
    if path.is_file():
        if path.suffix.lower() in extensions:
            files.append(path)
    elif path.is_dir():
        for ext in extensions:
            files.extend(path.glob(f"*{ext}"))
            files.extend(path.glob(f"*{ext.upper()}"))
    
    return files


@click.group()
@click.version_option(version='1.0.0')
def cli():
    """
    Presentation Toolkit - Tools for event tech producers.
    
    Extract fonts from presentations and convert PDFs to PowerPoint.
    """
    pass


@cli.command('extract-fonts')
@click.argument('input_path', type=click.Path(exists=True))
@click.option('--output', '-o', default='extracted_fonts', help='Output directory for fonts')
@click.option('--verbose', '-v', is_flag=True, help='Show detailed output')
def extract_fonts_command(input_path: str, output: str, verbose: bool):
    """
    Extract fonts from PowerPoint (.pptx) and Keynote (.key) files.
    
    INPUT_PATH can be a single file or a directory containing presentations.
    """
    print_info(f"Presentation Toolkit - Font Extractor")
    print_info(f"Input: {input_path}")
    print_info(f"Output: {output}\n")
    
    # Get all presentation files
    presentation_files = get_files_from_path(input_path, ['.pptx', '.key', '.keynote'])
    
    if not presentation_files:
        print_error("No presentation files found!")
        sys.exit(1)
    
    print_info(f"Found {len(presentation_files)} presentation file(s)\n")
    
    # Extract fonts from each file
    extractor = FontExtractor(output_dir=output)
    total_fonts_extracted = 0
    
    for file_path in tqdm(presentation_files, desc="Processing files", unit="file"):
        try:
            if verbose:
                print(f"\n{Fore.CYAN}Processing: {file_path.name}{Style.RESET_ALL}")
            
            if file_path.suffix.lower() == '.pptx':
                result = extractor.extract_from_pptx(str(file_path))
            else:
                result = extractor.extract_from_keynote(str(file_path))
            
            embedded_count = len(result['embedded_fonts'])
            referenced_count = len(result['referenced_fonts'])
            total_fonts_extracted += embedded_count
            
            if verbose:
                if embedded_count > 0:
                    print_success(f"  Extracted {embedded_count} embedded font(s)")
                    for font in result['embedded_fonts']:
                        print(f"    - {Path(font).name}")
                else:
                    print_warning(f"  No embedded fonts found")
                
                if referenced_count > 0:
                    print_info(f"  Found {referenced_count} font reference(s):")
                    for font in result['referenced_fonts']:
                        print(f"    - {font}")
                
                print_info(f"  Saved to: {result['output_folder']}")
        
        except Exception as e:
            print_error(f"Error processing {file_path.name}: {e}")
    
    print(f"\n{Fore.GREEN}{'='*60}{Style.RESET_ALL}")
    print_success(f"Extraction complete!")
    print_info(f"Total embedded fonts extracted: {total_fonts_extracted}")
    print_info(f"Output directory: {output}")
    print(f"{Fore.GREEN}{'='*60}{Style.RESET_ALL}")


@cli.command('pdf-to-pptx')
@click.argument('input_path', type=click.Path(exists=True))
@click.option('--output', '-o', default='converted_pptx', help='Output directory for PPTX files')
@click.option('--dpi', '-d', default=300, type=int, help='Image resolution (default: 300)')
@click.option('--verbose', '-v', is_flag=True, help='Show detailed output')
def pdf_to_pptx_command(input_path: str, output: str, dpi: int, verbose: bool):
    """
    Convert PDF files to PowerPoint presentations.
    
    Each PDF page is converted to an image and placed on a separate slide.
    INPUT_PATH can be a single PDF file or a directory containing PDFs.
    """
    print_info(f"Presentation Toolkit - PDF to PowerPoint Converter")
    print_info(f"Input: {input_path}")
    print_info(f"Output: {output}")
    print_info(f"DPI: {dpi}\n")
    
    # Get all PDF files
    pdf_files = get_files_from_path(input_path, ['.pdf'])
    
    if not pdf_files:
        print_error("No PDF files found!")
        sys.exit(1)
    
    print_info(f"Found {len(pdf_files)} PDF file(s)\n")
    
    # Convert each PDF
    converter = PDFToPPTXConverter(output_dir=output)
    successful_conversions = 0
    
    for pdf_path in pdf_files:
        try:
            if verbose:
                print(f"\n{Fore.CYAN}Converting: {pdf_path.name}{Style.RESET_ALL}")
            else:
                print(f"Converting: {pdf_path.name}...")
            
            output_file = converter.convert(str(pdf_path), dpi=dpi)
            successful_conversions += 1
            
            if verbose:
                print_success(f"  Created: {output_file}")
        
        except Exception as e:
            print_error(f"Error converting {pdf_path.name}: {e}")
    
    # Cleanup temporary files
    converter.cleanup_temp()
    
    print(f"\n{Fore.GREEN}{'='*60}{Style.RESET_ALL}")
    print_success(f"Conversion complete!")
    print_info(f"Successfully converted: {successful_conversions}/{len(pdf_files)} file(s)")
    print_info(f"Output directory: {output}")
    print(f"{Fore.GREEN}{'='*60}{Style.RESET_ALL}")


@cli.command('hunt-fonts')
@click.argument('input_path', type=click.Path(exists=True))
@click.option('--project-name', '-p', default=None, help='Project name for output folder')
@click.option('--output', '-o', default='hunted_fonts', help='Output directory')
@click.option('--api-key', '-k', default=None, help='Google Fonts API key (or set GOOGLE_FONTS_API_KEY in .env)')
@click.option('--verbose', '-v', is_flag=True, help='Show detailed output')
def hunt_fonts_command(input_path: str, project_name: str, output: str, api_key: str, verbose: bool):
    """
    Hunt for fonts from presentations across 10 free repositories.
    
    This command analyzes presentations, identifies all fonts, and automatically
    searches for them across Google Fonts and 9 other free font repositories.
    Generates a comprehensive HTML report with download links.
    
    INPUT_PATH can be a single presentation file or directory.
    """
    print_info(f"Presentation Toolkit - Font Hunter 🔍")
    print_info(f"Input: {input_path}")
    print_info(f"Output: {output}\n")
    
    # Determine project name
    input_path_obj = Path(input_path)
    if project_name is None:
        if input_path_obj.is_file():
            project_name = input_path_obj.stem
        else:
            project_name = input_path_obj.name or "fonts"
    
    # Get all presentation files
    presentation_files = get_files_from_path(input_path, ['.pptx', '.key', '.keynote'])
    
    if not presentation_files:
        print_error("No presentation files found!")
        sys.exit(1)
    
    print_info(f"Found {len(presentation_files)} presentation file(s)")
    
    # Extract font names from all presentations
    print(f"\n{Fore.CYAN}Step 1: Analyzing presentations...{Style.RESET_ALL}\n")
    
    all_fonts = set()
    extractor = FontExtractor()
    
    for file_path in presentation_files:
        try:
            if verbose:
                print(f"  Analyzing: {file_path.name}")
            
            if file_path.suffix.lower() == '.pptx':
                result = extractor.extract_from_pptx(str(file_path))
            else:
                result = extractor.extract_from_keynote(str(file_path))
            
            # Add referenced fonts to the hunt list
            all_fonts.update(result['referenced_fonts'])
            
            # Also note embedded fonts (already have these)
            if verbose and result['embedded_fonts']:
                print(f"    ✓ {len(result['embedded_fonts'])} embedded fonts found (already available)")
        
        except Exception as e:
            print_error(f"Error analyzing {file_path.name}: {e}")
    
    if not all_fonts:
        print_warning("No font references found in presentations")
        sys.exit(0)
    
    print_success(f"Found {len(all_fonts)} unique fonts to hunt for\n")
    
    # Hunt for fonts
    print(f"\n{Fore.CYAN}Step 2: Hunting for fonts across 10 repositories...{Style.RESET_ALL}\n")
    
    # Use provided API key or environment variable
    effective_api_key = api_key or os.getenv('GOOGLE_FONTS_API_KEY')
    if not effective_api_key:
        print_warning("No Google Fonts API key found. Set GOOGLE_FONTS_API_KEY in .env file")
        print_info("You can still use other repositories, but auto-download won't work\n")
    
    hunter = FontHunter(api_key=effective_api_key, output_dir=output)
    results = hunter.hunt_fonts(sorted(list(all_fonts)), project_name)
    
    # Display summary
    print(f"\n{Fore.GREEN}{'='*60}{Style.RESET_ALL}")
    print_success(f"Font hunting complete!")
    print(f"\n{Fore.CYAN}Summary:{Style.RESET_ALL}")
    print(f"  ✅ Auto-downloaded (Google Fonts): {len(results['google_fonts_downloaded'])}")
    print(f"  🆓 Found on free repositories: {len(results['free_fonts_found'])}")
    print(f"  💰 Commercial fonts (purchase needed): {len(results['commercial_fonts'])}")
    
    print(f"\n{Fore.CYAN}Output:{Style.RESET_ALL}")
    print(f"  📁 Project folder: {results['project_folder']}")
    print(f"  📊 HTML Report: {results['report_path']}")
    
    if results['google_fonts_downloaded']:
        print(f"  📦 Downloaded fonts: {Path(results['project_folder']) / 'fonts_downloaded'}")
    
    print(f"\n{Fore.YELLOW}Next steps:{Style.RESET_ALL}")
    print(f"  1. Open the HTML report: {results['report_path']}")
    print(f"  2. Install auto-downloaded fonts from: fonts_downloaded/")
    print(f"  3. Download free fonts using the links in the report")
    print(f"  4. Purchase commercial fonts if needed")
    
    print(f"{Fore.GREEN}{'='*60}{Style.RESET_ALL}")
    
    # Optionally open the report
    try:
        import webbrowser
        print(f"\n{Fore.CYAN}Opening report in browser...{Style.RESET_ALL}")
        webbrowser.open(f"file://{Path(results['report_path']).absolute()}")
    except:
        pass


@cli.command('info')
@click.argument('file_path', type=click.Path(exists=True))
def info_command(file_path: str):
    """
    Display information about a presentation or PDF file.
    """
    file_path = Path(file_path)
    
    print_info(f"File Information")
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")
    print(f"File: {file_path.name}")
    print(f"Path: {file_path.absolute()}")
    print(f"Size: {file_path.stat().st_size / 1024:.2f} KB")
    print(f"Type: {file_path.suffix}")
    
    if file_path.suffix.lower() == '.pptx':
        print(f"\n{Fore.CYAN}Analyzing PowerPoint file...{Style.RESET_ALL}")
        extractor = FontExtractor()
        result = extractor.extract_from_pptx(str(file_path))
        
        print(f"\nEmbedded Fonts: {len(result['embedded_fonts'])}")
        for font in result['embedded_fonts']:
            print(f"  - {Path(font).name}")
        
        print(f"\nReferenced Fonts: {len(result['referenced_fonts'])}")
        for font in result['referenced_fonts']:
            print(f"  - {font}")
    
    elif file_path.suffix.lower() in ['.key', '.keynote']:
        print(f"\n{Fore.CYAN}Analyzing Keynote file...{Style.RESET_ALL}")
        extractor = FontExtractor()
        result = extractor.extract_from_keynote(str(file_path))
        
        print(f"\nEmbedded Fonts: {len(result['embedded_fonts'])}")
        for font in result['embedded_fonts']:
            print(f"  - {Path(font).name}")
    
    elif file_path.suffix.lower() == '.pdf':
        print(f"\n{Fore.CYAN}PDF file detected{Style.RESET_ALL}")
        print("Use 'pdf-to-pptx' command to convert to PowerPoint")
    
    print(f"{Fore.CYAN}{'='*60}{Style.RESET_ALL}")


if __name__ == '__main__':
    try:
        cli()
    except KeyboardInterrupt:
        print(f"\n{Fore.YELLOW}Operation cancelled by user{Style.RESET_ALL}")
        sys.exit(0)
    except Exception as e:
        print_error(f"An error occurred: {e}")
        sys.exit(1)

