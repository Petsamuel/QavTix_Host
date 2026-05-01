"use server";

import { ADD_PAYMENT_CARD, ADD_PAYMENT_CARD_CONFIRM, FEATURED_PLAN_INITIATE_ENDPOINT, FEATURED_PLAN_VERIFY_ENDPOINT, FREE_TRIAL_ENDPOINT, PAYMENT_METHODS_ENDPOINT, SET_DEFAULT_PAYMENT_CARD_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

async function getToken(): Promise<string | undefined> {
    const { cookies } = await import("next/headers")
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

interface MutateResult {
    success: boolean
    message?: string
}

export async function setDefaultPaymentMethod(methodID: number): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        const endpoint = SET_DEFAULT_PAYMENT_CARD_ENDPOINT.replace("[card_id]", String(methodID))
        await axiosInstance.patch(endpoint)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function addPaymentMethod(country: string): Promise<{ success: boolean; checkout_url?: string; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        const { data: json } = await axiosInstance.post(ADD_PAYMENT_CARD, { country, currency: "NGN" })
        const checkout_url = json.data?.checkout_url ?? json.checkout_url
        if (!checkout_url) {
            return { success: false, message: "No checkout URL returned from server." }
        }
        return { success: true, checkout_url }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function verifyPaymentMethod(
    payload: { reference: string; save_card: boolean; country: string }
): Promise<{ message: string, success: boolean }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(ADD_PAYMENT_CARD_CONFIRM, payload)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        return { success: true, message: "Confirmation Successful" }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deletePaymentMethod(methodId: number): Promise<MutateResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(`${PAYMENT_METHODS_ENDPOINT}/${methodId}/`)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function initializeFeaturedPayment(payload: {
    event_id: string
    plan_slug: string
    country: string
    currency: string
}): Promise<{ success: boolean; checkout_url?: string; flow?: "popup" | "free" | "saved_card"; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(FEATURED_PLAN_INITIATE_ENDPOINT, payload)
        const flow = data?.flow || "popup"
        const checkout_url = data?.checkout_url ?? data?.data?.checkout_url
        return { success: true, flow, checkout_url, message: data?.message }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) ?? "Could not initialize promotion." }
    }
}

export async function verifyFeaturedPayment(payload: {
    reference: string
    event_id: string
    country: string
}): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(FEATURED_PLAN_VERIFY_ENDPOINT, payload)
        return { success: true, message: data?.message ?? "Event successfully promoted!", data: data?.data ?? data }
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message ?? "Verification failed." }
    }
}

export async function startFreeTrial(): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(FREE_TRIAL_ENDPOINT)
        revalidateTag(CACHE_TAGS.PAYMENT_METHODS, "max")
        revalidateTag(CACHE_TAGS.EVENTS, "max")
        return { success: true, message: data?.message || "Free trial activated successfully!", data: data?.data ?? data }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) || "Failed to start free trial." }
    }
}
