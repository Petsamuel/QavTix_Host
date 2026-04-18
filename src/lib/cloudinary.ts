export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  bytes: number
}

export async function uploadToCloudinary(
  file: File,
  folder: string = 'qavtix-hosts'
): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Upload failed')
  }

  return response.json()
}

export function getCloudinaryUrl(publicId: string, options?: {
  width?: number
  height?: number
  quality?: number | 'auto'
  format?: 'auto' | 'jpg' | 'png' | 'webp'
  crop?: 'fill' | 'crop' | 'scale' | 'fit'
}): string {
  let transformation = ''

  if (options) {
    const params = []
    if (options.width) params.push(`w_${options.width}`)
    if (options.height) params.push(`h_${options.height}`)
    if (options.quality) params.push(`q_${options.quality}`)
    if (options.format) params.push(`f_${options.format}`)
    if (options.crop) params.push(`c_${options.crop}`)

    if (params.length > 0) {
      transformation = params.join(',') + '/'
    }
  }

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}${publicId}`
}
