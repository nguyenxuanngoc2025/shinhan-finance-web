import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/avif', 'image/bmp', 'image/tiff']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif', 'bmp', 'tiff', 'tif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const BUCKET_NAME = 'shinhan-media'

// Normalize MIME type — browsers sometimes send SVG as text/xml or application/xml
function normalizeMimeType(file: File): string {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (ext === 'svg') return 'image/svg+xml'
  if (ext === 'avif') return 'image/avif'
  if (ext === 'bmp') return 'image/bmp'
  if (ext === 'tiff' || ext === 'tif') return 'image/tiff'
  // Fallback: if file.type is empty string, guess from extension
  if (!file.type && ['jpg', 'jpeg'].includes(ext)) return 'image/jpeg'
  if (!file.type && ext === 'png') return 'image/png'
  if (!file.type && ext === 'gif') return 'image/gif'
  if (!file.type && ext === 'webp') return 'image/webp'
  return file.type
}

export async function POST(request: Request) {
  try {
    const t0 = Date.now()
    const formData = await request.formData()
    const tFormData = Date.now()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Không có file nào được chọn' }, { status: 400 })
    }

    const results: { id: string; filename: string; url: string; mime_type: string; size: number }[] = []
    const errors: string[] = []

    // Directory mimicking: /YYYY-MM/
    const now = new Date()
    const subDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    let tWrite = 0
    let tDB = 0

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
      const storagePath = `${subDir}/${uniqueName}`

      // Upload file to Supabase Storage
      const wt0 = Date.now()
      const { error: uploadError } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(storagePath, file, {
          contentType: mimeType,
          cacheControl: '31536000',
          upsert: false
        })
      tWrite += (Date.now() - wt0)

      if (uploadError) {
        errors.push(`${file.name}: Lỗi upload tới Cloud - ${uploadError.message}`)
        continue
      }

      // Get public URL
      const { data: publicUrlData } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath)
      const publicUrl = publicUrlData.publicUrl

      // Save metadata to Supabase DB 'media' table
      const db0 = Date.now()
      const { data, error } = await supabaseAdmin
        .from('media')
        .insert({
          filename: file.name,
          url: publicUrl,
          alt_text: baseName.replace(/-/g, ' '),
          mime_type: mimeType,
          size: file.size,
        })
        .select()
        .single()
      tDB += (Date.now() - db0)

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
      timing: {
        formData: tFormData - t0,
        write: tWrite,
        db: tDB,
        total: Date.now() - t0
      }
    }, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: `Upload failed: ${(err as Error).message}` },
      { status: 500 }
    )
  }
}
