"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { CUSTOMER_DETAILS_ENDPOINT, CUSTOMER_LIST_DOWNLOAD_ENDPOINT, CUSTOMERS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cookies } from "next/headers"


interface GetCustomersResult {
    success: boolean
    data?: CustomersData
    message?: string
}

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("access_token")?.value
}


export async function getCustomers(
    params: CustomersParams = {}
): Promise<GetCustomersResult> {
    try {
        const token = await getToken()
        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CUSTOMERS_ENDPOINT}`
        )

        if (params.date_range  != null) url.searchParams.set("date_range",  params.date_range)
        if (params.start_date  != null) url.searchParams.set("start_date",  params.start_date)
        if (params.end_date    != null) url.searchParams.set("end_date",    params.end_date)
        if (params.event       != null) url.searchParams.set("event",       params.event)
        if (params.ordering    != null) url.searchParams.set("ordering",    params.ordering)
        if (params.page        != null) url.searchParams.set("page",        String(params.page))
        if (params.search      != null) url.searchParams.set("search",      params.search)
        if (params.ticket_type != null) url.searchParams.set("ticket_type", String(params.ticket_type))

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.CUSTOMERS] },
        })

        if (!res.ok) {
            const json = await res.json()
            console.error("[getCustomers] status:", res.status, json)
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getCustomers] error:", err)
        return { success: false, message: "Failed to load customers." }
    }
}



export async function getCustomerProfile(
    params: CustomerProfileParams
): Promise<GetCustomerProfileResult> {
    try {
        const token  = await getToken()
        const { user_id, ...rest } = params

        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CUSTOMER_DETAILS_ENDPOINT.replace("[user_id]", user_id?.toString() || "")}`
        )

        const entries: [string, string | number | undefined][] = [
            ["date_range",         rest.date_range],
            ["event",              rest.event],
            ["chart_range",        rest.chart_range],
            ["history_date_range", rest.history_date_range],
            ["history_event",      rest.history_event],
            ["ticket_type",        rest.ticket_type],
            ["search",             rest.search],
            ["ordering",           rest.ordering],
            ["page",               rest.page],
        ]

        for (const [key, val] of entries) {
            if (val != null) url.searchParams.set(key, String(val))
        }

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.CUSTOMER] },
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getCustomerProfile] error:", err)
        return { success: false, message: "Failed to load customer profile." }
    }
}



export async function getAttendeesExport(): Promise<{ 
    success: boolean; 
    message?: string;
    blob?: Blob;
}> {
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CUSTOMER_LIST_DOWNLOAD_ENDPOINT}`

        const res = await fetch(url, {
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
        })

        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            return { 
                success: false, 
                message: handleApiError(json) || "Failed to export attendees" 
            }
        }

        const blob = await res.blob()

        return { 
            success: true, 
            blob 
        }

    } catch (err) {
        console.error("[getAttendeesExport] error:", err)
        return { 
            success: false, 
            message: "Failed to download attendee list." 
        }
    }
}