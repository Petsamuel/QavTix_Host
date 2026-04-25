"use server"

import { CACHE_TAGS } from "@/cache-tags"
import {
    DASHBOARD_FEED_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT,
    HOST_UPCOMING_EVENTS_ENDPOINT,
} from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("host_access_token")?.value
}

// Dashboard Overview

export async function getDashboardOverview(
    params: DashboardOverviewParams = {}
): Promise<GetDashboardOverviewResult> {
    try {
        const token = await getToken()

        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${DASHBOARD_OVERVIEW_ENDPOINT}`
        )

        if (params.year != null) url.searchParams.set("year", String(params.year))
        if (params.month != null) url.searchParams.set("month", String(params.month))
        if (params.week != null) url.searchParams.set("week", String(params.week))
        if (params.chart_type != null) url.searchParams.set("chart_type", params.chart_type)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.DASHBOARD_OVERVIEW] },
        })

        if (!res.ok) {
            const json = await res.json()
            console.error("[getDashboardOverview] status:", res.status, json)
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getDashboardOverview] error:", err)
        return { success: false, message: "Failed to load dashboard overview." }
    }
}


// Upcoming Events
export async function getUpcomingEvents(
    params: UpcomingEventsParams = {}
): Promise<GetUpcomingEventsResult> {
    try {
        const token = await getToken()

        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${HOST_UPCOMING_EVENTS_ENDPOINT}`
        )

        if (params.page != null) url.searchParams.set("page", String(params.page))
        if (params.search != null) url.searchParams.set("search", params.search)
        if (params.ordering != null) url.searchParams.set("ordering", params.ordering)
        if (params.status != null) url.searchParams.set("status", "active")
        if (params.category != null) url.searchParams.set("category", String(params.category))
        if (params.performance != null) url.searchParams.set("performance", params.performance)
        if (params.start_date != null) url.searchParams.set("start_date", params.start_date)
        if (params.end_date != null) url.searchParams.set("end_date", params.end_date)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.UPCOMING_EVENTS] },
        })

        if (!res.ok) {
            const json = await res.json()
            console.error("[getUpcomingEvents] status:", res.status, json)
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getUpcomingEvents] error:", err)
        return { success: false, message: "Failed to load upcoming events." }
    }
}



export async function getDashboardFeed(
    params: DashboardFeedParams = {}
): Promise<GetDashboardFeedResult> {
    try {
        const token = await getToken()

        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${DASHBOARD_FEED_ENDPOINT}`
        )

        if (params.mark_read != null) url.searchParams.set("mark_read", String(params.mark_read))
        if (params.page != null) url.searchParams.set("page", String(params.page))
        if (params.search != null) url.searchParams.set("search", params.search)
        if (params.ordering != null) url.searchParams.set("ordering", params.ordering)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            // mark_read mutates state on the server — skip cache when marking as read
            ...(params.mark_read
                ? { cache: "no-store" }
                : { next: { tags: [CACHE_TAGS.DASHBOARD_FEED] } }
            ),
        })

        if (!res.ok) {
            const json = await res.json()
            console.error("[getDashboardFeed] status:", res.status, json)
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getDashboardFeed] error:", err)
        return { success: false, message: "Failed to load dashboard feed." }
    }
}