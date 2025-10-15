"use client"

import React, { useState } from 'react'

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setSelectedFile(file ?? null)
    setDownloadUrl(null)
    setError(null)
  }

  const onUpload = async () => {
    if (!selectedFile) return
    setIsUploading(true)
    setError(null)
    setDownloadUrl(null)
    try {
      const form = new FormData()
      form.append('file', selectedFile)
      const res = await fetch('/api/pdf-to-pptx', { method: 'POST', body: form })
      if (!res.ok) throw new Error(await res.text())
      // Blob download
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setDownloadUrl(url)
    } catch (e: any) {
      setError(e?.message ?? 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#667eea,#764ba2)' }}>
      <div style={{ width: 760, maxWidth: '92vw', background: 'rgba(255,255,255,0.1)', padding: 24, borderRadius: 16, color: 'white', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ marginTop: 0 }}>PDF → PPTX (Next.js)</h1>
        <input type="file" accept="application/pdf" onChange={onFileChange} />
        <div style={{ marginTop: 12 }}>
          <button disabled={!selectedFile || isUploading} onClick={onUpload} style={{ padding: '8px 14px', borderRadius: 8, border: 0, cursor: 'pointer' }}>
            {isUploading ? 'Converting…' : 'Convert'}
          </button>
        </div>
        {downloadUrl && (
          <p style={{ marginTop: 16 }}>
            <a href={downloadUrl} download={(selectedFile?.name ?? 'file').replace(/\.pdf$/i, '.pptx')} style={{ color: '#b3ffb3' }}>
              Download PPTX
            </a>
          </p>
        )}
        {error && <p style={{ marginTop: 16, color: '#ffb3b3' }}>{error}</p>}
      </div>
    </main>
  )
}


