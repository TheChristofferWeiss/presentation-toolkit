/**
 * PDF Converter Section
 * 
 * Dedicated section for the PDF to PPTX converter feature.
 */

import React from 'react'
import FeatureCard from '../FeatureCard'

export const PDFConverterSection: React.FC = () => {
  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
          }}>
            📄 PDF Converter
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Convert PDF files to PowerPoint presentations with high-quality images
          </p>
        </div>

        {/* Main Feature Card */}
        <div style={{
          marginBottom: '40px'
        }}>
          <FeatureCard
            title="PDF to PPTX Converter"
            description="Converts PDF files to PowerPoint presentations by rendering each page as a high-quality image and embedding it into a slide. Maintains proper 16:9 widescreen aspect ratio and creates professional-looking presentations ready for events and presentations."
            icon="📄"
            status="ready"
            features={[
              "Converts PDF pages to high-quality images (300 DPI default)",
              "Maintains 16:9 widescreen aspect ratio",
              "One slide per PDF page",
              "Adjustable image quality and DPI settings",
              "Batch processing for multiple PDFs",
              "Professional slide layout and formatting",
              "Preserves original content fidelity"
            ]}
            commands={[
              "python presentation_toolkit.py pdf-to-pptx document.pdf",
              "python presentation_toolkit.py pdf-to-pptx document.pdf --output ./converted/",
              "python presentation_toolkit.py pdf-to-pptx document.pdf --dpi 200"
            ]}
          />
        </div>

        {/* Feature Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              🖼️ High-Quality Rendering
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• 300 DPI default resolution</li>
              <li style={{ marginBottom: '8px' }}>• Adjustable quality settings</li>
              <li style={{ marginBottom: '8px' }}>• Lossless image conversion</li>
              <li style={{ marginBottom: '8px' }}>• Optimized file sizes</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              📐 Professional Layout
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• 16:9 widescreen format</li>
              <li style={{ marginBottom: '8px' }}>• Standard PowerPoint dimensions</li>
              <li style={{ marginBottom: '8px' }}>• Consistent slide layouts</li>
              <li style={{ marginBottom: '8px' }}>• Event-ready presentations</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              ⚡ Fast Processing
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Efficient PDF rendering</li>
              <li style={{ marginBottom: '8px' }}>• Parallel processing support</li>
              <li style={{ marginBottom: '8px' }}>• Progress tracking</li>
              <li style={{ marginBottom: '8px' }}>• Memory optimization</li>
            </ul>
          </div>
        </div>

        {/* Requirements */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
            📋 Requirements
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>
                🍎 macOS
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                <code>brew install poppler</code>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>
                🐧 Ubuntu/Debian
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                <code>sudo apt-get install poppler-utils</code>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ color: 'white', fontWeight: '600', marginBottom: '8px' }}>
                🪟 Windows
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Download from GitHub releases
              </div>
            </div>
          </div>
        </div>

        {/* Output Example */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
            📁 Output Structure
          </h3>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: '0.9rem',
            color: '#e5e7eb',
            overflow: 'auto'
          }}>
            {`converted_pptx/
├── document1.pptx          # 16:9 widescreen presentation
├── document2.pptx          # Each page = one slide
├── report.pptx             # High-quality images embedded
└── presentation.pptx       # Ready for events`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFConverterSection
