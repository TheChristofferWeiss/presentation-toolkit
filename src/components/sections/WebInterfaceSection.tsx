/**
 * Web Interface Section
 * 
 * Dedicated section for the web interface feature.
 */

import React from 'react'
import FeatureCard from '../FeatureCard'

export const WebInterfaceSection: React.FC = () => {
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
            🌐 Web Interface
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Beautiful drag-and-drop web interface for all presentation tools
          </p>
        </div>

        {/* Main Feature Card */}
        <div style={{
          marginBottom: '40px'
        }}>
          <FeatureCard
            title="Web Interface"
            description="Modern, responsive web interface built with Flask that provides a beautiful drag-and-drop experience for all presentation toolkit features. No command line needed - everything accessible through your browser with visual feedback and progress tracking."
            icon="🌐"
            status="ready"
            features={[
              "Drag & drop file upload interface",
              "Visual results with statistics and progress",
              "One-click font hunting and extraction",
              "Download reports and fonts directly",
              "Real-time processing feedback",
              "Responsive design for all devices",
              "Error handling and user guidance",
              "No command line knowledge required"
            ]}
            commands={[
              "./start_web.sh",
              "python web_app.py",
              "# Then open: http://localhost:8080"
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
              🎨 Modern UI/UX
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Beautiful gradient design</li>
              <li style={{ marginBottom: '8px' }}>• Drag & drop functionality</li>
              <li style={{ marginBottom: '8px' }}>• Real-time progress indicators</li>
              <li style={{ marginBottom: '8px' }}>• Responsive mobile design</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              📊 Visual Feedback
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Processing progress bars</li>
              <li style={{ marginBottom: '8px' }}>• Results statistics</li>
              <li style={{ marginBottom: '8px' }}>• Success/error notifications</li>
              <li style={{ marginBottom: '8px' }}>• Download links and previews</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              🚀 Easy Access
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• One-click startup script</li>
              <li style={{ marginBottom: '8px' }}>• No installation required</li>
              <li style={{ marginBottom: '8px' }}>• Works in any browser</li>
              <li style={{ marginBottom: '8px' }}>• Cross-platform support</li>
            </ul>
          </div>
        </div>

        {/* Available Tools */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
            🛠️ Available Tools
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
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
              <div style={{ color: 'white', fontWeight: '600' }}>Font Hunter</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Hunt across 10 repositories
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
              <div style={{ color: 'white', fontWeight: '600' }}>Font Extractor</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Extract embedded fonts
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📄</div>
              <div style={{ color: 'white', fontWeight: '600' }}>PDF Converter</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                PDF to PPTX conversion
              </div>
            </div>
          </div>
        </div>

        {/* Getting Started */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
            🚀 Getting Started
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
            {`# Start the web interface
./start_web.sh

# Or manually:
python web_app.py

# Then open your browser to:
http://localhost:8080

# Features:
# ✅ Drag & drop file upload
# ✅ Font hunting with visual results
# ✅ Font extraction with progress
# ✅ PDF conversion with preview
# ✅ Download reports and fonts`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebInterfaceSection
