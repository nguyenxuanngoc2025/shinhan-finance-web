import imageCompression from 'browser-image-compression'

export async function compressImage(file: File): Promise<File> {
  const isImage = file.type.startsWith('image/')
  const isSvgOrGif = file.type === 'image/svg+xml' || file.type === 'image/gif'
  
  if (!isImage || isSvgOrGif) return file
  // Leave small images as is
  if (file.size <= 300 * 1024) return file 

  try {
    const options = {
      maxSizeMB: 0.5, // Target max ~500KB
      maxWidthOrHeight: 1600, // Reasonable max resolution for web content
      useWebWorker: true,
      fileType: file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    }
    const compressedBlob = await imageCompression(file, options)
    
    // Convert Blob back to File
    return new File([compressedBlob], file.name, {
      type: compressedBlob.type,
      lastModified: Date.now(),
    })
  } catch (err) {
    console.warn('Image compression failed, falling back to original:', err)
    return file
  }
}
