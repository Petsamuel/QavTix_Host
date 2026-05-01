"use cache"

import { CUSTOMER_DETAILS_ENDPOINT, CUSTOMERS_ENDPOINT } from "@/endpoints"
import { cacheLife } from "next/cache"

export interface GetCustomersResult {
    success: boolean
    data?: CustomersData
    message?: string
}

export interface GetCustomerProfileResult {
    success: boolean
    data?: CustomerProfileData
    message?: string
}





export async function getCustomers(token: string, params: CustomersParams = {}): Promise<GetCustomersResult> {
    cacheLife("hours")

    try {
        const query = new URLSearchParams(params as Record<string, string>).toString()
        const res = await fetch(`${process.env.API_BASE_URL}/${CUSTOMERS_ENDPOINT}${query ? `?${query}` : ""}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) throw new Error("Failed to load customers.")

        const data = await res.json()
        return { success: true, data: data.data ?? data }
    } catch {
        return { success: false, message: "Failed to load customers." }
    }
}

export async function getCustomerProfile(token: string, params: CustomerProfileParams): Promise<GetCustomerProfileResult> {
    cacheLife("hours")

    try {
        const { user_id, ...rest } = params
        const endpoint = CUSTOMER_DETAILS_ENDPOINT.replace("[user_id]", user_id?.toString() ?? "")
        const query = new URLSearchParams(rest as Record<string, string>).toString()

        const res = await fetch(`${process.env.API_BASE_URL}/${endpoint}${query ? `?${query}` : ""}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!res.ok) throw new Error("Failed to load customer profile.")

        const data = await res.json()
        return { success: true, data: data.data ?? data }
    } catch {
        return { success: false, message: "Failed to load customer profile." }
    }
}