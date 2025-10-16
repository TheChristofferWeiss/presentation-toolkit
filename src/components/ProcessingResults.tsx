/**
 * ProcessingResults Component
 * 
 * Shows results after file processing is complete.
 */

import React from 'react'

interface ProcessingResultsProps {
  fileName: string
  fileType: 'pdf' | 'pptx' | 'key'
  onDownload: () => void
  onProcessAnother: () => void
}

export const ProcessingResults: React.FC<ProcessingResultsProps> = ({
  fileName,
  fileType,
  onDownload,
  onProcessAnother
}) => {
  const getResultsForFileType = () => {
    if (fileType === 'pdf') {
      return {
        title: 'PDF Converted to PowerPoint!',
        description: 'Your PDF has been successfully converted to a PowerPoint presentation.',
        icon: '✅',
        downloadText: 'Download PPTX',
        details: [
          'Each PDF page converted to a slide',
          'High-quality images (300 DPI)',
          '16:9 widescreen format',
          'Ready for presentations'
        ],
        outputFile: fileName.replace('.pdf', '.pptx')
      }
    } else {
      return {
        title: 'Presentation Analysis Complete!',
        description: 'Your presentation has been analyzed for fonts and converted.',
        icon: '✅',
        downloadText: 'Download Results',
        details: [
          'Fonts extracted and categorized',
          'Font hunting report generated',
          'Interactive web presentation created',
          'All assets organized'
        ],
        outputFile: `${fileName.replace(/\.[^/.]+$/, '')}_results.zip`
      }
    }
  }

  const results = getResultsForFileType()

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '30px',
      backdropFilter: 'blur(10px)',
      marginBottom: '30px'
    }}>
      {/* Success Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '12px'
        }}>
          {results.icon}
        </div>
        <h2 style={{
          color: 'white',
          fontSize: '1.8rem',
          margin: '0 0 8px 0',
          fontWeight: '600'
        }}>
          {results.title}
        </h2>
        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '1rem',
          margin: 0
        }}>
          {results.description}
        </p>
      </div>

      {/* Results Details */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          color: 'white',
          fontSize: '1.2rem',
          margin: '0 0 16px 0',
          textAlign: 'center'
        }}>
          📊 Processing Summary
        </h3>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          {results.details.map((detail, index) => (
            <li key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
              padding: '8px 0'
            }}>
              <span style={{ color: '#4ade80', fontSize: '1.2rem' }}>✓</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* File Information */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{
            color: 'white',
            fontSize: '0.9rem',
            marginBottom: '4px'
          }}>
            Output File:
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem',
            fontFamily: 'Monaco, Consolas, monospace'
          }}>
            {results.outputFile}
          </div>
        </div>
        <div style={{
          fontSize: '1.5rem'
        }}>
          {fileType === 'pdf' ? '📊' : '📦'}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center'
      }}>
        <button
          onClick={onDownload}
          style={{
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(74, 222, 128, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(74, 222, 128, 0.3)'
          }}
        >
          <span>⬇️</span>
          <span>{results.downloadText}</span>
        </button>

        <button
          onClick={onProcessAnother}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '12px 24px',
            color: 'white',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
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
          <span>🔄</span>
          <span>Process Another</span>
        </button>
      </div>

      {/* Additional Actions */}
      {fileType === 'pdf' && (
        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            margin: '0 0 12px 0'
          }}>
            Want to enhance your presentation further?
          </p>
          <div style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
            >
              🔍 Hunt for Fonts
            </button>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
              }}
            >
              🎬 Make Interactive
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessingResults
