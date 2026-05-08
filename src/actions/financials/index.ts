import { CACHE_TAGS } from "@/cache-tags"
import { FINANCIALS_ENDPOINT, PAYOUT_LIST_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"

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

export async function getFinancials(token: string, params: FinancialsParams = {}): Promise<GetFinancialsResult> {
    try {
        const data = await apiFetch(token, FINANCIALS_ENDPOINT, params, [CACHE_TAGS.FINANCIALS])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load financials." }
    }
}

export async function getPayoutAccounts(token: string): Promise<{ success: boolean; data?: PayoutAccountItem[]; message?: string }> {
    try {
        const data = await apiFetch(token, PAYOUT_LIST_ENDPOINT, {}, [CACHE_TAGS.PAYOUT_ACCOUNTS])
        return { success: true, data: Array.isArray(data) ? data : [] }
    } catch {
        return { success: false, message: "Failed to load payout accounts." }
    }
}




export async function getFinancialsClient(
    params: FinancialsParams = {}
): Promise<GetFinancialsResult> {
    try {
        const axios = await getServerAxios()
        const urlParams = new URLSearchParams()
        if (params.date_range) urlParams.set("date_range", params.date_range)
        if (params.start_date) urlParams.set("start_date", params.start_date)
        if (params.end_date) urlParams.set("end_date", params.end_date)
        if (params.page) urlParams.set("page", String(params.page))

        const { data } = await axios.get(`/${FINANCIALS_ENDPOINT}?${urlParams.toString()}`)
        return { success: true, data: data.data }
    } catch (err) {
        return { success: false, message: "Failed to load financials." }
    }
}

export async function getPayoutAccountsClient(): Promise<{ success: boolean; data?: PayoutAccountItem[]; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${PAYOUT_LIST_ENDPOINT}`)
        return { success: true, data: Array.isArray(data.data) ? data.data : [] }
    } catch (err) {
        return { success: false, message: "Failed to load payout accounts." }
    }
}
