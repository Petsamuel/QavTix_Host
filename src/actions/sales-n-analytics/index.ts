import { CACHE_TAGS } from "@/cache-tags"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import {
    SALES_ANALYTICS_CARDS_ENDPOINT,
    SALES_ANALYTICS_GRAPHS_ENDPOINT,
    SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
} from "@/endpoints"
import { getServerAxios } from "@/lib/axios";

async function fetchFinancials<T>(
    token: string,
    endpoint: string,
    params?: Record<string, string | number>,
    tags?: string[],
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
                Authorization: `Bearer ${token}`,
            },
            next: { tags: [...(tags ?? [])], revalidate: 300 }
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
    return fetchFinancials<SalesAnalyticsCardsData>(
        token,
        SALES_ANALYTICS_CARDS_ENDPOINT,
        params as Record<string, string | number>,
        [CACHE_TAGS.FINANCIALS]
    )
}

export async function getSalesAnalyticsGraphs(
    token: string, params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsGraphsResult> {
    return fetchFinancials<SalesAnalyticsGraphsData>(
        token,
        SALES_ANALYTICS_GRAPHS_ENDPOINT,
        params as Record<string, string | number>,
        [CACHE_TAGS.FINANCIALS]
    )
}

export async function getSalesAnalyticsTransaction(
    token: string, params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsTransactionsResult> {
    return fetchFinancials<any>(
        token,
        SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
        params as Record<string, string | number>,
        [CACHE_TAGS.FINANCIALS]
    )
}



export async function getSalesAnalyticsCardsClient(
    params: SalesAnalyticsCardsParams = {}
): Promise<SalesAnalyticsCardsResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.get(SALES_ANALYTICS_CARDS_ENDPOINT, { params })
        return { success: true, data: json.data ?? json }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function getSalesAnalyticsGraphsClient(
    params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsGraphsResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.get(SALES_ANALYTICS_GRAPHS_ENDPOINT, { params })
        return { success: true, data: json.data ?? json }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function getSalesAnalyticsTransactionClient(
    params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsTransactionsResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.get(SALES_ANALYTICS_TRANSACTIONS_ENDPOINT, { params })
        return { success: true, data: json.data ?? json }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}