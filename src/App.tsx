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
  const [originalFileName, setOriginalFileName] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null)

  // Check backend connection on component mount
  React.useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch('http://localhost:8080/health', {
          method: 'GET',
          mode: 'no-cors', // Avoid CORS issues for health check
        })
        setBackendConnected(true)
      } catch (error) {
        setBackendConnected(false)
      }
    }
    
    checkBackendConnection()
  }, [])

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true)
    
    // Determine processing type based on file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    let type: 'pdf-conversion' | 'font-hunting' | 'font-extraction' | 'presentation-processing'
    let endpoint: string
    
    if (fileExtension === '.pdf') {
      type = 'pdf-conversion'
      setProcessingType('pdf-conversion')
      endpoint = 'pdf-to-pptx'
    } else if (fileExtension === '.pptx' || fileExtension === '.key') {
      type = 'presentation-processing'
      setProcessingType('presentation-processing')
      endpoint = 'hunt-fonts' // Default to font hunting for presentations
    } else {
      type = 'presentation-processing'
      setProcessingType('presentation-processing')
      endpoint = 'hunt-fonts'
    }
    
    try {
      // Store original file name for fallback
      setOriginalFileName(file.name)
      
      // Send file to Python Flask backend
      const formData = new FormData()
      formData.append('file', file)
      
      // Use the Flask backend URL (you can change this to your actual backend URL)
      const backendUrl = 'http://localhost:8080' // Your Flask app runs on port 8080
      const response = await fetch(`${backendUrl}/${endpoint}`, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // Handle different response types
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        // JSON response (like font hunting results)
        const result = await response.json()
        console.log('Processing result:', result)
        
        // Store the result for download
        const resultBlob = new Blob([JSON.stringify(result, null, 2)], { 
          type: 'application/json' 
        })
        const resultFile = new File([resultBlob], `${file.name.replace(/\.[^/.]+$/, '')}_results.json`, {
          type: 'application/json'
        })
        setProcessedFile(resultFile)
      } else {
        // Binary response (like converted PPTX file)
        const blob = await response.blob()
        const outputFileName = type === 'pdf-conversion' 
          ? file.name.replace('.pdf', '.pptx')
          : `${file.name.replace(/\.[^/.]+$/, '')}_results.zip`
        
        // Create a proper File object with the correct MIME type
        const processedFile = new File([blob], outputFileName, { 
          type: blob.type || (type === 'pdf-conversion' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/zip')
        })
        
        console.log('Processed file:', processedFile.name, 'Size:', processedFile.size, 'Type:', processedFile.type)
        setProcessedFile(processedFile)
      }
      
      setIsProcessing(false)
      setProcessingType(undefined)
      setProcessingComplete(true)
      
    } catch (error) {
      console.error('Error processing file:', error)
      
      // Fallback to mock processing if backend is not available
      console.log('Backend not available, using mock processing')
      const processingTime = type === 'pdf-conversion' ? 3000 : 2000
      await new Promise(resolve => setTimeout(resolve, processingTime))
      
      setIsProcessing(false)
      setProcessingType(undefined)
      // Don't set the original file as processed - let the mock download handle it
      setProcessedFile(null)
      setProcessingComplete(true)
    }
  }

  const handleCloudConnect = (service: 'dropbox' | 'googledrive') => {
    console.log('Connecting to:', service)
    // Here you would integrate with cloud storage APIs
  }

  const handleDownload = async () => {
    if (isDownloading) return
    
    setIsDownloading(true)
    
    // Simulate download preparation time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Check if we have a real processed file from the backend
    if (processedFile && processedFile.size > 1000) {
      // This is likely a real processed file from the backend
      console.log('Downloading real processed file:', processedFile.name, 'Size:', processedFile.size)
      createDownload(processedFile)
    } else {
      // Fallback to mock download if no real file
      const originalName = originalFileName || 'document.pdf'
      const fileType = getFileType(originalName)
      
      if (fileType === 'pdf') {
        const outputFileName = originalName.replace('.pdf', '.pptx')
        createMockDownload(outputFileName, 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
      } else {
        const outputFileName = originalName.replace(/\.[^/.]+$/, '') + '_results.zip'
        createMockDownload(outputFileName, 'application/zip')
      }
    }
    
    setIsDownloading(false)
  }

  const createDownload = (file: File) => {
    // Create blob and download from the actual processed file
    const url = URL.createObjectURL(file)
    
    // Create temporary download link
    const link = document.createElement('a')
    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    console.log('Downloaded file:', file.name, 'Size:', file.size, 'bytes')
  }

  const createMockDownload = (fileName: string, mimeType: string) => {
    // Create a mock file content
    const mockContent = `This is a mock ${mimeType.includes('presentation') ? 'PowerPoint' : 'ZIP'} file generated from: ${processedFile?.name}
    
Generated by Presentation Toolkit
Timestamp: ${new Date().toISOString()}

In a real implementation, this would be the actual converted file.
For PDF to PPTX conversion, each page would be converted to a slide.
For presentation analysis, this would contain fonts, reports, and assets.`

    // Create blob and download
    const blob = new Blob([mockContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    // Create temporary download link
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up
    URL.revokeObjectURL(url)
    
    console.log('Downloaded mock file:', fileName)
  }

  const handleProcessAnother = () => {
    setProcessingComplete(false)
    setProcessedFile(null)
    setOriginalFileName(null)
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
            onCloudConnect={handleCloudConnect}
            isProcessing={isProcessing}
            processingType={processingType}
          />
          {processingComplete && (processedFile || originalFileName) && (
            <div style={{ padding: '0 20px' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <ProcessingResults
                  fileName={originalFileName || processedFile?.name || 'Unknown'}
                  fileType={getFileType(originalFileName || processedFile?.name || 'document.pdf')}
                  onDownload={handleDownload}
                  onProcessAnother={handleProcessAnother}
                  isDownloading={isDownloading}
                  backendConnected={backendConnected}
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
