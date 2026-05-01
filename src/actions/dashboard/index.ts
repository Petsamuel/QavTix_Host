"use cache"

import {
    DASHBOARD_FEED_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT,
    HOST_UPCOMING_EVENTS_ENDPOINT,
} from "@/endpoints"
import { cacheLife } from "next/cache"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function apiFetch(token: string, endpoint: string, params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString()
    console.log(query)
    const res = await fetch(`${BASE_URL}/${endpoint}${query ? `?${query}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`Request failed: ${endpoint}`)
    const data = await res.json()
    console.log("data", data)
    return data.data ?? data
}

export async function getDashboardOverview(token: string, params: DashboardOverviewParams = {}): Promise<GetDashboardOverviewResult> {
    cacheLife("minutes")

    try {
        const data = await apiFetch(token, DASHBOARD_OVERVIEW_ENDPOINT, params as Record<string, string>)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load dashboard overview." }
    }
}

export async function getUpcomingEvents(token: string, params: UpcomingEventsParams = {}): Promise<GetUpcomingEventsResult> {
    cacheLife("minutes")

    try {
        const data = await apiFetch(token, HOST_UPCOMING_EVENTS_ENDPOINT, params as Record<string, string>)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load upcoming events." }
    }
}

export async function getDashboardFeed(token: string, params: DashboardFeedParams = {}): Promise<GetDashboardFeedResult> {
    cacheLife("minutes")

    try {
        const data = await apiFetch(token, DASHBOARD_FEED_ENDPOINT, params as Record<string, string>)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load dashboard feed." }
    }
}