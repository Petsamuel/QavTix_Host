"use server";

import { getServerAxios } from "@/lib/axios"
import { CUSTOMER_DETAILS_ENDPOINT, CUSTOMER_LIST_DOWNLOAD_ENDPOINT, CUSTOMERS_ENDPOINT } from "@/endpoints"
import { GetCustomersResult, GetCustomerProfileResult } from "./index"

export async function getCustomers(params: CustomersParams = {}): Promise<GetCustomersResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${CUSTOMERS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load customers." }
    }
}

export async function getCustomerProfile(params: CustomerProfileParams): Promise<GetCustomerProfileResult> {
    try {
        const { user_id, ...rest } = params
        const endpoint = CUSTOMER_DETAILS_ENDPOINT.replace("[user_id]", user_id?.toString() || "")
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`, { params: rest })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load customer profile." }
    }
}

export async function getAttendeesExport(): Promise<{ success: boolean; message?: string; blob?: Blob }> {
    try {
        const axios = await getServerAxios()
        const res = await axios.get(`/${CUSTOMER_LIST_DOWNLOAD_ENDPOINT}`, { responseType: 'blob' })
        return { success: true, blob: res.data }
    } catch (err) {
        return { success: false, message: "Failed to download attendee list." }
    }
}
