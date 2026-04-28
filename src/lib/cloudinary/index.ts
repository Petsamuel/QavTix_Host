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
	formData.append("file", file)
	formData.append("folder", folder)
	formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)
	formData.append("resource_type", "auto")

	const res = await fetch(
		`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
		{ method: "POST", body: formData }
	)

	if (!res.ok) {
		const err = await res.json()
		throw new Error(err.error?.message ?? "Upload failed")
	}

	const data = await res.json()

	return {
		public_id: data.public_id,
		secure_url: data.secure_url,
		width: data.width,
		height: data.height,
		format: data.format,
		bytes: data.bytes,
	}
}

export function getCloudinaryUrl(publicId: string, options?: {
	width?: number
	height?: number
	quality?: number | 'auto'
	format?: 'auto' | 'jpg' | 'png' | 'webp'
	crop?: 'fill' | 'crop' | 'scale' | 'fit'
}): string {
	const params: string[] = []
	if (options?.width) params.push(`w_${options.width}`)
	if (options?.height) params.push(`h_${options.height}`)
	if (options?.quality) params.push(`q_${options.quality}`)
	if (options?.format) params.push(`f_${options.format}`)
	if (options?.crop) params.push(`c_${options.crop}`)

	const transformation = params.length > 0 ? params.join(",") + "/" : ""
	return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}${publicId}`
}