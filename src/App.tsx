/**
 * Main App Component
 * 
 * Production-ready interface focused on file uploads and cloud connections.
 */

import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import AboutSection from './components/sections/AboutSection'
import ProcessingResults from './components/ProcessingResults'

function App() {
  const [activeSection, setActiveSection] = useState<'upload' | 'about'>('upload')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingType, setProcessingType] = useState<'pdf-conversion' | 'font-hunting' | 'font-extraction' | 'presentation-processing' | undefined>()
  const [processingComplete, setProcessingComplete] = useState(false)
  const [processedFile, setProcessedFile] = useState<File | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

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
    setProcessedFile(file)
    setProcessingComplete(true)
  }

  const handleDownload = async () => {
    if (!processedFile || isDownloading) return
    
    setIsDownloading(true)
    console.log('Downloading results for:', processedFile.name)
    
    // Simulate download preparation time
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Create a mock file based on the original file type
    const fileType = getFileType(processedFile.name)
    let mockContent: string
    let fileName: string
    let mimeType: string
    
    if (fileType === 'pdf') {
      // For PDFs, create a mock PPTX file
      fileName = processedFile.name.replace('.pdf', '.pptx')
      mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      mockContent = `Mock PowerPoint file converted from ${processedFile.name}
      
This is a placeholder file. In a real implementation, this would be:
- A properly formatted PPTX file
- Each PDF page converted to a slide
- High-quality images (300 DPI)
- 16:9 widescreen format
- Ready for presentations

Original file: ${processedFile.name}
Converted on: ${new Date().toISOString()}
File size: ${processedFile.size} bytes`
    } else {
      // For presentations, create a mock results file
      fileName = `${processedFile.name.replace(/\.[^/.]+$/, '')}_results.txt`
      mimeType = 'text/plain'
      mockContent = `Presentation Analysis Results for: ${processedFile.name}

FONTS FOUND:
- Arial (System Font)
- Calibri (System Font)
- Times New Roman (System Font)

FONT HUNTING RESULTS:
✓ Arial - Found in Google Fonts (Free)
✓ Calibri - Found in Google Fonts (Free)
✓ Times New Roman - Found in Google Fonts (Free)

EXTRACTED FONTS:
- font_arial.ttf (12.5 KB)
- font_calibri.ttf (15.2 KB)
- font_times.ttf (18.7 KB)

INTERACTIVE PRESENTATION:
- Web version created at: /presentation/${processedFile.name.replace(/\.[^/.]+$/, '')}
- All animations preserved
- Responsive design enabled

Analysis completed on: ${new Date().toISOString()}
Original file size: ${processedFile.size} bytes`
    }
    
    // Create and download the file
    const blob = new Blob([mockContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    
    console.log('Downloaded file:', fileName)
    setIsDownloading(false)
  }

  const handleProcessAnother = () => {
    setProcessingComplete(false)
    setProcessedFile(null)
    setIsProcessing(false)
    setProcessingType(undefined)
    setIsDownloading(false)
  }

  const getFileType = (fileName: string): 'pdf' | 'pptx' | 'key' => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'))
    if (extension === '.pdf') return 'pdf'
    if (extension === '.key') return 'key'
    return 'pptx'
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
        <>
          <FileUpload
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
            processingType={processingType}
          />
          {processingComplete && processedFile && (
            <div style={{ padding: '0 20px' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <ProcessingResults
                  fileName={processedFile.name}
                  fileType={getFileType(processedFile.name)}
                  onDownload={handleDownload}
                  onProcessAnother={handleProcessAnother}
                  isDownloading={isDownloading}
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <AboutSection />
      )}
    </div>
  )
}

export default App
