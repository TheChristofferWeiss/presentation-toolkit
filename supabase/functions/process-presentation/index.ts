/**
 * Supabase Edge Function: Process Presentation
 * 
 * Main handler for PPTX processing pipeline.
 * Receives uploaded PPTX file and orchestrates the processing pipeline.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import JSZip from 'https://esm.sh/jszip@3.10.1'
import { generateSlideImages } from './pptx-to-png.ts'
import { extractElements } from './element-extractor.ts'
import { extractFonts } from './font-extractor.ts'
import { validatePPTX } from './validation.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessingRequest {
  file: File
  presentationId: string
  userId: string
}

interface ProcessingResult {
  success: boolean
  presentationId: string
  slides: any[]
  assets: any[]
  fonts: any[]
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const presentationId = formData.get('presentationId') as string
    const userId = formData.get('userId') as string

    if (!file || !presentationId || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: file, presentationId, userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Determine file type and validate
    const fileExtension = file.name.toLowerCase().split('.').pop()
    const isPDF = fileExtension === 'pdf'
    const isPPTX = fileExtension === 'pptx'
    
    if (!isPDF && !isPPTX) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type. Only PDF and PPTX files are supported.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    if (isPPTX && !validatePPTX(file)) {
      return new Response(
        JSON.stringify({ error: 'Invalid PPTX file' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Store original file in Supabase Storage
    const filePath = `presentations/${presentationId}/original/${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('presentations')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`)
    }

    let slides: any[] = []
    let fonts: any[] = []
    let slideImages: string[] = []

    if (isPDF) {
      // Handle PDF conversion
      console.log('Processing PDF file:', file.name)
      
      // For PDF, we'll create a simple conversion result
      // In a real implementation, you'd use a PDF processing library
      slides = [{
        slide_number: 1,
        elements: [{
          id: 'pdf-content',
          type: 'text',
          content: `PDF: ${file.name}`,
          position: { x: 100, y: 100 },
          size: { width: 600, height: 400 },
          style: {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#333333'
          }
        }],
        content: `PDF converted from ${file.name}`,
        background: {
          referenceImage: null
        }
      }]
      
      // Mock font extraction for PDF
      fonts = [{
        font_family: 'Arial',
        font_weight: 'normal',
        font_style: 'normal',
        source: 'system'
      }]
      
    } else if (isPPTX) {
      // Handle PPTX processing
      console.log('Processing PPTX file:', file.name)
      
      // Extract PPTX contents
      const arrayBuffer = await file.arrayBuffer()
      const zip = await JSZip.loadAsync(arrayBuffer)

      // Generate slide PNG images
      slideImages = await generateSlideImages(zip, presentationId, supabase)

      // Extract elements from each slide
      const slideFiles = Object.keys(zip.files).filter(name => 
        name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
      )

      for (const slideFile of slideFiles) {
        const slideXml = await zip.file(slideFile)?.async('text')
        if (slideXml) {
          const elements = extractElements(slideXml)
          const slideNumber = parseInt(slideFile.match(/slide(\d+)/)?.[1] || '0')
          
          slides.push({
            slide_number: slideNumber,
            elements,
            content: slideXml,
            background: {
              referenceImage: slideImages[slideNumber - 1] || null
            }
          })
        }
      }

      // Extract fonts
      fonts = await extractFonts(zip, presentationId, supabase)
    }

    // Store presentation data in database
    const { error: dbError } = await supabase
      .from('presentations')
      .insert({
        id: presentationId,
        user_id: userId,
        title: file.name.replace(/\.(pptx|pdf)$/, ''),
        source: 'upload',
        original_format: isPDF ? 'pdf' : 'pptx',
        aspect_ratio: '16:9',
        total_slides: slides.length,
        metadata: { processing_version: '1.0' }
      })

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    // Store slides
    const { error: slidesError } = await supabase
      .from('slides')
      .insert(slides.map(slide => ({
        presentation_id: presentationId,
        ...slide
      })))

    if (slidesError) {
      throw new Error(`Slides error: ${slidesError.message}`)
    }

    // Store fonts
    if (fonts.length > 0) {
      const { error: fontsError } = await supabase
        .from('fonts')
        .insert(fonts.map(font => ({
          presentation_id: presentationId,
          ...font
        })))

      if (fontsError) {
        console.warn(`Fonts error: ${fontsError.message}`)
      }
    }

    const result: ProcessingResult = {
      success: true,
      presentationId,
      slides,
      assets: [], // TODO: Extract and store images/assets
      fonts
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Unknown processing error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
