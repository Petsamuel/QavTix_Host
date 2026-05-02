import { CACHE_TAGS } from "@/cache-tags"
import {
    DASHBOARD_FEED_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT,
    HOST_UPCOMING_EVENTS_ENDPOINT,
} from "@/endpoints"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function apiFetch(token: string, endpoint: string, params: Record<string, string> = {}, tags?: string[]) {
    const query = new URLSearchParams(params).toString()
    const res = await fetch(`${BASE_URL}/${endpoint}${query ? `?${query}` : ""}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        next: { tags: [...(tags ?? [])], revalidate: 300 }
    })
    if (!res.ok) throw new Error(`Request failed: ${endpoint}`)
    const data = await res.json()
    return data.data ?? data
}

export async function getDashboardOverview(token: string, params: DashboardOverviewParams = {}): Promise<GetDashboardOverviewResult> {
    try {
        const data = await apiFetch(token, DASHBOARD_OVERVIEW_ENDPOINT, params as Record<string, string>, [CACHE_TAGS.DASHBOARD_OVERVIEW])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load dashboard overview." }
    }
}

export async function getUpcomingEvents(token: string, params: UpcomingEventsParams = {}): Promise<GetUpcomingEventsResult> {
    try {
        const data = await apiFetch(token, HOST_UPCOMING_EVENTS_ENDPOINT, params as Record<string, string>, [CACHE_TAGS.UPCOMING_EVENTS])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load upcoming events." }
    }
}

export async function getDashboardFeed(token: string, params: DashboardFeedParams = {}): Promise<GetDashboardFeedResult> {
    try {
        const data = await apiFetch(token, DASHBOARD_FEED_ENDPOINT, params as Record<string, string>, [CACHE_TAGS.DASHBOARD_FEED])
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load dashboard feed." }
    }
}