"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import {
    PROMO_CODES_ENDPOINT,
    AFFILIATE_LINKS_HOST_ENDPOINT,
    EMAIL_CAMPAIGNS_ENDPOINT,
    CREATE_PROMO_CODES_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag, cacheTag } from "next/cache"

async function fetchWithAuth(token: string | undefined, url: string, tag: string) {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }
    })
    if (!res.ok) {
        const json = await res.json()
        return { success: false, message: handleApiError(json) }
    }
    const json = await res.json()
    return { success: true, data: json.data }
}

export async function getPromoCodes(token: string | undefined, params: {
    page?: number
    search?: string
    status?: string
    event?: string
} = {}): Promise<{ success: boolean; data?: TabSlice<PromoCode>; message?: string }> {
    'use cache';
    cacheTag(CACHE_TAGS.MARKETING_PROMO);
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${PROMO_CODES_ENDPOINT}`)
    if (params.page) url.searchParams.set("page", String(params.page))
    if (params.search) url.searchParams.set("search", params.search)
    if (params.status) url.searchParams.set("status", params.status)
    if (params.event) url.searchParams.set("event", params.event)
    return fetchWithAuth(token, url.toString(), CACHE_TAGS.MARKETING_PROMO)
}

export async function getAffiliateLinks(token: string | undefined, params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: TabSlice<AffiliateLink> & { cards: AffiliateCards }; message?: string }> {
    'use cache';
    cacheTag(CACHE_TAGS.MARKETING_AFFILIATE);
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${AFFILIATE_LINKS_HOST_ENDPOINT}`)
    if (params.page) url.searchParams.set("page", String(params.page))
    return fetchWithAuth(token, url.toString(), CACHE_TAGS.MARKETING_AFFILIATE)
}

export async function getEmailCampaigns(token: string | undefined, params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: TabSlice<EmailCampaign>; message?: string }> {
    'use cache';
    cacheTag(CACHE_TAGS.MARKETING_CAMPAIGNS);
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${EMAIL_CAMPAIGNS_ENDPOINT}`)
    if (params.page) url.searchParams.set("page", String(params.page))
    return fetchWithAuth(token, url.toString(), CACHE_TAGS.MARKETING_CAMPAIGNS)
}

export async function createPromoCode(
    payload: CreatePromoCodePayload
): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()

        await axios.post(CREATE_PROMO_CODES_ENDPOINT, payload)

        revalidateTag(CACHE_TAGS.MARKETING_PROMO, "max")

        return { success: true, message: "Account removed successfully." }

    } catch (err: any) {
        console.error("[createPromoCode] status:", err?.response?.status)
        console.error("[createPromoCode] body:", JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}