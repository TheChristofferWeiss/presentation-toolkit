#!/usr/bin/env python3
"""
Presentation Toolkit - Web Interface
A simple web UI for font hunting and presentation management.
"""

import os
import shutil
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file, send_from_directory, url_for
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import tempfile

from font_hunter import FontHunter
from font_extractor import FontExtractor
from pdf_converter import PDFToPPTXConverter

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max file size

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pptx', 'key', 'pdf'}

# Create necessary directories
Path(app.config['UPLOAD_FOLDER']).mkdir(exist_ok=True)
Path('hunted_fonts').mkdir(exist_ok=True)
Path('extracted_fonts').mkdir(exist_ok=True)
Path('converted_pptx').mkdir(exist_ok=True)


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """Main page."""
    api_key_configured = bool(os.getenv('GOOGLE_FONTS_API_KEY'))
    return render_template('index.html', api_key_configured=api_key_configured)


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload."""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: .pptx, .key, .pdf'}), 400
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'filepath': filepath
        })
    
    except Exception as e:
        print(f"Upload error: {e}")
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500


@app.route('/hunt-fonts', methods=['POST'])
def hunt_fonts():
    """Hunt for fonts in uploaded file."""
    data = request.json
    filename = data.get('filename')
    project_name = data.get('project_name', 'WebUpload')
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Extract font names from the file
        extractor = FontExtractor()
        
        file_ext = Path(filepath).suffix.lower()
        if file_ext == '.pptx':
            result = extractor.extract_from_pptx(filepath)
        elif file_ext in ['.key', '.keynote']:
            result = extractor.extract_from_keynote(filepath)
        else:
            return jsonify({'error': 'Not a presentation file'}), 400
        
        # Get font names
        font_names = list(result['referenced_fonts'])
        
        if not font_names:
            return jsonify({
                'success': True,
                'message': 'No fonts found in presentation',
                'fonts': [],
                'results': {}
            })
        
        # Hunt for fonts
        api_key = os.getenv('GOOGLE_FONTS_API_KEY')
        hunter = FontHunter(api_key=api_key, output_dir='hunted_fonts')
        hunt_results = hunter.hunt_fonts(font_names, project_name)
        
        # Prepare response
        response = {
            'success': True,
            'fonts': font_names,
            'results': {
                'google_fonts_downloaded': len(hunt_results['google_fonts_downloaded']),
                'free_fonts_found': len(hunt_results['free_fonts_found']),
                'commercial_fonts': len(hunt_results['commercial_fonts']),
                'project_folder': hunt_results['project_folder'],
                'report_path': hunt_results['report_path']
            },
            'details': {
                'google_fonts': hunt_results['google_fonts_downloaded'],
                'free_fonts': hunt_results['free_fonts_found'],
                'commercial_fonts': hunt_results['commercial_fonts']
            }
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/extract-fonts', methods=['POST'])
def extract_fonts():
    """Extract embedded fonts from uploaded file."""
    data = request.json
    filename = data.get('filename')
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        extractor = FontExtractor(output_dir='extracted_fonts')
        
        file_ext = Path(filepath).suffix.lower()
        if file_ext == '.pptx':
            result = extractor.extract_from_pptx(filepath)
        elif file_ext in ['.key', '.keynote']:
            result = extractor.extract_from_keynote(filepath)
        else:
            return jsonify({'error': 'Not a presentation file'}), 400
        
        return jsonify({
            'success': True,
            'embedded_fonts': len(result['embedded_fonts']),
            'referenced_fonts': len(result['referenced_fonts']),
            'output_folder': result['output_folder'],
            'fonts': result['embedded_fonts'],
            'font_names': result['referenced_fonts']
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/convert-pdf', methods=['POST'])
def convert_pdf():
    """Convert PDF to PowerPoint."""
    data = request.json
    filename = data.get('filename')
    dpi = data.get('dpi', 300)
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        converter = PDFToPPTXConverter(output_dir='converted_pptx')
        output_file = converter.convert(filepath, dpi=dpi)
        converter.cleanup_temp()
        
        return jsonify({
            'success': True,
            'output_file': output_file,
            'filename': Path(output_file).name
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/download-report/<project_name>')
def download_report(project_name):
    """Download HTML report."""
    report_path = Path('hunted_fonts') / project_name / 'font_acquisition_report.html'
    
    if not report_path.exists():
        return "Report not found", 404
    
    return send_file(report_path, as_attachment=True)


@app.route('/view-report/<project_name>')
def view_report(project_name):
    """View HTML report in browser."""
    report_path = Path('hunted_fonts') / project_name / 'font_acquisition_report.html'
    
    if not report_path.exists():
        return "Report not found", 404
    
    return send_file(report_path)


@app.route('/download-fonts/<project_name>')
def download_fonts(project_name):
    """Download fonts as a zip file."""
    import zipfile
    
    fonts_folder = Path('hunted_fonts') / project_name / 'fonts_downloaded'
    
    if not fonts_folder.exists():
        return "No fonts found", 404
    
    # Create temporary zip file
    zip_path = Path(tempfile.gettempdir()) / f'{project_name}_fonts.zip'
    
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for font_file in fonts_folder.glob('*.ttf'):
            zipf.write(font_file, font_file.name)
        for font_file in fonts_folder.glob('*.otf'):
            zipf.write(font_file, font_file.name)
    
    return send_file(zip_path, as_attachment=True, download_name=f'{project_name}_fonts.zip')


@app.route('/download-converted/<filename>')
def download_converted(filename):
    """Download converted PowerPoint file."""
    file_path = Path('converted_pptx') / filename
    
    if not file_path.exists():
        return "File not found", 404
    
    return send_file(file_path, as_attachment=True)


@app.route('/static/<path:path>')
def send_static(path):
    """Serve static files."""
    return send_from_directory('static', path)


@app.route('/health')
def health():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'api_key_configured': bool(os.getenv('GOOGLE_FONTS_API_KEY'))
    })


if __name__ == '__main__':
    print("\n" + "="*70)
    print("🎯 Presentation Toolkit - Web Interface")
    print("="*70)
    print("\n📍 Starting web server...")
    print("\n🌐 Open your browser and go to:")
    print("\n   http://localhost:8080")
    print("\n⚙️  Press CTRL+C to stop the server")
    print("\n" + "="*70 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=8080)

