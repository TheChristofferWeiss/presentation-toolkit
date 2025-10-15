/**
 * FileUpload Component
 * 
 * Main file upload interface for production use.
 */

import React, { useState, useRef } from 'react'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  onCloudConnect: (service: 'dropbox' | 'googledrive') => void
  isProcessing: boolean
  processingType?: 'pdf-conversion' | 'font-hunting' | 'font-extraction' | 'presentation-processing'
  backendConnected?: boolean | null
  onCheckBackend?: () => void
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  onCloudConnect,
  isProcessing,
  processingType,
  backendConnected,
  onCheckBackend
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (isValidFile(file)) {
        setUploadedFile(file)
        onFileUpload(file)
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (isValidFile(file)) {
        setUploadedFile(file)
        onFileUpload(file)
      }
    }
  }

  const isValidFile = (file: File): boolean => {
    const validTypes = ['.pptx', '.key', '.pdf']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    return validTypes.includes(fileExtension)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{ padding: '40px 20px' }}>
      <div style={{
        maxWidth: '800px',
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
            margin: '0 0 16px 0'
          }}>
            🎬 Presentation Toolkit
          </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0
        }}>
          Upload PDFs to convert to PowerPoint, or presentations for font analysis
        </p>
        
        {/* Backend Status */}
        {backendConnected !== null && (
          <div style={{
            marginTop: '16px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: backendConnected 
              ? 'rgba(34, 197, 94, 0.2)' 
              : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${backendConnected 
              ? 'rgba(34, 197, 94, 0.4)' 
              : 'rgba(239, 68, 68, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>
              {backendConnected ? '✅' : '⚠️'}
            </span>
            <span style={{
              color: backendConnected ? '#22c55e' : '#ef4444',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {backendConnected 
                ? 'Python Backend Connected' 
                : 'Python Backend Offline'
              }
            </span>
            {onCheckBackend && (
              <button
                onClick={onCheckBackend}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  color: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                Check
              </button>
            )}
          </div>
        )}
        </div>

        {/* File Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: dragActive 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(255, 255, 255, 0.1)',
            border: dragActive 
              ? '2px dashed rgba(255, 255, 255, 0.8)' 
              : '2px dashed rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            marginBottom: '30px'
          }}
        >
          <div style={{
            fontSize: '4rem',
            marginBottom: '20px'
          }}>
            {isProcessing ? '⏳' : uploadedFile ? '✅' : '📁'}
          </div>
          
          {isProcessing ? (
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', margin: '0 0 10px 0' }}>
                {processingType === 'pdf-conversion' 
                  ? 'Converting PDF to PowerPoint...'
                  : processingType === 'font-hunting'
                  ? 'Hunting for fonts...'
                  : processingType === 'font-extraction'
                  ? 'Extracting fonts...'
                  : 'Processing your file...'
                }
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {processingType === 'pdf-conversion'
                  ? 'Converting each page to a slide with 16:9 aspect ratio'
                  : processingType === 'font-hunting'
                  ? 'Searching across 10 free font repositories'
                  : processingType === 'font-extraction'
                  ? 'Extracting embedded fonts from your presentation'
                  : 'Please wait while we analyze your presentation'
                }
              </p>
            </div>
          ) : uploadedFile ? (
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', margin: '0 0 10px 0' }}>
                File uploaded successfully!
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {uploadedFile.name} ({formatFileSize(uploadedFile.size)})
              </p>
            </div>
          ) : (
            <div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', margin: '0 0 10px 0' }}>
                Drop files here or click to browse
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                PDFs → PowerPoint conversion | Presentations → Font analysis
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pptx,.key,.pdf"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </div>

        {/* Cloud Connections */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '30px',
          backdropFilter: 'blur(10px)',
          marginBottom: '30px'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '1.3rem',
            margin: '0 0 20px 0',
            textAlign: 'center'
          }}>
            ☁️ Connect Cloud Storage
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px'
          }}>
            <button
              onClick={() => onCloudConnect('dropbox')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '2rem' }}>📦</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600' }}>Dropbox</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  Connect to Dropbox
                </div>
              </div>
            </button>

            <button
              onClick={() => onCloudConnect('googledrive')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontSize: '2rem' }}>📁</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '600' }}>Google Drive</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                  Connect to Google Drive
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <h3 style={{
            color: 'white',
            fontSize: '1.2rem',
            margin: '0 0 16px 0'
          }}>
            🚀 What happens next?
          </h3>
          {uploadedFile ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem'
            }}>
              {uploadedFile.name.toLowerCase().endsWith('.pdf') ? (
                // PDF-specific workflow
                <>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📄</div>
                    <div>PDF Analysis</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🖼️</div>
                    <div>Page to Image</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📊</div>
                    <div>Create Slides</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎯</div>
                    <div>16:9 Format</div>
                  </div>
                </>
              ) : uploadedFile.name.toLowerCase().endsWith('.pptx') || uploadedFile.name.toLowerCase().endsWith('.key') ? (
                // Presentation-specific workflow
                <>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔍</div>
                    <div>Font Analysis</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📦</div>
                    <div>Font Extraction</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎬</div>
                    <div>Web Conversion</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📊</div>
                    <div>Report Generation</div>
                  </div>
                </>
              ) : (
                // Default workflow
                <>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔍</div>
                    <div>File Analysis</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⚙️</div>
                    <div>Processing</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📊</div>
                    <div>Results</div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.9rem'
            }}>
              <div style={{
                background: 'rgba(76, 175, 80, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                border: '2px solid rgba(76, 175, 80, 0.3)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📄</div>
                <div style={{ fontWeight: '600' }}>PDF → PPTX</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Primary Feature</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔍</div>
                <div>Font Hunting</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📦</div>
                <div>Font Extraction</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🎬</div>
                <div>Web Presentations</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileUpload
