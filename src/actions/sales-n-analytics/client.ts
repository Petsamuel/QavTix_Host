"use server";

import { 
    SALES_ANALYTICS_CARDS_ENDPOINT, 
    SALES_ANALYTICS_GRAPHS_ENDPOINT, 
    SALES_ANALYTICS_TRANSACTIONS_ENDPOINT 
} from "@/endpoints";
import { handleApiError } from "@/helper-fns/handleApiErrors";
import { getServerAxios } from "@/lib/axios";

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
