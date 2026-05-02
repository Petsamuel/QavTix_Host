import { CACHE_TAGS } from "@/cache-tags"
import { CUSTOMER_DETAILS_ENDPOINT, CUSTOMERS_ENDPOINT } from "@/endpoints"

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

async function apiFetch(token: string, endpoint: string, params: Record<string, any> = {}, tags?: string[]) {
    const query = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            query.append(key, String(value))
        }
    })

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}${query.toString() ? `?${query.toString()}` : ""}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        next: { tags: [...(tags ?? [])], revalidate: 300 }
    })
    if (!res.ok) throw new Error(`Request failed: ${endpoint}`)
    const data = await res.json()
    return data.data ?? data
}

export async function getCustomers(token: string, params: CustomersParams = {}): Promise<GetCustomersResult> {
    try {
        const data = await apiFetch(token, CUSTOMERS_ENDPOINT, params, [CACHE_TAGS.CUSTOMERS])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load customers." }
    }
}

export async function getCustomerProfile(token: string, params: CustomerProfileParams): Promise<GetCustomerProfileResult> {
    try {
        const { user_id, ...rest } = params
        const endpoint = CUSTOMER_DETAILS_ENDPOINT.replace("[user_id]", user_id?.toString() ?? "")
        const data = await apiFetch(token, endpoint, rest, [CACHE_TAGS.CUSTOMER])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load customer profile." }
    }
}