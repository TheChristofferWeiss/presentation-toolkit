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

  const checkBackendConnection = async () => {
    try {
      console.log('Checking backend connection...')
      const response = await fetch('http://localhost:8080/health', {
        method: 'GET',
      })
      console.log('Backend health check response:', response.status)
      if (response.ok) {
        setBackendConnected(true)
        console.log('Backend is connected!')
      } else {
        setBackendConnected(false)
        console.log('Backend health check failed')
      }
    } catch (error) {
      console.log('Backend connection failed:', error)
      setBackendConnected(false)
    }
  }

  // Check backend connection on component mount
  React.useEffect(() => {
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
    
    // Only process if backend is connected
    if (!backendConnected) {
      console.log('Backend is offline - no processing available')
      setIsProcessing(false)
      setProcessingType(undefined)
      return
    }

    try {
      // Store original file name
      setOriginalFileName(file.name)
      
      // Send file to Python Flask backend
      const formData = new FormData()
      formData.append('file', file)
      
      // Use the Flask backend URL (you can change this to your actual backend URL)
      const backendUrl = 'http://localhost:8080' // Your Flask app runs on port 8080
      console.log(`Sending file to: ${backendUrl}/${endpoint}`)
      console.log('File details:', { name: file.name, size: file.size, type: file.type })
      
      const response = await fetch(`${backendUrl}/${endpoint}`, {
        method: 'POST',
        body: formData,
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      // Handle different response types
      const contentType = response.headers.get('content-type')
      console.log('Response content type:', contentType)
      
      if (contentType && contentType.includes('application/json')) {
        // JSON response (like font hunting results)
        const result = await response.json()
        console.log('Processing result (JSON):', result)
        
        // Store the result for download
        const resultBlob = new Blob([JSON.stringify(result, null, 2)], { 
          type: 'application/json' 
        })
        const resultFile = new File([resultBlob], `${file.name.replace(/\.[^/.]+$/, '')}_results.json`, {
          type: 'application/json'
        })
        console.log('Created JSON result file:', resultFile.name, 'Size:', resultFile.size)
        setProcessedFile(resultFile)
      } else {
        // Binary response (like converted PPTX file)
        const blob = await response.blob()
        console.log('Received blob:', { size: blob.size, type: blob.type })
        
        const outputFileName = type === 'pdf-conversion' 
          ? file.name.replace('.pdf', '.pptx')
          : `${file.name.replace(/\.[^/.]+$/, '')}_results.zip`
        
        // Create a proper File object with the correct MIME type
        const processedFile = new File([blob], outputFileName, { 
          type: blob.type || (type === 'pdf-conversion' ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' : 'application/zip')
        })
        
        console.log('Created processed file:', processedFile.name, 'Size:', processedFile.size, 'Type:', processedFile.type)
        setProcessedFile(processedFile)
      }
      
      setIsProcessing(false)
      setProcessingType(undefined)
      setProcessingComplete(true)
      
    } catch (error) {
      console.error('Error processing file:', error)
      
      // If backend fails, stop processing - no mock files
      console.log('Backend processing failed - no results available')
      setIsProcessing(false)
      setProcessingType(undefined)
      setProcessedFile(null)
      setProcessingComplete(false)
    }
  }

  const handleCloudConnect = (service: 'dropbox' | 'googledrive') => {
    console.log('Connecting to:', service)
    // Here you would integrate with cloud storage APIs
  }

  const handleDownload = async () => {
    if (isDownloading || !processedFile) return
    
    setIsDownloading(true)
    
    // Simulate download preparation time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Only download if we have a real processed file from the backend
    if (processedFile && processedFile.size > 1000) {
      console.log('Downloading real processed file:', processedFile.name, 'Size:', processedFile.size)
      createDownload(processedFile)
    } else {
      console.log('No processed file available for download')
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
            backendConnected={backendConnected}
            onCheckBackend={checkBackendConnection}
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
                  hasProcessedFile={!!processedFile}
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
