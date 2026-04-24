"use server"

import { cookies } from "next/headers"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"

import {
    SALES_ANALYTICS_CARDS_ENDPOINT,
    SALES_ANALYTICS_GRAPHS_ENDPOINT,
    SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
} from "@/endpoints"

const FINANCIALS_REVALIDATE_SECONDS = 300

async function fetchFinancials<T>(
    endpoint: string,
    tag: string,
    params?: Record<string, string | number>,
): Promise<{ success: true; data: T } | { success: false; message: string }> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
            cache: "force-cache",
            next: {
                tags: [tag],
                revalidate: FINANCIALS_REVALIDATE_SECONDS,
            },
        })

        if (!res.ok) {
            const json = await res.json()
            console.error(`[${tag}] status:`, res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (err: any) {
        console.error(`[${tag}] error:`, err?.message)
        return { success: false, message: "Request failed." }
    }
}


export async function getSalesAnalyticsCards(
    params: SalesAnalyticsCardsParams = {}
): Promise<SalesAnalyticsCardsResult> {
    return fetchFinancials<SalesAnalyticsCardsData>(
        SALES_ANALYTICS_CARDS_ENDPOINT,
        CACHE_TAGS.FINANCIALS,
        params as Record<string, string | number>,
    )
}

export async function getSalesAnalyticsGraphs(
    params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsGraphsResult> {
    return fetchFinancials<SalesAnalyticsGraphsData>(
        SALES_ANALYTICS_GRAPHS_ENDPOINT,
        CACHE_TAGS.FINANCIALS,
        params as Record<string, string | number>,
    )
}

export async function getSalesAnalyticsTransaction(
    params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsTransactionsResult> {
    return fetchFinancials<any>(
        SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
        CACHE_TAGS.FINANCIALS,
        params as Record<string, string | number>,
    )
}