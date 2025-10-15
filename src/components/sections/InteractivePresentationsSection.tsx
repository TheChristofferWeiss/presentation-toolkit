/**
 * Interactive Presentations Section
 * 
 * Dedicated section for the interactive presentation system.
 */

import React from 'react'
import FeatureCard from '../FeatureCard'

export const InteractivePresentationsSection: React.FC = () => {
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
            🎬 Interactive Presentations
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            lineHeight: '1.6'
          }}>
            Transform PPTX files into interactive web presentations with GSAP animations and real-time control
          </p>
        </div>

        {/* Main Feature Card */}
        <div style={{
          marginBottom: '40px'
        }}>
          <FeatureCard
            title="Interactive Presentation System"
            description="Revolutionary system that converts PowerPoint presentations into interactive web-based presentations with smooth animations, real-time presenter controls, and live synchronization. Uses GSAP for professional-grade animations and Supabase for backend processing and storage."
            icon="🎬"
            status="development"
            features={[
              "PPTX to interactive web conversion",
              "GSAP-powered animations and transitions",
              "Real-time presenter controls and sync",
              "Slide notes and presenter preview",
              "Fullscreen presentation mode",
              "Keyboard shortcuts for navigation",
              "Supabase backend integration",
              "Custom font loading and rendering"
            ]}
            commands={[
              "npm install",
              "npm run dev",
              "supabase functions deploy process-presentation"
            ]}
          />
        </div>

        {/* Architecture Overview */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          marginBottom: '40px'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
            🏗️ System Architecture
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
            {`┌─────────────────┐
│   Upload PPTX   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Edge Function: process-presentation │
│  - Extract slides                    │
│  - Generate PNG references           │
│  - Extract elements & styles         │
│  - Parse animations                  │
│  - Store in Supabase                 │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│     Database (Supabase)              │
│  - presentations                     │
│  - slides                            │
│  - assets                            │
│  - fonts                             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   Presentation Viewer                │
│  - AnimatedSlide component           │
│  - GSAP animations                   │
│  - Real-time sync                    │
└──────────────────────────────────────┘`}
          </div>
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
              🎨 Animation Engine
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• PowerPoint-style animations</li>
              <li style={{ marginBottom: '8px' }}>• GSAP timeline control</li>
              <li style={{ marginBottom: '8px' }}>• Smooth transitions</li>
              <li style={{ marginBottom: '8px' }}>• Custom animation mapping</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              🎮 Presenter Controls
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Keyboard shortcuts</li>
              <li style={{ marginBottom: '8px' }}>• Slide notes display</li>
              <li style={{ marginBottom: '8px' }}>• Timer and progress</li>
              <li style={{ marginBottom: '8px' }}>• Fullscreen mode</li>
            </ul>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
              ☁️ Cloud Processing
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <li style={{ marginBottom: '8px' }}>• Supabase edge functions</li>
              <li style={{ marginBottom: '8px' }}>• Real-time synchronization</li>
              <li style={{ marginBottom: '8px' }}>• Scalable storage</li>
              <li style={{ marginBottom: '8px' }}>• Font and asset management</li>
            </ul>
          </div>
        </div>

        {/* Development Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ color: 'white', fontSize: '1.2rem', margin: '0 0 16px 0' }}>
            🚧 Development Status
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(76, 175, 80, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✅</div>
              <div style={{ color: 'white', fontWeight: '600' }}>Components</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                React components ready
              </div>
            </div>
            <div style={{
              background: 'rgba(76, 175, 80, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>✅</div>
              <div style={{ color: 'white', fontWeight: '600' }}>Edge Functions</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                Deployed to Supabase
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 193, 7, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🚧</div>
              <div style={{ color: 'white', fontWeight: '600' }}>UI Integration</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                In progress
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 193, 7, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🚧</div>
              <div style={{ color: 'white', fontWeight: '600' }}>Testing</div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                In progress
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractivePresentationsSection
