/**
 * FileUpload Component
 * 
 * Main file upload interface for production use.
 */

import React, { useState, useRef } from 'react'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
  processingType?: 'pdf-conversion' | 'font-hunting' | 'font-extraction' | 'presentation-processing'
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isProcessing,
  processingType
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

      </div>
    </div>
  )
}

export default FileUpload
