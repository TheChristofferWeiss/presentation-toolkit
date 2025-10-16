/**
 * Validation Utilities
 * 
 * Input validation and sanitization for PPTX processing.
 * Ensures files are valid PPTX format and meet processing requirements.
 */

/**
 * Validate PPTX file
 */
export function validatePPTX(file: File): boolean {
  // Check file extension
  if (!file.name.toLowerCase().endsWith('.pptx')) {
    return false
  }

  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    return false
  }

  // Check MIME type
  const validMimeTypes = [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip' // PPTX files are actually ZIP files
  ]
  
  if (!validMimeTypes.includes(file.type) && file.type !== '') {
    return false
  }

  return true
}

/**
 * Validate presentation ID format
 */
export function validatePresentationId(id: string): boolean {
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

/**
 * Validate user ID format
 */
export function validateUserId(id: string): boolean {
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove or replace dangerous characters
  return filename
    .replace(/[<>:"/\\|?*]/g, '_') // Replace dangerous characters
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .substring(0, 255) // Limit length
}

/**
 * Validate slide dimensions
 */
export function validateSlideDimensions(dimensions: { width: number; height: number }): boolean {
  // Check for reasonable slide dimensions
  const minDimension = 100 // 100px minimum
  const maxDimension = 10000 // 10,000px maximum
  
  return (
    dimensions.width >= minDimension &&
    dimensions.width <= maxDimension &&
    dimensions.height >= minDimension &&
    dimensions.height <= maxDimension
  )
}

/**
 * Validate element data
 */
export function validateElement(element: any): boolean {
  // Basic element structure validation
  return (
    element &&
    typeof element.id === 'string' &&
    ['text', 'image', 'shape'].includes(element.type) &&
    element.position &&
    typeof element.position.x === 'number' &&
    typeof element.position.y === 'number' &&
    element.size &&
    typeof element.size.width === 'number' &&
    typeof element.size.height === 'number'
  )
}

/**
 * Validate animation data
 */
export function validateAnimation(animation: any): boolean {
  return (
    animation &&
    typeof animation.targetId === 'string' &&
    typeof animation.effect === 'string' &&
    typeof animation.trigger === 'string' &&
    typeof animation.order === 'number' &&
    animation.order >= 0
  )
}

/**
 * Validate transition data
 */
export function validateTransition(transition: any): boolean {
  const validTypes = ['fade', 'push', 'wipe', 'zoom', 'morph']
  const validDirections = ['left', 'right', 'up', 'down']
  
  return (
    transition &&
    validTypes.includes(transition.type) &&
    (!transition.direction || validDirections.includes(transition.direction)) &&
    (!transition.duration || (typeof transition.duration === 'number' && transition.duration > 0))
  )
}

/**
 * Validate font data
 */
export function validateFont(font: any): boolean {
  return (
    font &&
    typeof font.fontFamily === 'string' &&
    typeof font.fontWeight === 'string' &&
    typeof font.fontStyle === 'string' &&
    typeof font.ttfUrl === 'string'
  )
}

/**
 * Check if file is too large for processing
 */
export function isFileTooLarge(file: File): boolean {
  const maxSize = 500 * 1024 * 1024 // 500MB
  return file.size > maxSize
}

/**
 * Check if presentation has too many slides
 */
export function hasTooManySlides(slideCount: number): boolean {
  const maxSlides = 1000 // Reasonable limit for processing
  return slideCount > maxSlides
}

/**
 * Validate processing request
 */
export function validateProcessingRequest(request: {
  file?: File
  presentationId?: string
  userId?: string
}): { valid: boolean; error?: string } {
  if (!request.file) {
    return { valid: false, error: 'File is required' }
  }

  if (!validateFile(request.file)) {
    return { valid: false, error: 'Invalid file type. Only PDF and PPTX files are supported.' }
  }

  if (isFileTooLarge(request.file)) {
    return { valid: false, error: 'File is too large (max 500MB)' }
  }

  if (!request.presentationId || !validatePresentationId(request.presentationId)) {
    return { valid: false, error: 'Invalid presentation ID' }
  }

  if (!request.userId || !validateUserId(request.userId)) {
    return { valid: false, error: 'Invalid user ID' }
  }

  return { valid: true }
}
