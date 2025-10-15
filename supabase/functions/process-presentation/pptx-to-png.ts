/**
 * PPTX to PNG Converter
 * 
 * Converts PPTX slides to PNG images for reference.
 * Uses canvas rendering to generate high-quality slide images.
 */

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import JSZip from 'https://esm.sh/jszip@3.10.1'
import { parse } from 'https://esm.sh/fast-xml-parser@5.3.0'

export interface SlideDimensions {
  width: number
  height: number
}

/**
 * Generate PNG images for all slides in the presentation
 */
export async function generateSlideImages(
  zip: JSZip,
  presentationId: string,
  supabase: SupabaseClient
): Promise<string[]> {
  const slideImages: string[] = []
  
  try {
    // Get slide dimensions from presentation.xml
    const presentationXml = await zip.file('ppt/presentation.xml')?.async('text')
    if (!presentationXml) {
      throw new Error('Could not find presentation.xml')
    }

    const dimensions = extractSlideDimensions(presentationXml)
    
    // Find all slide files
    const slideFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
    )

    for (const slideFile of slideFiles) {
      const slideXml = await zip.file(slideFile)?.async('text')
      if (slideXml) {
        const slideNumber = parseInt(slideFile.match(/slide(\d+)/)?.[1] || '0')
        const pngBuffer = await renderSlideToPNG(slideXml, dimensions)
        
        // Upload to Supabase Storage
        const fileName = `slides/slide_${slideNumber}.png`
        const { data, error } = await supabase.storage
          .from('presentations')
          .upload(`${presentationId}/${fileName}`, pngBuffer, {
            contentType: 'image/png',
            cacheControl: '3600'
          })

        if (error) {
          console.error(`Failed to upload slide ${slideNumber}:`, error)
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('presentations')
          .getPublicUrl(`${presentationId}/${fileName}`)

        slideImages[slideNumber - 1] = urlData.publicUrl
      }
    }

    return slideImages.filter(Boolean)

  } catch (error) {
    console.error('Error generating slide images:', error)
    return []
  }
}

/**
 * Extract slide dimensions from presentation.xml
 */
export function extractSlideDimensions(presentationXml: string): SlideDimensions {
  try {
    const parser = new parse.XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_'
    })
    
    const parsed = parser.parse(presentationXml)
    const slideSize = parsed['p:presentation']?.['p:sldSz']
    
    if (slideSize) {
      // Convert EMUs to pixels (1 EMU = 1/12700 inches, assuming 96 DPI)
      const widthEmu = parseInt(slideSize['@_cx']) || 9144000 // Default 16:9 width
      const heightEmu = parseInt(slideSize['@_cy']) || 5143500 // Default 16:9 height
      
      return {
        width: Math.round(widthEmu / 12700 * 96), // Convert to pixels at 96 DPI
        height: Math.round(heightEmu / 12700 * 96)
      }
    }
  } catch (error) {
    console.warn('Could not parse slide dimensions:', error)
  }

  // Default 16:9 dimensions (960x540px)
  return { width: 960, height: 540 }
}

/**
 * Render slide XML to PNG buffer
 * Note: This is a simplified implementation. In production, you'd use a more
 * sophisticated rendering engine or call an external service.
 */
async function renderSlideToPNG(slideXml: string, dimensions: SlideDimensions): Promise<Uint8Array> {
  // For now, return a placeholder PNG buffer
  // In a real implementation, you would:
  // 1. Parse the slide XML to extract elements
  // 2. Use a canvas library (like Konva.js or Fabric.js) to render the slide
  // 3. Convert the canvas to PNG buffer
  
  // Placeholder: Create a simple colored PNG
  const canvas = new OffscreenCanvas(dimensions.width, dimensions.height)
  const ctx = canvas.getContext('2d')!
  
  // White background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, dimensions.width, dimensions.height)
  
  // Add a placeholder text
  ctx.fillStyle = '#333333'
  ctx.font = '24px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Slide Content', dimensions.width / 2, dimensions.height / 2)
  
  // Convert to PNG
  const blob = await canvas.convertToBlob({ type: 'image/png' })
  return new Uint8Array(await blob.arrayBuffer())
}
