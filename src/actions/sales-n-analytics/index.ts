"use cache"

import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cacheLife } from "next/cache"
import {
    SALES_ANALYTICS_CARDS_ENDPOINT,
    SALES_ANALYTICS_GRAPHS_ENDPOINT,
    SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
} from "@/endpoints"

async function fetchFinancials<T>(
    token: string,
    endpoint: string,
    params?: Record<string, string | number>,
): Promise<{ success: true; data: T } | { success: false; message: string }> {
    try {
        const url = new URL(`${process.env.API_BASE_URL}/${endpoint}`)
        if (params) {
            Object.entries(params).forEach(([k, v]) => {
                if (v != null) url.searchParams.set(k, String(v))
            })
        }

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (err: any) {
        return { success: false, message: "Request failed." }
    }
}


export async function getSalesAnalyticsCards(
    token: string, params: SalesAnalyticsCardsParams = {}
): Promise<SalesAnalyticsCardsResult> {
    cacheLife("minutes")
    return fetchFinancials<SalesAnalyticsCardsData>(
        token,
        SALES_ANALYTICS_CARDS_ENDPOINT,
        params as Record<string, string | number>,
    )
}

export async function getSalesAnalyticsGraphs(
    token: string, params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsGraphsResult> {
    cacheLife("minutes")
    return fetchFinancials<SalesAnalyticsGraphsData>(
        token,
        SALES_ANALYTICS_GRAPHS_ENDPOINT,
        params as Record<string, string | number>,
    )
}

export async function getSalesAnalyticsTransaction(
    token: string, params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsTransactionsResult> {
    cacheLife("minutes")
    return fetchFinancials<any>(
        token,
        SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
        params as Record<string, string | number>,
    )
}