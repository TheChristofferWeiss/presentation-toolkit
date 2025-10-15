/**
 * Font Hunter Section
 * 
 * Dedicated section for the Font Hunter feature.
 */

import React from 'react'
import FeatureCard from '../FeatureCard'

export const FontHunterSection: React.FC = () => {
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
            🔍 Font Hunter
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Automatically hunt for fonts across 10 free repositories and generate acquisition reports
          </p>
        </div>

        {/* Main Feature Card */}
        <div style={{
          marginBottom: '40px'
        }}>
          <FeatureCard
            title="Font Hunter"
            description="The most powerful feature! Automatically searches for fonts across Google Fonts, Font Squirrel, DaFont, 1001 Fonts, Behance, Dribbble, FontSpace, Urban Fonts, Abstract Fonts, and The League of Moveable Type. Downloads Google Fonts automatically and generates beautiful HTML reports with direct links to free fonts and purchase options for commercial fonts."
            icon="🔍"
            status="ready"
            features={[
              "Searches 10 major free font repositories",
              "Auto-downloads Google Fonts (.ttf files)",
              "Generates comprehensive HTML reports",
              "Provides direct download links",
              "Identifies commercial fonts with marketplace links",
              "Batch processing for multiple presentations",
              "Smart font categorization (system, free, commercial)"
            ]}
            commands={[
              "python presentation_toolkit.py hunt-fonts presentation.pptx",
              "python presentation_toolkit.py hunt-fonts ./presentations/",
              "python presentation_toolkit.py hunt-fonts file.pptx -p \"EventName2024\""
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
              🎯 Smart Search
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Exact font name matching</li>
              <li style={{ marginBottom: '8px' }}>• Partial name suggestions</li>
              <li style={{ marginBottom: '8px' }}>• Alternative font recommendations</li>
              <li style={{ marginBottom: '8px' }}>• Quality scoring and filtering</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              📊 Comprehensive Reports
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Beautiful HTML reports</li>
              <li style={{ marginBottom: '8px' }}>• Download statistics</li>
              <li style={{ marginBottom: '8px' }}>• Font categorization</li>
              <li style={{ marginBottom: '8px' }}>• Purchase recommendations</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              🚀 Batch Processing
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Process entire folders</li>
              <li style={{ marginBottom: '8px' }}>• Progress tracking</li>
              <li style={{ marginBottom: '8px' }}>• Error handling and retry</li>
              <li style={{ marginBottom: '8px' }}>• Detailed logging</li>
            </ul>
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
            {`presentation-toolkit/
├── hunted_fonts/
│   ├── EventName2024/
│   │   ├── fonts_found_free/
│   │   │   ├── Montserrat.ttf          # Auto-downloaded from Google Fonts
│   │   │   ├── Open Sans.ttf           # Auto-downloaded from Google Fonts
│   │   │   └── Lato.ttf                # Auto-downloaded from Google Fonts
│   │   └── font_report.html            # Beautiful report with links
│   └── presentation2/
│       ├── fonts_found_free/
│       └── font_report.html`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FontHunterSection
