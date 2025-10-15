/**
 * About Section
 * 
 * Contains all the detailed information previously on the main page.
 */

import React from 'react'
import OverviewSection from './OverviewSection'
import FontHunterSection from './FontHunterSection'
import FontExtractorSection from './FontExtractorSection'
import PDFConverterSection from './PDFConverterSection'
import InteractivePresentationsSection from './InteractivePresentationsSection'
import WebInterfaceSection from './WebInterfaceSection'

export const AboutSection: React.FC = () => {
  const [activeSubSection, setActiveSubSection] = React.useState('overview')

  const subSections = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'font-hunter', label: 'Font Hunter', icon: '🔍' },
    { id: 'font-extractor', label: 'Font Extractor', icon: '📦' },
    { id: 'pdf-converter', label: 'PDF Converter', icon: '📄' },
    { id: 'interactive-presentations', label: 'Interactive Presentations', icon: '🎬' },
    { id: 'web-interface', label: 'Web Interface', icon: '🌐' }
  ]

  const renderSubSection = () => {
    switch (activeSubSection) {
      case 'overview':
        return <OverviewSection />
      case 'font-hunter':
        return <FontHunterSection />
      case 'font-extractor':
        return <FontExtractorSection />
      case 'pdf-converter':
        return <PDFConverterSection />
      case 'interactive-presentations':
        return <InteractivePresentationsSection />
      case 'web-interface':
        return <WebInterfaceSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div>
      {/* Sub Navigation */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '0 20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          height: '50px',
          gap: '10px'
        }}>
          {subSections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSubSection(section.id)}
              style={{
                background: activeSubSection === section.id 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'transparent',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                color: 'white',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                fontWeight: activeSubSection === section.id ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (activeSubSection !== section.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeSubSection !== section.id) {
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

      {/* Sub Section Content */}
      {renderSubSection()}
    </div>
  )
}

export default AboutSection
