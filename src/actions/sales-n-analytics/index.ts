import { handleApiError } from "@/helper-fns/handleApiErrors"
import { CACHE_TAGS } from "@/cache-tags"
import { cacheTag } from "next/cache"
import {
    SALES_ANALYTICS_CARDS_ENDPOINT,
    SALES_ANALYTICS_GRAPHS_ENDPOINT,
    SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
} from "@/endpoints"

async function fetchFinancials<T>(
    token: string | undefined,
    endpoint: string,
    tag: string,
    params?: Record<string, string | number>,
): Promise<{ success: true; data: T } | { success: false; message: string }> {
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
    token: string | undefined, params: SalesAnalyticsCardsParams = {}
): Promise<SalesAnalyticsCardsResult> {
    'use cache';
    cacheTag(CACHE_TAGS.FINANCIALS);
    return fetchFinancials<SalesAnalyticsCardsData>(
        token,
        SALES_ANALYTICS_CARDS_ENDPOINT,
        CACHE_TAGS.FINANCIALS,
        params as Record<string, string | number>,
    )
}

export async function getSalesAnalyticsGraphs(
    token: string | undefined, params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsGraphsResult> {
    'use cache';
    cacheTag(CACHE_TAGS.FINANCIALS);
    return fetchFinancials<SalesAnalyticsGraphsData>(
        token,
        SALES_ANALYTICS_GRAPHS_ENDPOINT,
        CACHE_TAGS.FINANCIALS,
        params as Record<string, string | number>,
    )
}

export async function getSalesAnalyticsTransaction(
    token: string | undefined, params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsTransactionsResult> {
    'use cache';
    cacheTag(CACHE_TAGS.FINANCIALS);
    return fetchFinancials<any>(
        token,
        SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
        CACHE_TAGS.FINANCIALS,
        params as Record<string, string | number>,
    )
}