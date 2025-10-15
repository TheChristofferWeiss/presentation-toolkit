/**
 * PresentationPresenter Component
 * 
 * Presenter view with controls for slide navigation and animation playback.
 * Includes presenter notes and slide preview.
 */

import React, { useState, useEffect, useRef } from 'react'
import { usePresentationAnimations } from '../hooks/use-presentation-animations'
import AnimatedSlide, { PPTXElement, AnimationData, TransitionData } from '../components/presentation/AnimatedSlide'

interface SlideData {
  id: string
  slideNumber: number
  title?: string
  notes?: string
  elements: PPTXElement[]
  animations: AnimationData[]
  transition?: TransitionData
  background?: {
    referenceImage?: string
    color?: string
    type?: string
  }
}

interface PresentationPresenterProps {
  presentationId: string
  slides: SlideData[]
  onSlideChange?: (slideIndex: number) => void
  className?: string
}

export const PresentationPresenter: React.FC<PresentationPresenterProps> = ({
  presentationId,
  slides,
  onSlideChange,
  className = ''
}) => {
  const [showNotes, setShowNotes] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  const {
    currentSlide,
    isPlaying,
    isAnimating,
    playSlide,
    nextSlide,
    previousSlide,
    playAnimations,
    pauseAnimations,
    resumeAnimations,
    resetAnimations,
    registerSlideRef
  } = usePresentationAnimations(slides.length, {
    onSlideComplete: (slideIndex) => {
      onSlideChange?.(slideIndex)
      setIsTimerRunning(false)
    }
  })

  // Timer functionality
  useEffect(() => {
    if (isTimerRunning) {
      startTimeRef.current = Date.now() - timer
      timerRef.current = setInterval(() => {
        setTimer(Date.now() - startTimeRef.current)
      }, 100)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isTimerRunning, timer])

  // Handle slide changes
  useEffect(() => {
    onSlideChange?.(currentSlide)
  }, [currentSlide, onSlideChange])

  // Format timer display
  const formatTimer = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Prevent default browser behavior for presentation controls
      if (['ArrowRight', 'ArrowLeft', ' ', 'Enter', 'Escape'].includes(event.key)) {
        event.preventDefault()
      }

      switch (event.key) {
        case 'n':
        case 'N':
          // Toggle notes
          setShowNotes(prev => !prev)
          break
        case 'p':
        case 'P':
          // Toggle preview
          setShowPreview(prev => !prev)
          break
        case 'f':
        case 'F':
          // Toggle fullscreen
          setIsFullscreen(prev => !prev)
          break
        case 't':
        case 'T':
          // Toggle timer
          setIsTimerRunning(prev => !prev)
          break
        case 'r':
        case 'R':
          // Reset timer
          setTimer(0)
          setIsTimerRunning(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } catch (error) {
        console.error('Failed to enter fullscreen:', error)
      }
    } else {
      try {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } catch (error) {
        console.error('Failed to exit fullscreen:', error)
      }
    }
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const currentSlideData = slides[currentSlide]
  const nextSlideData = slides[currentSlide + 1]
  const previousSlideData = slides[currentSlide - 1]

  if (!currentSlideData) {
    return (
      <div className={`presentation-presenter ${className}`}>
        <div className="error-message">
          <h2>No slides available</h2>
          <p>The presentation contains no slides to display.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`presentation-presenter ${isFullscreen ? 'fullscreen' : ''} ${className}`}>
      {/* Main presentation area */}
      <div className="presentation-main">
        {/* Current slide */}
        <div className="current-slide-container">
          <AnimatedSlide
            slideId={currentSlideData.id}
            elements={currentSlideData.elements}
            animations={currentSlideData.animations}
            transition={currentSlideData.transition}
            isActive={true}
            autoPlay={isPlaying}
            background={currentSlideData.background}
            className="main-slide"
          />
        </div>

        {/* Slide counter and timer */}
        <div className="slide-info">
          <span className="slide-counter">
            {currentSlide + 1} / {slides.length}
          </span>
          <span className="timer" onClick={() => setIsTimerRunning(!isTimerRunning)}>
            {formatTimer(timer)}
          </span>
        </div>
      </div>

      {/* Presenter controls */}
      <div className="presenter-controls">
        {/* Navigation controls */}
        <div className="navigation-controls">
          <button
            onClick={() => previousSlide()}
            disabled={currentSlide === 0 || isAnimating}
            className="nav-button prev-button"
          >
            ← Previous
          </button>
          
          <div className="playback-controls">
            <button
              onClick={isPlaying ? pauseAnimations : resumeAnimations}
              className="playback-button"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button
              onClick={resetAnimations}
              className="reset-button"
            >
              🔄
            </button>
          </div>

          <button
            onClick={() => nextSlide()}
            disabled={currentSlide === slides.length - 1 || isAnimating}
            className="nav-button next-button"
          >
            Next →
          </button>
        </div>

        {/* Additional controls */}
        <div className="additional-controls">
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`control-button ${showNotes ? 'active' : ''}`}
            title="Toggle Notes (N)"
          >
            📝 Notes
          </button>
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`control-button ${showPreview ? 'active' : ''}`}
            title="Toggle Preview (P)"
          >
            👁️ Preview
          </button>
          
          <button
            onClick={toggleFullscreen}
            className={`control-button ${isFullscreen ? 'active' : ''}`}
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? '🔳' : '⛶'} Fullscreen
          </button>
          
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`control-button ${isTimerRunning ? 'active' : ''}`}
            title="Toggle Timer (T)"
          >
            ⏱️ Timer
          </button>
        </div>
      </div>

      {/* Sidebar with notes and preview */}
      {(showNotes || showPreview) && (
        <div className="presenter-sidebar">
          {/* Presenter notes */}
          {showNotes && currentSlideData.notes && (
            <div className="presenter-notes">
              <h3>Presenter Notes</h3>
              <div className="notes-content">
                {currentSlideData.notes}
              </div>
            </div>
          )}

          {/* Slide preview */}
          {showPreview && (
            <div className="slide-preview">
              <h3>Slide Preview</h3>
              
              {previousSlideData && (
                <div className="preview-slide previous">
                  <div className="preview-label">Previous</div>
                  <AnimatedSlide
                    slideId={previousSlideData.id}
                    elements={previousSlideData.elements}
                    animations={[]}
                    isActive={false}
                    background={previousSlideData.background}
                    className="preview-slide-content"
                  />
                </div>
              )}

              {nextSlideData && (
                <div className="preview-slide next">
                  <div className="preview-label">Next</div>
                  <AnimatedSlide
                    slideId={nextSlideData.id}
                    elements={nextSlideData.elements}
                    animations={[]}
                    isActive={false}
                    background={nextSlideData.background}
                    className="preview-slide-content"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Keyboard shortcuts help */}
      <div className="keyboard-shortcuts">
        <details>
          <summary>Keyboard Shortcuts</summary>
          <div className="shortcuts-grid">
            <div className="shortcut">
              <kbd>→</kbd> <span>Next slide</span>
            </div>
            <div className="shortcut">
              <kbd>←</kbd> <span>Previous slide</span>
            </div>
            <div className="shortcut">
              <kbd>Space</kbd> <span>Next slide</span>
            </div>
            <div className="shortcut">
              <kbd>Enter</kbd> <span>Play/Pause</span>
            </div>
            <div className="shortcut">
              <kbd>Escape</kbd> <span>Pause</span>
            </div>
            <div className="shortcut">
              <kbd>N</kbd> <span>Toggle Notes</span>
            </div>
            <div className="shortcut">
              <kbd>P</kbd> <span>Toggle Preview</span>
            </div>
            <div className="shortcut">
              <kbd>F</kbd> <span>Toggle Fullscreen</span>
            </div>
            <div className="shortcut">
              <kbd>T</kbd> <span>Toggle Timer</span>
            </div>
            <div className="shortcut">
              <kbd>R</kbd> <span>Reset Timer</span>
            </div>
          </div>
        </details>
      </div>
    </div>
  )
}

export default PresentationPresenter
