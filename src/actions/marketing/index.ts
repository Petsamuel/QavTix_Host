import { CACHE_TAGS } from "@/cache-tags"
import {
    PROMO_CODES_ENDPOINT,
    AFFILIATE_LINKS_HOST_ENDPOINT,
    EMAIL_CAMPAIGNS_ENDPOINT
} from "@/endpoints"

async function apiFetch(token: string, endpoint: string, params: Record<string, any> = {}, tags?: string[]) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value))
        }
    })

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}${query.toString() ? `?${query.toString()}` : ""}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        next: { tags: [...(tags ?? [])], revalidate: 300 }
    })
    if (!res.ok) throw new Error(`Request failed: ${endpoint}`)
    const data = await res.json()
    return data.data ?? data
}

export async function getPromoCodes(token: string, params: {
    page?: number
    search?: string
    status?: string
    event?: string
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
        const data = await apiFetch(token, PROMO_CODES_ENDPOINT, params, [CACHE_TAGS.MARKETING_PROMO])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load promo codes." }
    }
}

export async function getAffiliateLinks(token: string, params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
        const data = await apiFetch(token, AFFILIATE_LINKS_HOST_ENDPOINT, params, [CACHE_TAGS.MARKETING_AFFILIATE])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load affiliate links." }
    }
}

export async function getEmailCampaigns(token: string, params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
        const data = await apiFetch(token, EMAIL_CAMPAIGNS_ENDPOINT, params, [CACHE_TAGS.MARKETING_CAMPAIGNS])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load email campaigns." }
    }
}