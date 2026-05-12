"use server";

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { FINANCIALS_ENDPOINT, PAYOUT_ADD_ENDPOINT, PAYOUT_LIST_ENDPOINT, REMOVE_PAYOUT_ENDPOINT, WITHDRAWAL_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { randomUUID } from "crypto"

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

        const queryString = urlParams.toString()
        const url = queryString ? `/${FINANCIALS_ENDPOINT}?${queryString}` : `/${FINANCIALS_ENDPOINT}`

        const { data } = await axios.get(url)
        // Handle both { data: { ... } } and { ... } structures
        const resultData = data?.data ?? data
        return { success: true, data: resultData }
    } catch (err) {
        console.error("[getFinancialsClient] Error:", err)
        return { success: false, message: "Failed to load financials." }
    }
}

export async function getPayoutAccountsClient(): Promise<{ success: boolean; data?: PayoutAccountItem[]; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${PAYOUT_LIST_ENDPOINT}`)
        const resultData = data?.data ?? data
        return { success: true, data: Array.isArray(resultData) ? resultData : [] }
    } catch (err) {
        console.error("[getPayoutAccountsClient] Error:", err)
        return { success: false, message: "Failed to load payout accounts." }
    }
}

export async function submitWithdrawal(
    payload: WithdrawPayload
): Promise<WithdrawResult & { freshData?: FinancialData }> {
    try {
        const axios = await getServerAxios()
        const idempotencyKey = randomUUID()

        await axios.post(`/${WITHDRAWAL_ENDPOINT}`, payload, {
            headers: { "Idempotency-Key": idempotencyKey },
        })

        revalidateTag(CACHE_TAGS.FINANCIALS, "max")

        const fresh = await getFinancialsClient()

        return {
            success: true,
            message: "Withdrawal request submitted successfully.",
            freshData: fresh.data,
        }
    } catch (err: any) {
        console.error("[submitWithdrawal] status:", err?.response?.status)
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function addPayoutAccount(payload: {
    bank_name: string
    account_name: string
    account_number: string
    bank_code?: string
    is_default?: boolean
}): Promise<{ success: boolean; data?: PayoutAccountItem; message?: string }> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.post(`/${PAYOUT_ADD_ENDPOINT}`, payload)

        revalidateTag(CACHE_TAGS.PAYOUT_ACCOUNTS, "max")

        return { success: true, data: data.data }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function removePayoutAccount(
    accountId: string
): Promise<{ success: boolean; message?: string }> {
    try {
        const axios = await getServerAxios()
        await axios.delete(REMOVE_PAYOUT_ENDPOINT.replace("[payout_id]", accountId))

        revalidateTag(CACHE_TAGS.PAYOUT_ACCOUNTS, "max")

        return { success: true, message: "Account removed successfully." }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}
