"use server"

import { ADD_PAYMENT_CARD, ADD_PAYMENT_CARD_CONFIRM, FEATURED_PLAN_INITIATE_ENDPOINT, FEATURED_PLAN_VERIFY_ENDPOINT, PAYMENT_METHODS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { updateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"



interface PaymentMethodsResult {
    success:  boolean
    data?:    PaymentMethod[]
    message?: string
}

interface MutateResult {
    success:  boolean
    message?: string
}

export async function getPaymentMethods(): Promise<PaymentMethodsResult> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYMENT_METHODS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PAYMENT_METHODS] },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const results = json.data?.results ?? json.results ?? json.data ?? json
        return { success: true, data: Array.isArray(results) ? results : [] }

    } catch (error: any) {
        console.log("[getPaymentMethods] error:", error)
        return { success: false, message: "Failed to load payment methods." }
    }
}

export async function setDefaultPaymentMethod(methodID: number): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(`${PAYMENT_METHODS_ENDPOINT}/${methodID}/default/`)
        updateTag(CACHE_TAGS.PAYMENT_METHODS)
        return { success: true }
    } catch (error: any) {
        console.log("[setDefaultPaymentMethod] status:", error?.response?.status)
        console.log("[setDefaultPaymentMethod] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}



interface InitializePaymentMethodResult {
    success:      boolean
    checkout_url?: string
    message?:     string
}

interface VerifyPaymentPayload {
    reference: string
    save_card: boolean
    country:   string
}

export async function addPaymentMethod(country: string): Promise<InitializePaymentMethodResult> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.post(ADD_PAYMENT_CARD, { country, currency: "naira" })
        const checkout_url = json.data?.checkout_url ?? json.checkout_url
        if (!checkout_url) {
            return { success: false, message: "No checkout URL returned from server." }
        }

        return { success: true, checkout_url }
    } catch (error: any) {
        console.log("[addPaymentMethod] status:", error?.response?.status)
        console.log("[addPaymentMethod] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}


export async function verifyPaymentMethod(
    payload: VerifyPaymentPayload
): Promise<{ message: string, success: boolean }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(ADD_PAYMENT_CARD_CONFIRM, payload)
        return { success: true, message: "Confirmation Successful" }

    } catch (error: any) {
        console.log("[verifyPayment] status:", error?.response?.status)
        console.log("[verifyPayment] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}


export async function deletePaymentMethod(methodId: number): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(`${PAYMENT_METHODS_ENDPOINT}/${methodId}/`)
        updateTag(CACHE_TAGS.PAYMENT_METHODS)
        return { success: true }
    } catch (error: any) {
        console.log("[deletePaymentMethod] status:", error?.response?.status)
        console.log("[deletePaymentMethod] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}



interface InitializeFeaturedResult {
    success: boolean
    checkout_url?: string
    flow?: "popup" | "free" | "saved_card"
    message?: string
}


export async function initializeFeaturedPayment(payload: {
    event_id:  string
    plan_slug: string
    country:   string
    currency:  string
}): Promise<InitializeFeaturedResult> {
    try {
        const axiosInstance = await getServerAxios()

        const { data } = await axiosInstance.post(FEATURED_PLAN_INITIATE_ENDPOINT, payload)
        console.log(data)

        // The flow can be 'free' (using quota), 'popup' (needs Paystack), or 'saved_card'
        const flow = data?.flow || "popup"
        const checkout_url = data?.checkout_url ?? data?.data?.checkout_url

        return { 
            success: true, 
            flow, 
            checkout_url,
            message: data?.message 
        }

    } catch (error: any) {
        console.error("[initializeFeaturedPayment] error:", error?.response?.data || error)
        return {
            success: false,
            message: handleApiError(error?.response?.data) ?? "Could not initialize promotion."
        }
    }
}


export async function verifyFeaturedPayment(payload: {
    reference: string
    event_id:  string
    country:   string
}): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
        const axiosInstance = await getServerAxios()

        const { data } = await axiosInstance.post(FEATURED_PLAN_VERIFY_ENDPOINT, payload)

        return { 
            success: true, 
            message: data?.message ?? "Event successfully promoted!",
            data: data?.data ?? data 
        }

    } catch (error: any) {
        console.error("[verifyFeaturedPayment] error:", error?.response?.data || error)
        return {
            success: false,
            message: error?.response?.data?.message ?? "Verification failed."
        }
    }
}