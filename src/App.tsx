/**
 * Main App Component
 * 
 * Production-ready interface focused on file uploads and cloud connections.
 */

import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import AboutSection from './components/sections/AboutSection'

function App() {
  const [activeSection, setActiveSection] = useState<'upload' | 'about'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingType, setProcessingType] = useState<'pdf-conversion' | 'font-hunting' | 'font-extraction' | 'presentation-processing' | undefined>()

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    
    // Determine processing type based on file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    let type: 'pdf-conversion' | 'font-hunting' | 'font-extraction' | 'presentation-processing'
    
    if (fileExtension === '.pdf') {
      type = 'pdf-conversion'
      setProcessingType('pdf-conversion')
    } else if (fileExtension === '.pptx' || fileExtension === '.key') {
      type = 'presentation-processing'
      setProcessingType('presentation-processing')
    } else {
      type = 'presentation-processing'
      setProcessingType('presentation-processing')
    }
    
    // Simulate processing time (longer for PDF conversion)
    const processingTime = type === 'pdf-conversion' ? 3000 : 2000
    await new Promise(resolve => setTimeout(resolve, processingTime))
    
    // Here you would integrate with your actual processing pipeline
    console.log('Processing file:', file.name, 'Type:', type)
    
    setIsProcessing(false)
    setProcessingType(undefined)
  }

  const handleCloudConnect = (service: 'dropbox' | 'googledrive') => {
    console.log('Connecting to:', service)
    // Here you would integrate with cloud storage APIs
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      {/* Main Navigation */}
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
            <button
              onClick={() => setActiveSection('upload')}
              style={{
                background: activeSection === 'upload' 
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
                fontWeight: activeSection === 'upload' ? '600' : '400'
              }}
            >
              <span>📁</span>
              <span>Upload</span>
            </button>
            <button
              onClick={() => setActiveSection('about')}
              style={{
                background: activeSection === 'about' 
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
                fontWeight: activeSection === 'about' ? '600' : '400'
              }}
            >
              <span>ℹ️</span>
              <span>About</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {activeSection === 'upload' ? (
        <FileUpload
          onFileUpload={handleFileUpload}
          onCloudConnect={handleCloudConnect}
          isProcessing={isProcessing}
          processingType={processingType}
        />
      ) : (
        <AboutSection />
      )}
    </div>
  )
}

export default App
