"""
Presentation Toolkit
A tool for event tech producers to handle presentation files.

Features:
- Extract fonts from PowerPoint and Keynote files
- Hunt for fonts across 10 free repositories
- Convert PDFs to PowerPoint presentations
"""

__version__ = '2.0.0'
__author__ = 'Event Tech Tools'

from .font_extractor import FontExtractor, extract_fonts_from_file
from .pdf_converter import PDFToPPTXConverter, convert_pdf_to_pptx
from .font_hunter import FontHunter, hunt_fonts_from_list

__all__ = [
    'FontExtractor',
    'extract_fonts_from_file',
    'PDFToPPTXConverter',
    'convert_pdf_to_pptx',
    'FontHunter',
    'hunt_fonts_from_list',
]

