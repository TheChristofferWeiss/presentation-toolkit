/**
 * FeatureCard Component
 * 
 * Reusable card component for displaying feature information.
 */

import React from 'react'

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  features: string[]
  commands?: string[]
  status?: 'ready' | 'development' | 'beta'
  onClick?: () => void
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  features,
  commands,
  status = 'ready',
  onClick
}) => {
  const statusColors = {
    ready: '#4ade80',
    development: '#fbbf24',
    beta: '#3b82f6'
  }

  const statusLabels = {
    ready: '✅ Ready',
    development: '🚧 In Development',
    beta: '🧪 Beta'
  }

  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            fontSize: '2rem'
          }}>
            {icon}
          </div>
          <h3 style={{
            color: 'white',
            fontSize: '1.3rem',
            fontWeight: '600',
            margin: 0
          }}>
            {title}
          </h3>
        </div>
        <div style={{
          background: statusColors[status],
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: '600'
        }}>
          {statusLabels[status]}
        </div>
      </div>

      {/* Description */}
      <p style={{
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '1rem',
        lineHeight: '1.5',
        margin: '0 0 20px 0'
      }}>
        {description}
      </p>

      {/* Features */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: '600',
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Features
        </h4>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {features.map((feature, index) => (
            <li key={index} style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '0.9rem',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#4ade80' }}>•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Commands */}
      {commands && commands.length > 0 && (
        <div style={{
          marginTop: 'auto'
        }}>
          <h4 style={{
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '600',
            margin: '0 0 8px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Quick Commands
          </h4>
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: '0.8rem',
            color: '#e5e7eb'
          }}>
            {commands.map((command, index) => (
              <div key={index} style={{ marginBottom: '4px' }}>
                <span style={{ color: '#9ca3af' }}>$</span> {command}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeatureCard
