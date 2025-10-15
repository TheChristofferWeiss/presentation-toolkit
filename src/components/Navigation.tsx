/**
 * Navigation Component
 * 
 * Main navigation for the presentation toolkit with feature sections.
 */

import React from 'react'

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'font-hunter', label: 'Font Hunter', icon: '🔍' },
    { id: 'font-extractor', label: 'Font Extractor', icon: '📦' },
    { id: 'pdf-converter', label: 'PDF Converter', icon: '📄' },
    { id: 'interactive-presentations', label: 'Interactive Presentations', icon: '🎬' },
    { id: 'web-interface', label: 'Web Interface', icon: '🌐' }
  ]

  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '0 20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        height: '60px'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '1.2rem',
          fontWeight: '700',
          color: 'white'
        }}>
          🎬 Presentation Toolkit
        </div>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          gap: '5px'
        }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              style={{
                background: activeSection === section.id 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'transparent',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                color: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                fontWeight: activeSection === section.id ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
