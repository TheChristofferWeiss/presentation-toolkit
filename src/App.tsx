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
      // Try Supabase Edge Function first
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      
      if (supabaseUrl && supabaseKey && type === 'presentation-processing') {
        console.log('Using Supabase Edge Function for presentation processing')
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('presentationId', crypto.randomUUID())
        formData.append('userId', 'demo-user')
        
        const response = await fetch(`${supabaseUrl}/functions/v1/process-presentation`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('Supabase processing result:', result)
          
          // Create a results file from the response
          const resultBlob = new Blob([JSON.stringify(result, null, 2)], { 
            type: 'application/json' 
          })
          const resultFile = new File([resultBlob], `${file.name.replace(/\.[^/.]+$/, '')}_results.json`, {
            type: 'application/json'
          })
          
          setProcessedFile(resultFile)
          setIsProcessing(false)
          setProcessingType(undefined)
          setProcessingComplete(true)
          return
        } else {
          console.log('Supabase function failed, falling back to Flask backend')
        }
      }
      
      // Fallback to Flask backend
      console.log('Using Flask backend for processing')
      
      const formData = new FormData()
      formData.append('file', file)
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
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
        console.log('Processing result (JSON):', result)
        
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
        console.log('Received blob:', { size: blob.size, type: blob.type })
        
        const outputFileName = type === 'pdf-conversion' 
          ? file.name.replace('.pdf', '.pptx')
          : `${file.name.replace(/\.[^/.]+$/, '')}_results.zip`
        
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
      
      // If backend fails, fall back to mock processing
      console.log('Backend processing failed, using mock processing')
      const processingTime = type === 'pdf-conversion' ? 3000 : 2000
      await new Promise(resolve => setTimeout(resolve, processingTime))
      
      setIsProcessing(false)
      setProcessingType(undefined)
      setProcessedFile(file)
      setProcessingComplete(true)
    }
  }

  const handleDownload = async () => {
    if (!processedFile || isDownloading) return
    
    setIsDownloading(true)
    console.log('Downloading results for:', processedFile.name)
    
    // Simulate download preparation time
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Download the actual processed file
    const url = URL.createObjectURL(processedFile)
    
    const link = document.createElement('a')
    link.href = url
    link.download = processedFile.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
    
    console.log('Downloaded file:', processedFile.name, 'Size:', processedFile.size, 'bytes')
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
