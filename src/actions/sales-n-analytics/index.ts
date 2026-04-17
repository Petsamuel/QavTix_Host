"use server"

import { getServerAxios } from "@/lib/axios"
import { handleApiError } from "@/helper-fns/handleApiErrors"

import {
    SALES_ANALYTICS_CARDS_ENDPOINT,
    SALES_ANALYTICS_GRAPHS_ENDPOINT,
    SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
} from "@/endpoints"



export async function getSalesAnalyticsCards(
    params: SalesAnalyticsCardsParams = {}
): Promise<SalesAnalyticsCardsResult> {
    try {
        const axios = await getServerAxios()

        const searchParams = new URLSearchParams()
        if (params.date_range) searchParams.set("date_range", params.date_range)
        if (params.event)      searchParams.set("event",      params.event)

        const query = searchParams.toString()
        const url   = query
            ? `${SALES_ANALYTICS_CARDS_ENDPOINT}?${query}`
            : SALES_ANALYTICS_CARDS_ENDPOINT

        const { data } = await axios.get(url)

        return { success: true, data: data.data }

    } catch (err: any) {
        console.error("[getSalesAnalyticsCards] status:", err?.response?.status)
        console.error("[getSalesAnalyticsCards] body:",   JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function getSalesAnalyticsGraphs(
    params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsGraphsResult> {
    try {
        const axios = await getServerAxios()

        const searchParams = new URLSearchParams()
        if (params.chart) searchParams.set("chart", params.chart)
        if (params.event) searchParams.set("event", params.event)
        if (params.year)  searchParams.set("year",  String(params.year))

        const query = searchParams.toString()
        const url   = query
            ? `${SALES_ANALYTICS_GRAPHS_ENDPOINT}?${query}`
            : SALES_ANALYTICS_GRAPHS_ENDPOINT

        const { data } = await axios.get(url)

        return { success: true, data: data.data }

    } catch (err: any) {
        console.error("[getSalesAnalyticsGraphs] status:", err?.response?.status)
        console.error("[getSalesAnalyticsGraphs] body:",   JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}


export async function getSalesAnalyticsTransaction(
    params: SalesAnalyticsGraphsParams = {}
): Promise<SalesAnalyticsTransactionsResult> {
    try {
        const axios = await getServerAxios()

        const searchParams = new URLSearchParams()
        if (params.chart) searchParams.set("chart", params.chart)
        if (params.event) searchParams.set("event", params.event)
        if (params.year)  searchParams.set("year",  String(params.year))

        const query = searchParams.toString()
        const url   = query
            ? `${SALES_ANALYTICS_TRANSACTIONS_ENDPOINT}?${query}`
            : SALES_ANALYTICS_TRANSACTIONS_ENDPOINT

        const { data } = await axios.get(url)

        return { success: true, data: data.data }

    } catch (err: any) {
        console.error("[getSalesAnalyticsTransactions] status:", err?.response?.status)
        console.error("[getSalesAnalyticsTransactions] body:",   JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}