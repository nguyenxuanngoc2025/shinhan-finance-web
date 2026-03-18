import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'Không có file nào được chọn' }, { status: 400 })
    }

    const results: any[] = []
    const errors: string[] = []

    // Create upload directory: /public/uploads/YYYY-MM/
    const now = new Date()
    const subDir = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir)
    await mkdir(uploadDir, { recursive: true })

    for (const file of files) {
      // Validate type
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Định dạng không hỗ trợ (${file.type})`)
        continue
      }
      // Validate size
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: Vượt quá 5MB`)
        continue
      }

      // Generate unique filename
      const ext = file.name.split('.').pop() || 'jpg'
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
          mime_type: file.type,
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
  } catch (err: any) {
    return NextResponse.json(
      { error: `Upload failed: ${err.message}` },
      { status: 500 }
    )
  }
}
