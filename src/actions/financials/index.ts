"use server"

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { FINANCIALS_ENDPOINT, PAYOUT_ADD_ENDPOINT, PAYOUT_LIST_ENDPOINT, REMOVE_PAYOUT_ENDPOINT, WITHDRAWAL_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { randomUUID } from "crypto"
import { cacheTag } from "next/cache";

export async function getFinancials(
    token: string | undefined, params: FinancialsParams = {}
): Promise<GetFinancialsResult> {
    'use cache';
    cacheTag(CACHE_TAGS.FINANCIALS);
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${FINANCIALS_ENDPOINT}`)
        if (params.date_range) url.searchParams.set("date_range", params.date_range)
        if (params.start_date) url.searchParams.set("start_date", params.start_date)
        if (params.end_date) url.searchParams.set("end_date", params.end_date)
        if (params.page) url.searchParams.set("page", String(params.page))

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getFinancials] error:", err)
        return { success: false, message: "Failed to load financials." }
    }
}

export async function getPayoutAccounts(token: string | undefined): Promise<{ success: boolean; data?: PayoutAccountItem[]; message?: string }> {
    'use cache';
    cacheTag(CACHE_TAGS.PAYOUT_ACCOUNTS);
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYOUT_LIST_ENDPOINT}`)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: Array.isArray(json.data) ? json.data : [] }

    } catch (err) {
        console.error("[getPayoutAccounts] error:", err)
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

        const fresh = await getFinancials(undefined)

        return {
            success: true,
            message: "Withdrawal request submitted successfully.",
            freshData: fresh.data,
        }
    } catch (err: any) {
        console.error("[submitWithdrawal] status:", err?.response?.status)
        console.error("[submitWithdrawal] body:", JSON.stringify(err?.response?.data))
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
        console.error("[addPayoutAccount] status:", err?.response?.status)
        console.error("[addPayoutAccount] body:", JSON.stringify(err?.response?.data))
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
        console.error("[removePayoutAccount] status:", err?.response?.status)
        console.error("[removePayoutAccount] body:", JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}