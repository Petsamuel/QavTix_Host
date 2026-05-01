"use cache"

import { cacheLife } from "next/cache"
import { CHECKIN_OVERVIEW_ENDPOINT, CHECKIN_ATTENDEES_ENDPOINT } from "@/endpoints"

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

export async function getCheckInMetrics(token: string, params: CheckInParams = {}): Promise<GetCheckInResult> {
    cacheLife("minutes")
    try {
        const data = await apiFetch(token, CHECKIN_OVERVIEW_ENDPOINT, params)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load metrics." }
    }
}

export async function getCheckInAttendees(token: string, params: CheckInParams = {}): Promise<GetAttendeesResult> {
    cacheLife("minutes")
    try {
        const data = await apiFetch(token, CHECKIN_ATTENDEES_ENDPOINT, params)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load attendees." }
    }
}