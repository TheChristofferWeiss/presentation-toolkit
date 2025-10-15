/**
 * AnimatedSlide Component
 * 
 * Renders individual slides with GSAP animations and transitions.
 * Handles element positioning, styling, and animation sequences.
 */

import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export interface PPTXElement {
  id: string
  type: 'text' | 'image' | 'shape'
  content?: string
  source?: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  style?: {
    fontFamily?: string
    fontSize?: number
    fontWeight?: string
    fontStyle?: string
    color?: string
    backgroundColor?: string
    textAlign?: string
    rotation?: number
    opacity?: number
  }
}

export interface AnimationData {
  targetId: string
  effect: string
  trigger: string
  order: number
  duration?: number
  delay?: number
  direction?: string
}

export interface TransitionData {
  type: 'fade' | 'push' | 'wipe' | 'zoom' | 'morph'
  direction?: 'left' | 'right' | 'up' | 'down'
  duration?: number
}

interface AnimatedSlideProps {
  slideId: string
  elements: PPTXElement[]
  animations: AnimationData[]
  transition?: TransitionData
  isActive: boolean
  autoPlay?: boolean
  onAnimationComplete?: () => void
  background?: {
    referenceImage?: string
    color?: string
    type?: string
  }
  showReferenceImage?: boolean
  className?: string
}

export const AnimatedSlide: React.FC<AnimatedSlideProps> = ({
  slideId,
  elements,
  animations,
  transition,
  isActive,
  autoPlay = false,
  onAnimationComplete,
  background,
  showReferenceImage = false,
  className = ''
}) => {
  const slideRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set())

  // Load custom fonts
  useEffect(() => {
    const fontFamilies = new Set<string>()
    
    elements.forEach(element => {
      if (element.style?.fontFamily) {
        fontFamilies.add(element.style.fontFamily)
      }
    })

    const loadFonts = async () => {
      for (const fontFamily of fontFamilies) {
        if (!loadedFonts.has(fontFamily)) {
          try {
            await document.fonts.load(`16px "${fontFamily}"`)
            setLoadedFonts(prev => new Set([...prev, fontFamily]))
          } catch (error) {
            console.warn(`Failed to load font: ${fontFamily}`, error)
          }
        }
      }
    }

    loadFonts()
  }, [elements, loadedFonts])

  // Initialize animations when slide becomes active
  useEffect(() => {
    if (isActive && slideRef.current && animations.length > 0) {
      initializeAnimations()
    }
  }, [isActive, animations])

  // Handle slide transitions
  useEffect(() => {
    if (transition && slideRef.current) {
      applyTransition(transition)
    }
  }, [transition])

  const initializeAnimations = () => {
    if (!slideRef.current) return

    setIsAnimating(true)
    
    // Sort animations by order
    const sortedAnimations = [...animations].sort((a, b) => a.order - b.order)
    
    // Create GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false)
        onAnimationComplete?.()
      }
    })

    // Apply animations to elements
    sortedAnimations.forEach(animation => {
      const element = slideRef.current?.querySelector(`[data-element-id="${animation.targetId}"]`)
      if (!element) return

      // Set initial state based on animation type
      setInitialAnimationState(element, animation)

      // Add animation to timeline
      tl.to(element, {
        duration: animation.duration || 0.5,
        delay: animation.delay || 0,
        ease: "power2.out",
        ...getAnimationProperties(animation)
      }, animation.order * 0.1) // Stagger animations
    })

    // Auto-play if enabled
    if (autoPlay) {
      tl.play()
    }
  }

  const setInitialAnimationState = (element: Element, animation: AnimationData) => {
    const gsapElement = gsap.getProperty(element) as any

    switch (animation.effect) {
      case 'fade':
        gsap.set(element, { opacity: 0 })
        break
      case 'flyin':
        const direction = animation.direction || 'left'
        const offset = 100
        gsap.set(element, {
          x: direction === 'left' ? -offset : direction === 'right' ? offset : 0,
          y: direction === 'up' ? -offset : direction === 'down' ? offset : 0,
          opacity: 0
        })
        break
      case 'zoom':
        gsap.set(element, { scale: 0, opacity: 0 })
        break
      case 'slide':
        gsap.set(element, { x: animation.direction === 'left' ? -200 : 200 })
        break
      case 'spin':
        gsap.set(element, { rotation: -360 })
        break
      default:
        gsap.set(element, { opacity: 0 })
    }
  }

  const getAnimationProperties = (animation: AnimationData) => {
    switch (animation.effect) {
      case 'fade':
        return { opacity: 1 }
      case 'flyin':
        return { x: 0, y: 0, opacity: 1 }
      case 'zoom':
        return { scale: 1, opacity: 1 }
      case 'slide':
        return { x: 0 }
      case 'spin':
        return { rotation: 0 }
      default:
        return { opacity: 1 }
    }
  }

  const applyTransition = (transitionData: TransitionData) => {
    if (!slideRef.current) return

    const duration = transitionData.duration || 0.5
    
    switch (transitionData.type) {
      case 'fade':
        gsap.fromTo(slideRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration }
        )
        break
      case 'push':
        const direction = transitionData.direction || 'left'
        const offset = direction === 'left' || direction === 'right' ? window.innerWidth : window.innerHeight
        gsap.fromTo(slideRef.current,
          { 
            x: direction === 'left' ? offset : direction === 'right' ? -offset : 0,
            y: direction === 'up' ? offset : direction === 'down' ? -offset : 0
          },
          { x: 0, y: 0, duration }
        )
        break
      case 'zoom':
        gsap.fromTo(slideRef.current,
          { scale: 0.8 },
          { scale: 1, duration }
        )
        break
    }
  }

  const renderElement = (element: PPTXElement) => {
    const elementStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.position?.x || 0}px`,
      top: `${element.position?.y || 0}px`,
      width: element.size?.width ? `${element.size.width}px` : 'auto',
      height: element.size?.height ? `${element.size.height}px` : 'auto',
      fontFamily: element.style?.fontFamily,
      fontSize: element.style?.fontSize ? `${element.style.fontSize}pt` : undefined,
      fontWeight: element.style?.fontWeight,
      fontStyle: element.style?.fontStyle,
      color: element.style?.color,
      backgroundColor: element.style?.backgroundColor,
      textAlign: element.style?.textAlign as any,
      opacity: element.style?.opacity ?? 1,
      transform: element.style?.rotation ? `rotate(${element.style.rotation}deg)` : undefined,
    }

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            id={element.id}
            data-element-id={element.id}
            style={elementStyle}
            className="presentation-element text-element"
          >
            {element.content}
          </div>
        )

      case 'image':
        return (
          <div
            key={element.id}
            id={element.id}
            data-element-id={element.id}
            style={elementStyle}
            className="presentation-element image-element"
          >
            {element.source && (
              <img 
                src={element.source} 
                alt="" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.warn(`Failed to load image: ${element.source}`)
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
        )

      case 'shape':
        return (
          <div
            key={element.id}
            id={element.id}
            data-element-id={element.id}
            style={elementStyle}
            className="presentation-element shape-element"
          />
        )

      default:
        return null
    }
  }

  return (
    <div
      ref={slideRef}
      className={`animated-slide ${className} ${isActive ? 'active' : ''} ${isAnimating ? 'animating' : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: background?.color || '#ffffff',
        overflow: 'hidden'
      }}
    >
      {/* Reference image overlay (for debugging/alignment) */}
      {showReferenceImage && background?.referenceImage && (
        <div 
          className="reference-image-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${background.referenceImage})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            opacity: 0.3,
            pointerEvents: 'none',
            zIndex: -1
          }}
        />
      )}

      {/* Render elements */}
      {elements.map(renderElement)}
    </div>
  )
}

export default AnimatedSlide
