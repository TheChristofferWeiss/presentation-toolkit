/**
 * usePresentationAnimations Hook
 * 
 * React hook for managing presentation animations and transitions.
 * Provides animation control and state management.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { AnimationMapper, SlideTransition } from '../lib/presentation-animations'
import { AnimationData, TransitionData } from '../lib/presentation-animations'

interface UsePresentationAnimationsOptions {
  autoPlay?: boolean
  loop?: boolean
  onSlideComplete?: (slideIndex: number) => void
  onAnimationComplete?: () => void
}

interface UsePresentationAnimationsReturn {
  currentSlide: number
  isPlaying: boolean
  isAnimating: boolean
  animationTimeline: gsap.core.Timeline | null
  playSlide: (slideIndex: number) => Promise<void>
  nextSlide: () => Promise<void>
  previousSlide: () => Promise<void>
  playAnimations: (animations: AnimationData[]) => Promise<void>
  applyTransition: (currentSlide: HTMLElement | null, nextSlide: HTMLElement | null, transition: TransitionData) => Promise<void>
  pauseAnimations: () => void
  resumeAnimations: () => void
  resetAnimations: () => void
  setCurrentSlide: (index: number) => void
}

export const usePresentationAnimations = (
  totalSlides: number = 1,
  options: UsePresentationAnimationsOptions = {}
): UsePresentationAnimationsReturn => {
  const {
    autoPlay = false,
    loop = false,
    onSlideComplete,
    onAnimationComplete
  } = options

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationTimeline, setAnimationTimeline] = useState<gsap.core.Timeline | null>(null)

  const animationMapper = useRef(AnimationMapper.getInstance())
  const slideRefs = useRef<(HTMLElement | null)[]>([])

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && isPlaying) {
      const interval = setInterval(() => {
        if (!isAnimating) {
          nextSlide()
        }
      }, 5000) // 5 second intervals

      return () => clearInterval(interval)
    }
  }, [autoPlay, isPlaying, isAnimating])

  // Register slide ref
  const registerSlideRef = useCallback((index: number, ref: HTMLElement | null) => {
    slideRefs.current[index] = ref
  }, [])

  // Play specific slide
  const playSlide = useCallback(async (slideIndex: number): Promise<void> => {
    if (slideIndex < 0 || slideIndex >= totalSlides) {
      console.warn(`Slide index ${slideIndex} is out of range`)
      return
    }

    const currentSlideElement = slideRefs.current[currentSlide]
    const nextSlideElement = slideRefs.current[slideIndex]

    if (currentSlideElement && nextSlideElement && currentSlide !== slideIndex) {
      setIsAnimating(true)

      try {
        // Apply transition if slides are different
        if (currentSlide !== slideIndex) {
          // Default transition - could be customized per slide
          const transition: TransitionData = {
            type: 'fade',
            duration: 0.5
          }
          await SlideTransition.applyTransition(currentSlideElement, nextSlideElement, transition)
        }

        setCurrentSlide(slideIndex)
        onSlideComplete?.(slideIndex)
      } catch (error) {
        console.error('Error playing slide:', error)
      } finally {
        setIsAnimating(false)
      }
    } else {
      setCurrentSlide(slideIndex)
    }
  }, [currentSlide, totalSlides, onSlideComplete])

  // Next slide
  const nextSlide = useCallback(async (): Promise<void> => {
    const nextIndex = currentSlide + 1
    
    if (nextIndex >= totalSlides) {
      if (loop) {
        await playSlide(0)
      } else {
        console.log('Reached end of presentation')
      }
    } else {
      await playSlide(nextIndex)
    }
  }, [currentSlide, totalSlides, loop, playSlide])

  // Previous slide
  const previousSlide = useCallback(async (): Promise<void> => {
    const prevIndex = currentSlide - 1
    
    if (prevIndex < 0) {
      if (loop) {
        await playSlide(totalSlides - 1)
      } else {
        console.log('At beginning of presentation')
      }
    } else {
      await playSlide(prevIndex)
    }
  }, [currentSlide, totalSlides, loop, playSlide])

  // Play animations for current slide
  const playAnimations = useCallback(async (animations: AnimationData[]): Promise<void> => {
    if (animations.length === 0) {
      onAnimationComplete?.()
      return
    }

    setIsAnimating(true)

    try {
      const timeline = animationMapper.current.createSlideTimeline(animations)
      setAnimationTimeline(timeline)
      
      await animationMapper.current.playTimeline(timeline)
      onAnimationComplete?.()
    } catch (error) {
      console.error('Error playing animations:', error)
    } finally {
      setIsAnimating(false)
    }
  }, [onAnimationComplete])

  // Apply transition between slides
  const applyTransition = useCallback(async (
    currentSlideElement: HTMLElement | null,
    nextSlideElement: HTMLElement | null,
    transition: TransitionData
  ): Promise<void> => {
    if (!currentSlideElement || !nextSlideElement) return

    setIsAnimating(true)

    try {
      await SlideTransition.applyTransition(currentSlideElement, nextSlideElement, transition)
    } catch (error) {
      console.error('Error applying transition:', error)
    } finally {
      setIsAnimating(false)
    }
  }, [])

  // Pause animations
  const pauseAnimations = useCallback(() => {
    if (animationTimeline) {
      animationTimeline.pause()
    }
    setIsPlaying(false)
  }, [animationTimeline])

  // Resume animations
  const resumeAnimations = useCallback(() => {
    if (animationTimeline) {
      animationTimeline.resume()
    }
    setIsPlaying(true)
  }, [animationTimeline])

  // Reset animations
  const resetAnimations = useCallback(() => {
    if (animationTimeline) {
      animationTimeline.kill()
    }
    setAnimationTimeline(null)
    setIsAnimating(false)
    setIsPlaying(autoPlay)
  }, [animationTimeline, autoPlay])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault()
          if (!isAnimating) {
            nextSlide()
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          if (!isAnimating) {
            previousSlide()
          }
          break
        case 'Escape':
          event.preventDefault()
          pauseAnimations()
          break
        case 'Enter':
          event.preventDefault()
          if (isPlaying) {
            pauseAnimations()
          } else {
            resumeAnimations()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [nextSlide, previousSlide, pauseAnimations, resumeAnimations, isPlaying, isAnimating])

  return {
    currentSlide,
    isPlaying,
    isAnimating,
    animationTimeline,
    playSlide,
    nextSlide,
    previousSlide,
    playAnimations,
    applyTransition,
    pauseAnimations,
    resumeAnimations,
    resetAnimations,
    setCurrentSlide: playSlide,
    registerSlideRef
  }
}

export default usePresentationAnimations
