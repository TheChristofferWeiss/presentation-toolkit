/**
 * Element Extractor
 * 
 * Extracts structured elements (text, images, shapes) from PPTX slide XML.
 * Handles positioning, styling, and content extraction.
 */

import { parse } from 'https://esm.sh/fast-xml-parser@5.3.0'

export interface PPTXElement {
  id: string
  type: 'text' | 'image' | 'shape'
  content?: string
  source?: string // for images
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

/**
 * Extract structured elements from slide XML
 */
export function extractElements(
  slideXml: string,
  slideDimensions?: { width: number; height: number }
): PPTXElement[] {
  const elements: PPTXElement[] = []
  
  try {
    const parser = new parse.XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: true
    })
    
    const parsed = parser.parse(slideXml)
    const slide = parsed['p:sld']?.['p:cSld']?.['p:spTree']
    
    if (!slide) {
      return elements
    }

    // Extract shapes (which can contain text, images, or be pure shapes)
    const shapes = Array.isArray(slide['p:sp']) ? slide['p:sp'] : [slide['p:sp']].filter(Boolean)
    
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i]
      const element = extractElementFromShape(shape, i)
      if (element) {
        elements.push(element)
      }
    }

    return elements

  } catch (error) {
    console.error('Error extracting elements:', error)
    return []
  }
}

/**
 * Extract a single element from a shape
 */
function extractElementFromShape(shape: any, index: number): PPTXElement | null {
  try {
    const spPr = shape['p:spPr']
    const txBody = shape['p:txBody']
    
    if (!spPr) {
      return null
    }

    // Extract positioning and size
    const xfrm = spPr['a:xfrm']
    const pos = extractPosition(xfrm)
    const size = extractSize(xfrm)

    // Determine element type and content
    if (txBody) {
      // Text element
      const content = extractTextContent(txBody)
      const style = extractTextStyle(txBody)
      
      return {
        id: `text-${index}`,
        type: 'text',
        content,
        position: pos,
        size,
        style
      }
    } else if (hasImage(shape)) {
      // Image element
      const imageRef = extractImageReference(shape)
      
      return {
        id: `image-${index}`,
        type: 'image',
        source: imageRef,
        position: pos,
        size
      }
    } else {
      // Shape element
      return {
        id: `shape-${index}`,
        type: 'shape',
        position: pos,
        size,
        style: extractShapeStyle(spPr)
      }
    }

  } catch (error) {
    console.error('Error extracting element from shape:', error)
    return null
  }
}

/**
 * Extract position from transform
 */
function extractPosition(xfrm: any): { x: number; y: number } {
  if (!xfrm?.['a:off']) {
    return { x: 0, y: 0 }
  }

  // Convert EMUs to pixels (1 EMU = 1/12700 inches, 96 DPI)
  const xEmu = xfrm['a:off']['@_x'] || 0
  const yEmu = xfrm['a:off']['@_y'] || 0
  
  return {
    x: Math.round(xEmu / 12700 * 96),
    y: Math.round(yEmu / 12700 * 96)
  }
}

/**
 * Extract size from transform
 */
function extractSize(xfrm: any): { width: number; height: number } {
  if (!xfrm?.['a:ext']) {
    return { width: 0, height: 0 }
  }

  // Convert EMUs to pixels
  const widthEmu = xfrm['a:ext']['@_cx'] || 0
  const heightEmu = xfrm['a:ext']['@_cy'] || 0
  
  return {
    width: Math.round(widthEmu / 12700 * 96),
    height: Math.round(heightEmu / 12700 * 96)
  }
}

/**
 * Extract text content from text body
 */
function extractTextContent(txBody: any): string {
  try {
    const paragraphs = Array.isArray(txBody['a:p']) ? txBody['a:p'] : [txBody['a:p']].filter(Boolean)
    const texts: string[] = []
    
    for (const paragraph of paragraphs) {
      const runs = Array.isArray(paragraph['a:r']) ? paragraph['a:r'] : [paragraph['a:r']].filter(Boolean)
      
      for (const run of runs) {
        const text = run['a:t']
        if (typeof text === 'string') {
          texts.push(text)
        } else if (text?.['#text']) {
          texts.push(text['#text'])
        }
      }
    }
    
    return texts.join('')
  } catch (error) {
    console.error('Error extracting text content:', error)
    return ''
  }
}

/**
 * Extract text styling
 */
function extractTextStyle(txBody: any): PPTXElement['style'] {
  const style: PPTXElement['style'] = {}
  
  try {
    const paragraphs = Array.isArray(txBody['a:p']) ? txBody['a:p'] : [txBody['a:p']].filter(Boolean)
    
    if (paragraphs.length > 0) {
      const firstParagraph = paragraphs[0]
      const runs = Array.isArray(firstParagraph['a:r']) ? firstParagraph['a:r'] : [firstParagraph['a:r']].filter(Boolean)
      
      if (runs.length > 0) {
        const firstRun = runs[0]
        const runProps = firstRun['a:rPr']
        
        if (runProps) {
          // Font family
          if (runProps['a:latin']?.['@_typeface']) {
            style.fontFamily = runProps['a:latin']['@_typeface']
          }
          
          // Font size (in half-points, convert to points)
          if (runProps['@_sz']) {
            style.fontSize = runProps['@_sz'] / 100
          }
          
          // Font weight
          if (runProps['@_b']) {
            style.fontWeight = 'bold'
          }
          
          // Font style
          if (runProps['@_i']) {
            style.fontStyle = 'italic'
          }
          
          // Color
          if (runProps['a:solidFill']?.['a:srgbClr']?.['@_val']) {
            const hexColor = runProps['a:solidFill']['a:srgbClr']['@_val']
            style.color = `#${hexColor}`
          }
        }
      }
    }
    
    return style
    
  } catch (error) {
    console.error('Error extracting text style:', error)
    return {}
  }
}

/**
 * Check if shape contains an image
 */
function hasImage(shape: any): boolean {
  return !!(shape['p:nvSpPr']?.['p:cNvPr']?.['@_name']?.toLowerCase().includes('picture') ||
           shape['p:pic'])
}

/**
 * Extract image reference
 */
function extractImageReference(shape: any): string | undefined {
  try {
    // Look for embedded image relationship
    const pic = shape['p:pic']
    if (pic?.['p:blipFill']?.['a:blip']) {
      const embedId = pic['p:blipFill']['a:blip']['@_embed']
      if (embedId) {
        // This would need to be resolved against the relationships file
        return `image_${embedId}`
      }
    }
    
    return undefined
  } catch (error) {
    console.error('Error extracting image reference:', error)
    return undefined
  }
}

/**
 * Extract shape styling
 */
function extractShapeStyle(spPr: any): PPTXElement['style'] {
  const style: PPTXElement['style'] = {}
  
  try {
    // Background color
    if (spPr['a:solidFill']?.['a:srgbClr']?.['@_val']) {
      const hexColor = spPr['a:solidFill']['a:srgbClr']['@_val']
      style.backgroundColor = `#${hexColor}`
    }
    
    // Opacity
    if (spPr['a:effectLst']?.['a:alpha']?.['@_val']) {
      style.opacity = spPr['a:effectLst']['a:alpha']['@_val'] / 100000 // Convert from percentage
    }
    
    return style
    
  } catch (error) {
    console.error('Error extracting shape style:', error)
    return {}
  }
}
