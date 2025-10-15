/**
 * Main App Component
 * 
 * Root component for the Presentation Toolkit application with navigation.
 */

import React from 'react'
import Navigation from './components/Navigation'
import OverviewSection from './components/sections/OverviewSection'
import FontHunterSection from './components/sections/FontHunterSection'
import FontExtractorSection from './components/sections/FontExtractorSection'
import PDFConverterSection from './components/sections/PDFConverterSection'
import InteractivePresentationsSection from './components/sections/InteractivePresentationsSection'
import WebInterfaceSection from './components/sections/WebInterfaceSection'

function App() {
  const [activeSection, setActiveSection] = React.useState('overview')

  const renderSection = () => {
    switch (activeSection) {
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
    <div style={{ 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      {renderSection()}
    </div>
  )
}

export default App
