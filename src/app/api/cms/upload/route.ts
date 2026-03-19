import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

// Normalize MIME type — browsers sometimes send SVG as text/xml or application/xml
function normalizeMimeType(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'svg') return 'image/svg+xml'
  return file.type
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Không có file nào được chọn' }, { status: 400 })
    }

    const results: { id: string; filename: string; url: string; mime_type: string; size: number }[] = []
    const errors: string[] = []

    // Create upload directory: /public/uploads/YYYY-MM/
    const now = new Date()
    const subDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir)
    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      // Normalize MIME type (SVG fix)
      const mimeType = normalizeMimeType(file)
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'

      // Validate type by MIME or extension
      if (!ALLOWED_TYPES.includes(mimeType) && !ALLOWED_EXTENSIONS.includes(ext)) {
        errors.push(`${file.name}: Định dạng không hỗ trợ (${file.type})`)
        continue
      }
      // Validate size
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: Vượt quá 5MB`)
        continue
      }

      // Generate unique filename
      const baseName = file.name
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9_\-\u00C0-\u024F\u1E00-\u1EFF]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 60)
      const uniqueName = `${baseName}-${Date.now()}.${ext}`
      const filePath = path.join(uploadDir, uniqueName)
      const publicUrl = `/uploads/${subDir}/${uniqueName}`

      // Write file to disk
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)

      // Save metadata to Supabase
      const { data, error } = await supabaseAdmin
        .from('media')
        .insert({
          filename: file.name,
          url: publicUrl,
          alt_text: baseName.replace(/-/g, ' '),
          mime_type: mimeType, // use normalized mime type
          size: file.size,
        })
        .select()
        .single()

      if (error) {
        errors.push(`${file.name}: DB error — ${error.message}`)
      } else {
        results.push(data)
      }
    }

    return NextResponse.json({
      data: results,
      errors: errors.length > 0 ? errors : undefined,
      uploaded: results.length,
      total: files.length,
    }, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `Upload failed: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
