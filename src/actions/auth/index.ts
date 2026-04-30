"use server"

import { LOGIN_ENDPOINT, GET_PROFILE_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { CACHE_TAGS } from "@/cache-tags"
import { cacheTag } from "next/cache"
export async function getHostProfile(token: string | undefined): Promise<AuthUser | null> {
    'use cache';
    cacheTag(CACHE_TAGS.PROFILE);
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PROFILE_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            }
        )
        if (!res.ok) return null
        const data = await res.json()
        return data.host
            ? { ...data.host, subscription: data.subscription, verified_badge: data.verified_badge, payout_available: data.payout_available } as AuthUser
            : null
    } catch {
        return null
    }
}


export const logOut = async () => {
    const cookiesStore = await cookies()
    cookiesStore.delete("host_access_token")
    cookiesStore.delete("host_refresh_token")
    redirect(process.env.NEXT_PUBLIC_APP_DOMAIN || "/")
}


export async function verifyPassword(
    email: string,
    password: string,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(LOGIN_ENDPOINT, { email, password })
        return { success: true }
    } catch (error: any) {
        console.log("[verifyPassword] status:", error?.response?.status)
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}