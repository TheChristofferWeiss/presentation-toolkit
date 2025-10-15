/**
 * Font Extractor
 * 
 * Extracts embedded TTF fonts from PPTX files and uploads them to Supabase Storage.
 * Generates CSS @font-face rules for web rendering.
 */

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import JSZip from 'https://esm.sh/jszip@3.10.1'

export interface FontData {
  id: string
  fontFamily: string
  fontWeight: string
  fontStyle: string
  ttfUrl: string
  woffUrl?: string
  woff2Url?: string
  embedded: boolean
  cssRules: string
}

/**
 * Extract embedded fonts from PPTX
 */
export async function extractFonts(
  zip: JSZip,
  presentationId: string,
  supabase: SupabaseClient
): Promise<FontData[]> {
  const fonts: FontData[] = []
  
  try {
    // Look for fonts in ppt/fonts/ directory
    const fontFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('ppt/fonts/') && name.endsWith('.ttf')
    )

    for (const fontFile of fontFiles) {
      const fontBuffer = await zip.file(fontFile)?.async('arraybuffer')
      if (fontBuffer) {
        const fontData = await processFontFile(
          fontFile,
          fontBuffer,
          presentationId,
          supabase
        )
        
        if (fontData) {
          fonts.push(fontData)
        }
      }
    }

    // Also check for fonts in the fonts/ directory (alternative location)
    const altFontFiles = Object.keys(zip.files).filter(name => 
      name.startsWith('fonts/') && (name.endsWith('.ttf') || name.endsWith('.otf'))
    )

    for (const fontFile of altFontFiles) {
      const fontBuffer = await zip.file(fontFile)?.async('arraybuffer')
      if (fontBuffer) {
        const fontData = await processFontFile(
          fontFile,
          fontBuffer,
          presentationId,
          supabase
        )
        
        if (fontData) {
          fonts.push(fontData)
        }
      }
    }

    return fonts

  } catch (error) {
    console.error('Error extracting fonts:', error)
    return []
  }
}

/**
 * Process individual font file
 */
async function processFontFile(
  fileName: string,
  fontBuffer: ArrayBuffer,
  presentationId: string,
  supabase: SupabaseClient
): Promise<FontData | null> {
  try {
    // Extract font metadata from filename or buffer
    const fontName = extractFontName(fileName)
    const fontWeight = extractFontWeight(fileName)
    const fontStyle = extractFontStyle(fileName)
    
    // Upload TTF to Supabase Storage
    const ttfPath = `presentations/${presentationId}/fonts/${fileName.split('/').pop()}`
    const { error: ttfError } = await supabase.storage
      .from('presentations')
      .upload(ttfPath, fontBuffer, {
        contentType: 'font/ttf',
        cacheControl: '3600'
      })

    if (ttfError) {
      console.error('Failed to upload TTF font:', ttfError)
      return null
    }

    // Get public URL for TTF
    const { data: ttfUrlData } = supabase.storage
      .from('presentations')
      .getPublicUrl(ttfPath)

    // Generate CSS @font-face rules
    const cssRules = generateFontFaceCSS(
      fontName,
      fontWeight,
      fontStyle,
      ttfUrlData.publicUrl
    )

    return {
      id: `font-${presentationId}-${fontName.replace(/\s+/g, '-').toLowerCase()}`,
      fontFamily: fontName,
      fontWeight,
      fontStyle,
      ttfUrl: ttfUrlData.publicUrl,
      embedded: true,
      cssRules
    }

  } catch (error) {
    console.error('Error processing font file:', error)
    return null
  }
}

/**
 * Extract font name from filename
 */
function extractFontName(fileName: string): string {
  const baseName = fileName.split('/').pop()?.replace(/\.(ttf|otf)$/i, '') || 'Unknown Font'
  
  // Clean up common font naming patterns
  return baseName
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Extract font weight from filename
 */
function extractFontWeight(fileName: string): string {
  const name = fileName.toLowerCase()
  
  if (name.includes('bold') || name.includes('black') || name.includes('heavy')) {
    return 'bold'
  } else if (name.includes('light') || name.includes('thin')) {
    return '300'
  } else if (name.includes('medium')) {
    return '500'
  } else if (name.includes('semibold')) {
    return '600'
  } else if (name.includes('extrabold') || name.includes('ultrabold')) {
    return '800'
  } else if (name.includes('extralight') || name.includes('ultralight')) {
    return '200'
  }
  
  return 'normal'
}

/**
 * Extract font style from filename
 */
function extractFontStyle(fileName: string): string {
  const name = fileName.toLowerCase()
  
  if (name.includes('italic') || name.includes('oblique')) {
    return 'italic'
  }
  
  return 'normal'
}

/**
 * Generate CSS @font-face rules
 */
function generateFontFaceCSS(
  fontFamily: string,
  fontWeight: string,
  fontStyle: string,
  ttfUrl: string
): string {
  return `
@font-face {
  font-family: '${fontFamily}';
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  src: url('${ttfUrl}') format('truetype');
  font-display: swap;
}`
}

/**
 * Convert TTF to WOFF/WOFF2 (would require additional libraries)
 * This is a placeholder for future implementation
 */
async function convertToWebFonts(
  ttfBuffer: ArrayBuffer,
  presentationId: string,
  supabase: SupabaseClient
): Promise<{ woffUrl?: string; woff2Url?: string }> {
  // In a production implementation, you would:
  // 1. Use a library like ttf2woff2 to convert TTF to WOFF2
  // 2. Upload the converted fonts to Supabase Storage
  // 3. Return the public URLs
  
  return {
    // woffUrl: '...',
    // woff2Url: '...'
  }
}
