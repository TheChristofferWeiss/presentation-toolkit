#!/usr/bin/env python3
"""
Example usage scripts for Presentation Toolkit.
"""

from font_extractor import extract_fonts_from_file, FontExtractor
from pdf_converter import convert_pdf_to_pptx, PDFToPPTXConverter
from pathlib import Path


def example_extract_fonts_from_single_file():
    """Example: Extract fonts from a single PowerPoint file."""
    print("="*60)
    print("Example 1: Extract fonts from a single file")
    print("="*60)
    
    # Replace with your actual file path
    pptx_file = "path/to/your/presentation.pptx"
    
    try:
        result = extract_fonts_from_file(pptx_file, output_dir="extracted_fonts")
        
        print(f"\nResults for: {pptx_file}")
        print(f"Embedded fonts extracted: {len(result['embedded_fonts'])}")
        for font in result['embedded_fonts']:
            print(f"  - {Path(font).name}")
        
        print(f"\nReferenced fonts found: {len(result['referenced_fonts'])}")
        for font in result['referenced_fonts']:
            print(f"  - {font}")
        
        print(f"\nFonts saved to: {result['output_folder']}")
    
    except FileNotFoundError:
        print(f"File not found: {pptx_file}")
        print("Please update the file path in this example.")
    except Exception as e:
        print(f"Error: {e}")


def example_extract_fonts_from_directory():
    """Example: Extract fonts from all presentations in a directory."""
    print("\n" + "="*60)
    print("Example 2: Extract fonts from multiple files")
    print("="*60)
    
    # Replace with your actual directory path
    presentations_dir = Path("path/to/presentations")
    
    if not presentations_dir.exists():
        print(f"Directory not found: {presentations_dir}")
        print("Please update the directory path in this example.")
        return
    
    extractor = FontExtractor(output_dir="extracted_fonts")
    
    # Find all PowerPoint files
    pptx_files = list(presentations_dir.glob("*.pptx"))
    
    print(f"\nFound {len(pptx_files)} PowerPoint files")
    
    for pptx_file in pptx_files:
        try:
            print(f"\nProcessing: {pptx_file.name}")
            result = extractor.extract_from_pptx(str(pptx_file))
            print(f"  Extracted {len(result['embedded_fonts'])} fonts")
        except Exception as e:
            print(f"  Error: {e}")


def example_convert_pdf_to_pptx():
    """Example: Convert a PDF to PowerPoint."""
    print("\n" + "="*60)
    print("Example 3: Convert PDF to PowerPoint")
    print("="*60)
    
    # Replace with your actual PDF file path
    pdf_file = "path/to/your/document.pdf"
    
    try:
        output_file = convert_pdf_to_pptx(
            pdf_file,
            output_dir="converted_pptx",
            dpi=300  # Higher DPI = better quality, larger file size
        )
        
        print(f"\nSuccessfully converted!")
        print(f"Output file: {output_file}")
    
    except FileNotFoundError:
        print(f"File not found: {pdf_file}")
        print("Please update the file path in this example.")
    except Exception as e:
        print(f"Error: {e}")
        print("\nNote: Make sure Poppler is installed on your system.")
        print("  macOS: brew install poppler")
        print("  Ubuntu: sudo apt-get install poppler-utils")


def example_batch_pdf_conversion():
    """Example: Convert multiple PDFs to PowerPoint."""
    print("\n" + "="*60)
    print("Example 4: Batch convert PDFs to PowerPoint")
    print("="*60)
    
    # Replace with your actual directory path
    pdf_dir = Path("path/to/pdfs")
    
    if not pdf_dir.exists():
        print(f"Directory not found: {pdf_dir}")
        print("Please update the directory path in this example.")
        return
    
    converter = PDFToPPTXConverter(output_dir="converted_pptx")
    
    # Find all PDF files
    pdf_files = list(pdf_dir.glob("*.pdf"))
    
    print(f"\nFound {len(pdf_files)} PDF files")
    
    results = converter.convert_multiple(
        [str(f) for f in pdf_files],
        dpi=300
    )
    
    converter.cleanup_temp()
    
    print(f"\nConverted {len(results)} files successfully")
    for output_file in results:
        print(f"  - {Path(output_file).name}")


def example_process_urgent_files():
    """Example: Complete workflow for urgent presentation files."""
    print("\n" + "="*60)
    print("Example 5: Complete workflow for urgent files")
    print("="*60)
    
    urgent_dir = Path("urgent_presentations")
    
    if not urgent_dir.exists():
        print(f"Directory not found: {urgent_dir}")
        print("Please create a directory and add your urgent files.")
        return
    
    print("\nStep 1: Extract fonts from all presentations")
    print("-" * 40)
    
    extractor = FontExtractor(output_dir="extracted_fonts")
    
    for pptx_file in urgent_dir.glob("*.pptx"):
        print(f"Processing: {pptx_file.name}")
        result = extractor.extract_from_pptx(str(pptx_file))
        print(f"  Fonts extracted: {len(result['embedded_fonts'])}")
    
    print("\nStep 2: Convert all PDFs to PowerPoint")
    print("-" * 40)
    
    converter = PDFToPPTXConverter(output_dir="converted_pptx")
    
    pdf_files = list(urgent_dir.glob("*.pdf"))
    if pdf_files:
        results = converter.convert_multiple([str(f) for f in pdf_files])
        converter.cleanup_temp()
        print(f"  Converted {len(results)} PDF files")
    else:
        print("  No PDF files found")
    
    print("\n✓ All urgent files processed!")
    print(f"  Fonts saved to: extracted_fonts/")
    print(f"  Converted PDFs saved to: converted_pptx/")


if __name__ == "__main__":
    print("Presentation Toolkit - Example Usage\n")
    
    print("This file contains example code for using the toolkit.")
    print("Edit the file paths in each example function to match your files.\n")
    
    print("Available examples:")
    print("  1. Extract fonts from a single file")
    print("  2. Extract fonts from multiple files in a directory")
    print("  3. Convert a PDF to PowerPoint")
    print("  4. Batch convert multiple PDFs")
    print("  5. Complete workflow for urgent files")
    
    print("\nUncomment the examples you want to run:\n")
    
    # Uncomment the examples you want to try:
    # example_extract_fonts_from_single_file()
    # example_extract_fonts_from_directory()
    # example_convert_pdf_to_pptx()
    # example_batch_pdf_conversion()
    # example_process_urgent_files()


