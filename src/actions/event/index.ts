"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { EVENTS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("access_token")?.value
}

export async function getEvents(
    params: GetEventsParams = {}
): Promise<GetEventsResult> {
    try {
        const token = await getToken()

        const url = new URL(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENTS_ENDPOINT}`
        )

        if (params.category    != null) url.searchParams.set("category",    String(params.category))
        if (params.end_date    != null) url.searchParams.set("end_date",    params.end_date)
        if (params.ordering    != null) url.searchParams.set("ordering",    params.ordering)
        if (params.page        != null) url.searchParams.set("page",        String(params.page))
        if (params.performance != null) url.searchParams.set("performance", params.performance)
        if (params.search      != null) url.searchParams.set("search",      params.search)
        if (params.start_date  != null) url.searchParams.set("start_date",  params.start_date)
        if (params.status      != null) url.searchParams.set("status",      params.status)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.EVENTS] },
        })

        if (!res.ok) {
            const json = await res.json()
            console.error("[getEvents] status:", res.status, json)
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getEvents] error:", err)
        return { success: false, message: "Failed to load events." }
    }
}



interface BulkActionParams {
    eventIds: string[]
}

interface BulkActionResult {
    success:  boolean
    message?: string
}

export async function bulkDeleteEvents(
    { eventIds }: BulkActionParams
): Promise<BulkActionResult> {
    try {
        const token = await getToken()

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENTS_ENDPOINT}bulk-delete/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ event_ids: eventIds }),
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }
    } catch (err) {
        console.error("[bulkDeleteEvents] error:", err)
        return { success: false, message: "Failed to delete events." }
    }
}

export async function bulkCancelEvents(
    { eventIds }: BulkActionParams
): Promise<BulkActionResult> {
    try {
        const token = await getToken()

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENTS_ENDPOINT}bulk-cancel/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ event_ids: eventIds }),
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }
    } catch (err) {
        console.error("[bulkCancelEvents] error:", err)
        return { success: false, message: "Failed to cancel events." }
    }
}

export async function bulkUnpublishEvents(
    { eventIds }: BulkActionParams
): Promise<BulkActionResult> {
    try {
        const token = await getToken()

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENTS_ENDPOINT}bulk-unpublish/`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ event_ids: eventIds }),
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        return { success: true }
    } catch (err) {
        console.error("[bulkUnpublishEvents] error:", err)
        return { success: false, message: "Failed to unpublish events." }
    }
}