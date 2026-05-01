"use server";

import { getServerAxios } from "@/lib/axios"
import {
    SALES_ANALYTICS_CARDS_ENDPOINT,
    SALES_ANALYTICS_GRAPHS_ENDPOINT,
    SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
} from "@/endpoints"

export async function getSalesAnalyticsCards(params: SalesAnalyticsCardsParams = {}): Promise<SalesAnalyticsCardsResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${SALES_ANALYTICS_CARDS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Request failed." }
    }
}

export async function getSalesAnalyticsGraphs(params: SalesAnalyticsGraphsParams = {}): Promise<SalesAnalyticsGraphsResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${SALES_ANALYTICS_GRAPHS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Request failed." }
    }
}

export async function getSalesAnalyticsTransaction(params: SalesAnalyticsGraphsParams = {}): Promise<SalesAnalyticsTransactionsResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${SALES_ANALYTICS_TRANSACTIONS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Request failed." }
    }
}
