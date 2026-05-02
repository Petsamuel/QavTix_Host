import { FINANCIALS_ENDPOINT, PAYOUT_LIST_ENDPOINT } from "@/endpoints"

async function apiFetch(token: string, endpoint: string, params: Record<string, any> = {}) {
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
    })
    if (!res.ok) throw new Error(`Request failed: ${endpoint}`)
    const data = await res.json()
    return data.data ?? data
}

export async function getFinancials(token: string, params: FinancialsParams = {}): Promise<GetFinancialsResult> {
    try {
        const data = await apiFetch(token, FINANCIALS_ENDPOINT, params)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load financials." }
    }
}

export async function getPayoutAccounts(token: string): Promise<{ success: boolean; data?: PayoutAccountItem[]; message?: string }> {
    try {
        const data = await apiFetch(token, PAYOUT_LIST_ENDPOINT)
        return { success: true, data: Array.isArray(data) ? data : [] }
    } catch {
        return { success: false, message: "Failed to load payout accounts." }
    }
}
