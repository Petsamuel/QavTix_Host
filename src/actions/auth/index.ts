"use cache"

import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { cacheLife } from "next/cache"

export async function getHostProfile(token: string | undefined): Promise<AuthUser | null> {
    cacheLife("hours")
    try {
        const res = await fetch(
            `${process.env.API_BASE_URL}/${GET_PROFILE_ENDPOINT}`,
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