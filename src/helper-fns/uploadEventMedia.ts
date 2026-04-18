import { uploadToCloudinary } from "@/lib/cloudinary";

export const uploadEventMedia = async (detailsMedia: any) => {
    const mediaPayload: any[] = [];
    if (!detailsMedia) return mediaPayload;

    let featuredImageUrl = "";
    let featuredVideoUrl = "";

    if (detailsMedia.featuredImage instanceof File) {
        const res = await uploadToCloudinary(detailsMedia.featuredImage, 'qavtix-events')
        featuredImageUrl = res.secure_url;
    } else if (typeof detailsMedia.featuredImage === 'string') {
        featuredImageUrl = detailsMedia.featuredImage;
    }

    if (detailsMedia.eventVideo instanceof File) {
        const res = await uploadToCloudinary(detailsMedia.eventVideo, 'qavtix-events')
        featuredVideoUrl = res.secure_url;
    } else if (typeof detailsMedia.eventVideo === 'string') {
        featuredVideoUrl = detailsMedia.eventVideo;
    }

    if (featuredImageUrl) {
        mediaPayload.push({
            image_url: featuredImageUrl,
            video_url: featuredVideoUrl,
            is_featured: true,
        })
    }

    if (detailsMedia.additionalImages && detailsMedia.additionalImages.length > 0) {
        const uploadPromises = detailsMedia.additionalImages.map(async (img: any) => {
            if (img instanceof File) {
                const res = await uploadToCloudinary(img, 'qavtix-events')
                return {
                    image_url: res.secure_url,
                    video_url: "",
                    is_featured: false,
                }
            } else if (typeof img === 'string') {
                return {
                    image_url: img,
                    video_url: "",
                    is_featured: false,
                }
            }
            return null;
        })

        const additionalUploaded = await Promise.all(uploadPromises)
        mediaPayload.push(...additionalUploaded.filter(Boolean))
    }

    return mediaPayload;
}