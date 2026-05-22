"use server"

import { UPDATE_PROFILE_ENDPOINT, GET_PROFILE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

export interface UpdateHostProfilePayload {
    full_name?: string
    phone_number?: string
    country?: string
    state?: string
    city?: string
    postal_code?: string
    // Business info
    business_name?: string
    business_type?: string
    registration_number?: string
    tax_id?: string
    nin?: string
    description?: string
    relevant_links?: { url: string }[]
    categories?: number[]
    // Images
    profile_picture?: string | null
    profile_banner?: string | null
}

export interface UpdateHostProfileResult {
    success: boolean
    data?: AuthUser
    message?: string
}

export async function updateHostProfile(
    payload: UpdateHostProfilePayload,
): Promise<UpdateHostProfileResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.patch(UPDATE_PROFILE_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PROFILE, 'max')

        // Re-fetch the fresh profile from the API so we return the latest data
        const profileRes = await axiosInstance.get(GET_PROFILE_ENDPOINT)
        const profileData = profileRes.data?.host
            ? {
                ...profileRes.data.host,
                subscription: profileRes.data.subscription,
                verified_badge: profileRes.data.verified_badge,
                payout_available: profileRes.data.payout_available,
            } as AuthUser
            : (data?.data ?? data)

        return { success: true, data: profileData }
    } catch (error: any) {
        return {
            success: false,
            message: handleApiError(error?.response?.data) ?? "Failed to update profile.",
        }
    }
}
