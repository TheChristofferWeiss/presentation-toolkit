/**
 * Font Extractor Section
 * 
 * Dedicated section for the Font Extractor feature.
 */

import React from 'react'
import FeatureCard from '../FeatureCard'

export const FontExtractorSection: React.FC = () => {
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
            📦 Font Extractor
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Extract embedded fonts from PowerPoint and Keynote presentations
          </p>
        </div>

        {/* Main Feature Card */}
        <div style={{
          marginBottom: '40px'
        }}>
          <FeatureCard
            title="Font Extractor"
            description="Extracts embedded TTF and OTF fonts from presentation files. Supports both PowerPoint (.pptx) and Keynote (.key) files. Automatically categorizes fonts as system fonts, commercial fonts, or potentially free fonts. Organizes extracted fonts by source file for easy management."
            icon="📦"
            status="ready"
            features={[
              "Extracts embedded TTF/OTF fonts from PPTX files",
              "Supports Keynote (.key) files on macOS",
              "Smart font categorization and organization",
              "Preserves original font metadata",
              "Batch processing for multiple files",
              "Organized output by source file",
              "System font detection and filtering"
            ]}
            commands={[
              "python presentation_toolkit.py extract-fonts presentation.pptx",
              "python presentation_toolkit.py extract-fonts ./presentations/",
              "python presentation_toolkit.py extract-fonts file.pptx --output ./my_fonts/"
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
              🔍 Smart Detection
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Identifies embedded vs referenced fonts</li>
              <li style={{ marginBottom: '8px' }}>• Extracts font metadata</li>
              <li style={{ marginBottom: '8px' }}>• Handles font variants (bold, italic)</li>
              <li style={{ marginBottom: '8px' }}>• Supports multiple font formats</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              📂 Organized Output
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Separate folder per presentation</li>
              <li style={{ marginBottom: '8px' }}>• Original filename preservation</li>
              <li style={{ marginBottom: '8px' }}>• Font categorization reports</li>
              <li style={{ marginBottom: '8px' }}>• Duplicate detection and handling</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              🎯 Font Classification
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• System fonts (Arial, Helvetica, etc.)</li>
              <li style={{ marginBottom: '8px' }}>• Commercial fonts (Adobe, Linotype)</li>
              <li style={{ marginBottom: '8px' }}>• Potentially free fonts</li>
              <li style={{ marginBottom: '8px' }}>• Font weight and style detection</li>
            </ul>
          </div>
        </div>

        {/* Supported Formats */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
            📄 Supported Formats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
              <div style={{ color: 'white', fontWeight: '600' }}>PowerPoint (.pptx)</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Full support
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎨</div>
              <div style={{ color: 'white', fontWeight: '600' }}>Keynote (.key)</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                macOS only
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
            {`extracted_fonts/
├── presentation1/
│   ├── Arial.ttf                    # System font
│   ├── CustomFont-Bold.otf          # Commercial font
│   └── Montserrat-Regular.ttf       # Free font
├── presentation2/
│   ├── Helvetica.ttf
│   └── CustomFont-Italic.otf
└── font_summary.txt                 # Summary report`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FontExtractorSection
