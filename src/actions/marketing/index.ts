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
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("host_access_token")?.value
}

async function fetchWithAuth(url: string, tag: string) {
    const token = await getToken()
    const res   = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { tags: [tag] },
    })
    if (!res.ok) {
        const json = await res.json()
        return { success: false, message: handleApiError(json) }
    }
    const json = await res.json()
    return { success: true, data: json.data }
}

export async function getPromoCodes(params: {
    page?:    number
    search?:  string
    status?:  string
    event?:   string
} = {}): Promise<{ success: boolean; data?: TabSlice<PromoCode>; message?: string }> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${PROMO_CODES_ENDPOINT}`)
    if (params.page)   url.searchParams.set("page",   String(params.page))
    if (params.search) url.searchParams.set("search", params.search)
    if (params.status) url.searchParams.set("status", params.status)
    if (params.event)  url.searchParams.set("event",  params.event)
    return fetchWithAuth(url.toString(), CACHE_TAGS.MARKETING)
}

export async function getAffiliateLinks(params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: TabSlice<AffiliateLink> & { cards: AffiliateCards }; message?: string }> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${AFFILIATE_LINKS_HOST_ENDPOINT}`)
    if (params.page) url.searchParams.set("page", String(params.page))
    return fetchWithAuth(url.toString(), CACHE_TAGS.MARKETING)
}

export async function getEmailCampaigns(params: {
    page?: number
} = {}): Promise<{ success: boolean; data?: TabSlice<EmailCampaign>; message?: string }> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${EMAIL_CAMPAIGNS_ENDPOINT}`)
    if (params.page) url.searchParams.set("page", String(params.page))
    return fetchWithAuth(url.toString(), CACHE_TAGS.MARKETING)
}


export async function createPromoCode(
payload: CreatePromoCodePayload
): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()

        await axios.post(CREATE_PROMO_CODES_ENDPOINT, payload)

        revalidateTag(CACHE_TAGS.MARKETING, "max")

        return { success: true, message: "Account removed successfully." }

    } catch (err: any) {
        console.error("[removePayoutAccount] status:", err?.response?.status)
        console.error("[removePayoutAccount] body:",   JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}