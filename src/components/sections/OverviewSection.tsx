/**
 * Overview Section
 * 
 * Main landing page showcasing all features and system status.
 */

import React from 'react'
import { supabase } from '../../lib/supabase'

export const OverviewSection: React.FC = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    // Test Supabase connection
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('presentations')
          .select('count')
          .limit(1)

        if (error) {
          console.error('Supabase connection error:', error)
          setIsConnected(false)
        } else {
          setIsConnected(true)
        }
      } catch (err) {
        console.error('Connection test failed:', err)
        setIsConnected(false)
      }
    }

    checkConnection()
  }, [])

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px'
        }}>
          <h1 style={{
            fontSize: '4rem',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 20px 0',
            letterSpacing: '-0.02em'
          }}>
            🎬 Presentation Toolkit
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0 0 40px 0',
            lineHeight: '1.6'
          }}>
            Complete solution for event tech producers to handle presentations, fonts, and conversions
          </p>

          {/* Connection Status */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            display: 'inline-block',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '1.1rem',
              color: 'white'
            }}>
              <span>🔌</span>
              <span>Supabase Connection</span>
              {isConnected === null && <span style={{ opacity: 0.7 }}>🔄 Testing...</span>}
              {isConnected === true && <span style={{ color: '#4ade80' }}>✅ Connected</span>}
              {isConnected === false && <span style={{ color: '#f87171' }}>❌ Failed</span>}
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>🔍</span>
              <h3 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>Font Hunter</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 16px 0' }}>
              Automatically hunt for fonts across 10 free repositories
            </p>
            <div style={{ fontSize: '0.9rem', color: '#4ade80' }}>✅ Ready</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>📦</span>
              <h3 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>Font Extractor</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 16px 0' }}>
              Extract embedded fonts from PPTX and Keynote files
            </p>
            <div style={{ fontSize: '0.9rem', color: '#4ade80' }}>✅ Ready</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>📄</span>
              <h3 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>PDF Converter</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 16px 0' }}>
              Convert PDF files to PowerPoint presentations
            </p>
            <div style={{ fontSize: '0.9rem', color: '#4ade80' }}>✅ Ready</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>🎬</span>
              <h3 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>Interactive Presentations</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 16px 0' }}>
              Transform PPTX to web presentations with GSAP animations
            </p>
            <div style={{ fontSize: '0.9rem', color: '#fbbf24' }}>🚧 In Development</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '2rem' }}>🌐</span>
              <h3 style={{ color: 'white', fontSize: '1.3rem', margin: 0 }}>Web Interface</h3>
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 16px 0' }}>
              Beautiful drag-and-drop UI for all tools
            </p>
            <div style={{ fontSize: '0.9rem', color: '#4ade80' }}>✅ Ready</div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '1.3rem',
            margin: '0 0 20px 0'
          }}>
            📚 Documentation
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <a
              href="#"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <span>📖</span>
              <span>Architecture Guide</span>
            </a>
            <a
              href="#"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <span>🚀</span>
              <span>Quick Start</span>
            </a>
            <a
              href="#"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <span>🔧</span>
              <span>Font Hunter Guide</span>
            </a>
            <a
              href="#"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              <span>🌐</span>
              <span>Web Interface</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewSection
