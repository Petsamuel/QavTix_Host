import { uploadToCloudinary } from "@/lib/cloudinary";

export interface UploadedMediaItem {
    secure_url: string
    public_id?: string
    resource_type: 'image' | 'video'
    is_featured: boolean
}

export const uploadEventMedia = async (detailsMedia: any): Promise<UploadedMediaItem[]> => {
    const mediaPayload: UploadedMediaItem[] = []
    if (!detailsMedia) return mediaPayload

    if (detailsMedia.featuredImage instanceof File) {
        const res = await uploadToCloudinary(detailsMedia.featuredImage, 'qavtix-events')
        mediaPayload.push({
            secure_url: res.secure_url,
            public_id: res.public_id,
            resource_type: 'image',
            is_featured: true,
        })
    } else if (typeof detailsMedia.featuredImage === 'string') {
        mediaPayload.push({
            secure_url: detailsMedia.featuredImage,
            resource_type: 'image',
            is_featured: true,
        })
    }

    // Additional images
    if (detailsMedia.additionalImages?.length > 0) {
        const uploaded = await Promise.all(
            detailsMedia.additionalImages.map(async (img: any) => {
                if (img instanceof File) {
                    const res = await uploadToCloudinary(img, 'qavtix-events')
                    return {
                        secure_url: res.secure_url,
                        public_id: res.public_id,
                        resource_type: 'image' as const,
                        is_featured: false,
                    }
                } else if (typeof img === 'string') {
                    return {
                        secure_url: img,
                        resource_type: 'image' as const,
                        is_featured: false,
                    }
                }
                return null
            })
        )
        mediaPayload.push(...uploaded.filter(Boolean) as UploadedMediaItem[])
    }

    // Video
    if (detailsMedia.eventVideo instanceof File) {
        const res = await uploadToCloudinary(detailsMedia.eventVideo, 'qavtix-events')
        mediaPayload.push({
            secure_url: res.secure_url,
            public_id: res.public_id,
            resource_type: 'video',
            is_featured: false,
        })
    } else if (typeof detailsMedia.eventVideo === 'string') {
        mediaPayload.push({
            secure_url: detailsMedia.eventVideo,
            resource_type: 'video',
            is_featured: false,
        })
    }

    console.log("[uploadEventMedia] uploaded:", mediaPayload.map(m => ({
        url: m.secure_url,
        type: m.resource_type,
        featured: m.is_featured
    })))

    return mediaPayload
}