"use cache"

import { cacheLife } from "next/cache"
import { 
    PROMO_CODES_ENDPOINT,
    AFFILIATE_LINKS_HOST_ENDPOINT,
    EMAIL_CAMPAIGNS_ENDPOINT
} from "@/endpoints"

async function apiFetch(token: string, endpoint: string, params: Record<string, any> = {}) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value))
        }
    })
    
    const res = await fetch(`${process.env.API_BASE_URL}/${endpoint}${query.toString() ? `?${query.toString()}` : ""}`, {
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
        },
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
    cacheLife("minutes")
    try {
        const data = await apiFetch(token, PROMO_CODES_ENDPOINT, params)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load promo codes." }
    }
}

export async function getAffiliateLinks(token: string, params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    cacheLife("minutes")
    try {
        const data = await apiFetch(token, AFFILIATE_LINKS_HOST_ENDPOINT, params)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load affiliate links." }
    }
}

export async function getEmailCampaigns(token: string, params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: any; message?: string }> {
    cacheLife("minutes")
    try {
        const data = await apiFetch(token, EMAIL_CAMPAIGNS_ENDPOINT, params)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load email campaigns." }
    }
}