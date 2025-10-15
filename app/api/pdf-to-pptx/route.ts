import { NextRequest } from 'next/server'
import PptxGenJS from 'pptxgenjs'
import * as pdfjsLib from 'pdfjs-dist'

// pdfjs worker setup for Node
// @ts-ignore
pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.js')

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return new Response('No file', { status: 400 })

    // Load PDF into pdf.js
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise

    // Create PPTX
    const pptx = new PptxGenJS()
    // 16:9 default
    pptx.layout = 'LAYOUT_16x9'

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2.0 })

      // Render to OffscreenCanvas/Canvas
      const { createCanvas } = await import('canvas')
      const canvas = createCanvas(viewport.width, viewport.height)
      const context = canvas.getContext('2d') as any
      const renderContext = { canvasContext: context, viewport }
      await page.render(renderContext).promise

      const dataUrl: string = canvas.toDataURL('image/png')

      const slide = pptx.addSlide()
      // Fit image to slide width, auto height
      slide.addImage({ data: dataUrl, x: 0, y: 0, w: 10 })
    }

    const fileName = `${(file.name || 'document').replace(/\.pdf$/i, '')}.pptx`

    // Generate into a Node Buffer
    const array = await pptx.write('arraybuffer')
    const buffer = Buffer.from(array)

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (e: any) {
    console.error('API error:', e)
    return new Response(`Error: ${e?.message ?? 'unknown'}`, { status: 500 })
  }
}


