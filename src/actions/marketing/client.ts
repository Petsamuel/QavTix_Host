"use server";

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import {
    CREATE_PROMO_CODES_ENDPOINT,
    PROMO_CODES_ENDPOINT,
    AFFILIATE_LINKS_HOST_ENDPOINT,
    EMAIL_CAMPAIGNS_ENDPOINT
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

async function getToken(): Promise<string | undefined> {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function createPromoCode(
    payload: CreatePromoCodePayload
): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.post(CREATE_PROMO_CODES_ENDPOINT, payload)

        revalidateTag(CACHE_TAGS.MARKETING_PROMO, "max")

        return { success: true, message: "Promo code created successfully." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function getPromoCodesClient(params: {
    page?: number
    search?: string
    status?: string
    event?: string
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${PROMO_CODES_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load promo codes." }
    }
}

export async function getAffiliateLinksClient(params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${AFFILIATE_LINKS_HOST_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load affiliate links." }
    }
}

export async function getEmailCampaignsClient(params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${EMAIL_CAMPAIGNS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load email campaigns." }
    }
}
