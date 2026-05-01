"use server";

import {
    DOWNLOAD_DATA_ENDPOINT,
    DELETE_ACCOUNT_ENDPOINT,
    SET_PRIVACY_SETTINGS_ENDPOINT,
    CHANGE_PASSWORD_ENDPOINT,
    TOGGLE_AUTO_RENEW_ENDPOINT,
    RENEW_SUBSCRIPTION_ENDPOINT,
    CANCEL_SUBSCRIPTION_ENDPOINT,
    HOST_PLAN_CHECKOUT_ENDPOINT,
    HOST_PLAN_CHECKOUT_VERIFY_ENDPOINT,
} from "@/endpoints";
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { resolveCountryLabel } from "@/helper-fns/resolveCountryCode";
import { CACHE_TAGS } from "@/cache-tags";

export async function getUserLocationClient(): Promise<{ city: string; country: string }> {
    const headersList = await headers()
    const city = headersList.get("x-vercel-ip-city") ?? "Lagos"
    const countryCode = headersList.get("x-vercel-ip-country") ?? "NG"
    return {
        city: decodeURIComponent(city),
        country: resolveCountryLabel(countryCode),
    }
}

export async function updatePrivacySettings(
    payload: PrivacySettings,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(SET_PRIVACY_SETTINGS_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.PRIVACY_SETTINGS, "max")
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function downloadPrivacyData(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(DOWNLOAD_DATA_ENDPOINT)
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deleteAccount(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(DELETE_ACCOUNT_ENDPOINT)

        const { cookies } = await import("next/headers")
        const cookieStore = await cookies()
        cookieStore.delete("host_access_token")
        cookieStore.delete("host_refresh_token")

        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function changePassword(
    oldPassword: string,
    newPassword: string,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(CHANGE_PASSWORD_ENDPOINT, {
            old_password: oldPassword,
            new_password: newPassword,
        })
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function toggleAutoRenew(
    enabled: boolean
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(TOGGLE_AUTO_RENEW_ENDPOINT, { auto_renew: enabled })
        revalidateTag(CACHE_TAGS.SUBSCRIPTION, "max")
        return { success: true }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function renewSubscription(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(RENEW_SUBSCRIPTION_ENDPOINT)
        revalidateTag(CACHE_TAGS.SUBSCRIPTION, "max")
        return { success: true }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function cancelSubscription(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(CANCEL_SUBSCRIPTION_ENDPOINT)
        revalidateTag(CACHE_TAGS.SUBSCRIPTION, "max")
        return { success: true }
    } catch (err: any) {
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function initializeHostSubscription(payload: {
    plan_slug: string
    billing_cycle: "monthly" | "annual"
    country: string
    currency: string
}): Promise<{ success: boolean; checkout_url?: string; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(HOST_PLAN_CHECKOUT_ENDPOINT, { ...payload, currency: "NGN" })
        const checkout_url = data?.checkout_url ?? data?.data?.checkout_url
        if (!checkout_url) {
            return { success: false, message: "No checkout URL returned from server." }
        }
        return { success: true, checkout_url }
    } catch (error: any) {
        return { success: false, message: "Subscription initialization failed." }
    }
}

export async function verifyHostSubscription(payload: {
    reference: string
    save_card: boolean
    country: string
}): Promise<{ success: boolean; message?: string; data?: any }> {
    try {
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.post(HOST_PLAN_CHECKOUT_VERIFY_ENDPOINT, payload)
        revalidateTag(CACHE_TAGS.SUBSCRIPTION, "max")
        return { success: true, message: data?.message, data: data?.data ?? data }
    } catch (error: any) {
        return { success: false, message: error?.response?.data?.message ?? "Verification failed." }
    }
}
