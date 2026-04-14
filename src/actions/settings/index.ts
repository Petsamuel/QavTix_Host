"use server"

import {
    DOWNLOAD_DATA_ENDPOINT,
    DELETE_ACCOUNT_ENDPOINT,
    GET_PRIVACY_SETTINGS_ENDPOINT,
    SET_PRIVACY_SETTINGS_ENDPOINT,
    CHANGE_PASSWORD_ENDPOINT,
    GET_SUBSCRIPTION_ENDPOINT,
    TOGGLE_AUTO_RENEW_ENDPOINT,
    RENEW_SUBSCRIPTION_ENDPOINT,
    CANCEL_SUBSCRIPTION_ENDPOINT,
} from "@/endpoints";
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { updateTag } from "next/cache"
import { cookies } from "next/headers"
import { CACHE_TAGS } from "@/cache-tags"


interface PrivacyResult {
    success:  boolean
    data?:    PrivacySettings
    message?: string
}

export async function getPrivacySettings(): Promise<PrivacyResult> {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PRIVACY_SETTINGS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PRIVACY_SETTINGS] },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        console.log("[getPrivacySettings] error:", error)
        return { success: false, message: "Failed to load privacy settings." }
    }
}

export async function updatePrivacySettings(
    payload: PrivacySettings,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(SET_PRIVACY_SETTINGS_ENDPOINT, payload)
        updateTag(CACHE_TAGS.PRIVACY_SETTINGS)
        return { success: true }
    } catch (error: any) {
        console.log("[updatePrivacySettings] status:", error?.response?.status)
        console.log("[updatePrivacySettings] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function downloadPrivacyData(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(DOWNLOAD_DATA_ENDPOINT)
        return { success: true }
    } catch (error: any) {
        console.log("[downloadPrivacyData] status:", error?.response?.status)
        console.log("[downloadPrivacyData] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}

export async function deleteAccount(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.delete(DELETE_ACCOUNT_ENDPOINT)

        const cookieStore = await cookies()
        cookieStore.delete("access_token")
        cookieStore.delete("refresh_token")

        return { success: true }
    } catch (error: any) {
        console.log("[deleteAccount] status:", error?.response?.status)
        console.log("[deleteAccount] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}




interface ChangePasswordResult {
    success:  boolean
    message?: string
}

export async function changePassword(
    oldPassword: string,
    newPassword: string,
): Promise<ChangePasswordResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(CHANGE_PASSWORD_ENDPOINT, {
            old_password: oldPassword,
            new_password: newPassword,
        })
        // No revalidation needed — password change doesn't affect cached data
        return { success: true }
    } catch (error: any) {
        console.log("[changePassword] status:", error?.response?.status)
        console.log("[changePassword] body:", JSON.stringify(error?.response?.data))
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}



async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("access_token")?.value
}

export async function getSubscription(): Promise<GetSubscriptionResult> {
    try {
        const token = await getToken()

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_SUBSCRIPTION_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                next: { tags: [CACHE_TAGS.SUBSCRIPTION] },
            }
        )

        if (!res.ok) {
            const json = await res.json()
            console.error("[getSubscription] status:", res.status, json)
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getSubscription] error:", err)
        return { success: false, message: "Failed to load subscription." }
    }
}

export async function toggleAutoRenew(
    enabled: boolean
): Promise<ToggleAutoRenewResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.patch(TOGGLE_AUTO_RENEW_ENDPOINT, { auto_renew: enabled })
        updateTag(CACHE_TAGS.SUBSCRIPTION)
        return { success: true }
    } catch (err: any) {
        console.error("[toggleAutoRenew] status:", err?.response?.status)
        console.error("[toggleAutoRenew] body:", JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function renewSubscription(): Promise<RenewSubscriptionResult> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(RENEW_SUBSCRIPTION_ENDPOINT)
        updateTag(CACHE_TAGS.SUBSCRIPTION)
        return { success: true }
    } catch (err: any) {
        console.error("[renewSubscription] status:", err?.response?.status)
        console.error("[renewSubscription] body:", JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function cancelSubscription(): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(CANCEL_SUBSCRIPTION_ENDPOINT)
        updateTag(CACHE_TAGS.SUBSCRIPTION)
        return { success: true }
    } catch (err: any) {
        console.error("[cancelSubscription] status:", err?.response?.status)
        console.error("[cancelSubscription] body:", JSON.stringify(err?.response?.data))
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}