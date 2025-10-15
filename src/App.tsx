/**
 * Main App Component
 * 
 * Root component for the Presentation Toolkit application.
 */

import React from 'react'
import { supabase } from './lib/supabase'

function App() {
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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '20px',
          fontWeight: '700',
          letterSpacing: '-0.02em'
        }}>
          🎬 Presentation Toolkit
        </h1>
        
        <p style={{ 
          fontSize: '1.5rem', 
          marginBottom: '40px',
          opacity: 0.9,
          lineHeight: '1.6'
        }}>
          Transform PPTX files into interactive web presentations with animations and real-time control
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>
            🔌 Supabase Connection
          </h2>
          {isConnected === null && (
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              🔄 Testing connection...
            </p>
          )}
          {isConnected === true && (
            <p style={{ fontSize: '1.1rem', color: '#4ade80' }}>
              ✅ Connected successfully!
            </p>
          )}
          {isConnected === false && (
            <div>
              <p style={{ fontSize: '1.1rem', color: '#f87171', marginBottom: '15px' }}>
                ❌ Connection failed
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Please check your database tables are created.<br />
                See QUICKSTART_PRESENTATION_SYSTEM.md for setup instructions.
              </p>
            </div>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🎨</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>GSAP Animations</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Smooth PowerPoint-style animations</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🔍</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Font Hunter</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Auto-find fonts across 10 repositories</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚡</div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Real-time Control</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Live presenter controls & sync</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          fontSize: '0.95rem',
          textAlign: 'left'
        }}>
          <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>📚 Quick Links</h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0,
            lineHeight: '2'
          }}>
            <li>📖 <strong>Architecture:</strong> docs/PRESENTATION_SYSTEM.md</li>
            <li>🚀 <strong>Quick Start:</strong> QUICKSTART_PRESENTATION_SYSTEM.md</li>
            <li>🔧 <strong>Font Hunter:</strong> FONT_HUNTER_GUIDE.md</li>
            <li>🌐 <strong>Web Interface:</strong> WEB_INTERFACE_GUIDE.md</li>
          </ul>
        </div>

        <div style={{ marginTop: '40px', fontSize: '0.9rem', opacity: 0.7 }}>
          <p>Built for event tech producers 🎪</p>
          <p style={{ marginTop: '10px' }}>
            <a 
              href="https://github.com/your-username/presentation-toolkit" 
              style={{ color: 'white', textDecoration: 'underline' }}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
