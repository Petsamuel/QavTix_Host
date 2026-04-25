"use server"

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { EVENT_DELETE, EVENT_UPDATE, EVENTS_ENDPOINT, CUSTOMER_LIST_DOWNLOAD_ENDPOINT, EVENT_DETAILS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("host_access_token")?.value
}

function authHeaders(token?: string): Record<string, string> {
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

interface ActionResult {
    success: boolean
    message?: string
}

interface BulkActionParams {
    eventIds: string[]
}

export async function getEvents(
    params: GetEventsParams = {}
): Promise<GetEventsResult> {
    try {
        const token = await getToken()
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENTS_ENDPOINT}`)

        if (params.category != null) url.searchParams.set("category", String(params.category))
        if (params.end_date != null) url.searchParams.set("end_date", params.end_date)
        if (params.ordering != null) url.searchParams.set("ordering", params.ordering)
        if (params.page != null) url.searchParams.set("page", String(params.page))
        if (params.performance != null) url.searchParams.set("performance", params.performance)
        if (params.search != null) url.searchParams.set("search", params.search)
        if (params.start_date != null) url.searchParams.set("start_date", params.start_date)
        if (params.status != null) url.searchParams.set("status", params.status)

        const res = await fetch(url.toString(), {
            headers: authHeaders(token),
            cache: "force-cache",
            next: { tags: [CACHE_TAGS.EVENTS], revalidate: 500 },
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


interface GetEventDetailsResult {
    success: boolean
    data?: EventDetails
    message?: string
}

export async function getEventDetails(eventID: string): Promise<GetEventDetailsResult> {
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`

        const res = await fetch(url, {
            headers: authHeaders(token),
            cache: "force-cache",
            next: { tags: [`event-${eventID}`], revalidate: 500 },
        })

        const json = await res.json()
        if (!res.ok) {
            console.log("[getEventDetails] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }
        return { success: true, data: json.data ?? json }

    } catch (err) {
        console.log("[getEventDetails] error:", err)
        return { success: false, message: "Failed to load event details." }
    }
}


interface GetEditEventDetailsResult {
    success: boolean
    data?: EditEventDetails
    message?: string
}

export async function getEditEventDetails(eventID: string): Promise<GetEditEventDetailsResult> {
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)}`

        const res = await fetch(url, {
            headers: authHeaders(token),
            cache: "force-cache",
            // ✅ Separate tag from getEventDetails — prevents parallel write collision
            next: { tags: [`event-edit-${eventID}`], revalidate: 500 },
        })

        const json = await res.json()
        if (!res.ok) {
            console.log("[getEditEventDetails] status:", res.status, JSON.stringify(json))
            return { success: false, message: handleApiError(json) }
        }
        return { success: true, data: json.data ?? json }

    } catch (err) {
        console.log("[getEditEventDetails] error:", err)
        return { success: false, message: "Failed to load event details." }
    }
}


export async function deleteEvent(
    { eventId }: { eventId: string }
): Promise<ActionResult> {
    try {
        const token = await getToken()
        const endpoint = EVENT_DELETE.replace("[event_id]", eventId)

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
            { method: "DELETE", headers: authHeaders(token) }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        revalidateTag(CACHE_TAGS.EVENTS, "max")
        revalidateTag(`event-${eventId}`, "max")
        revalidateTag(`event-edit-${eventId}`, "max")

        return { success: true, message: "Event deleted successfully." }
    } catch (err) {
        console.error("[deleteEvent] error:", err)
        return { success: false, message: "Failed to delete event." }
    }
}


export async function updateEventStatus(
    { eventId, status }: { eventId: string; status: "active" | "draft" }
): Promise<ActionResult> {
    try {
        const token = await getToken()
        const endpoint = EVENT_UPDATE.replace("[event_id]", eventId)

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
            {
                method: "PATCH",
                headers: authHeaders(token),
                body: JSON.stringify({ event_status: status }),
            }
        )

        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            return { success: false, message: handleApiError(json) }
        }

        revalidateTag(CACHE_TAGS.EVENTS, "max")
        revalidateTag(`event-${eventId}`, "max")
        revalidateTag(`event-edit-${eventId}`, "max")

        const label = status === "active" ? "published" : "unpublished"
        return { success: true, message: `Event ${label} successfully.` }
    } catch (err) {
        console.error("[updateEventStatus] error:", err)
        return { success: false, message: "Failed to update event." }
    }
}


export async function cancelEvent(
    { eventId }: { eventId: string }
): Promise<ActionResult> {
    try {
        const token = await getToken()
        const endpoint = EVENT_UPDATE.replace("[event_id]", eventId)

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
            {
                method: "PATCH",
                headers: authHeaders(token),
                body: JSON.stringify({ event_status: "cancelled" }),
            }
        )

        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            return { success: false, message: handleApiError(json) }
        }

        revalidateTag(CACHE_TAGS.EVENTS, "max")
        revalidateTag(`event-${eventId}`, "max")
        revalidateTag(`event-edit-${eventId}`, "max")

        return { success: true, message: "Event cancelled successfully." }
    } catch (err) {
        console.error("[cancelEvent] error:", err)
        return { success: false, message: "Failed to update event." }
    }
}


export async function bulkDeleteEvents(
    { eventIds }: BulkActionParams
): Promise<ActionResult> {
    try {
        const token = await getToken()

        const results = await Promise.allSettled(
            eventIds.map((id) => {
                const endpoint = EVENT_DELETE.replace("[event_id]", id)
                return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
                    method: "DELETE",
                    headers: authHeaders(token),
                })
            })
        )

        const failed = results.filter(
            (r): r is PromiseRejectedResult | PromiseFulfilledResult<Response> =>
                r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)
        )

        revalidateTag(CACHE_TAGS.EVENTS, "max")

        if (failed.length === eventIds.length)
            return { success: false, message: "All deletions failed. Please try again." }
        if (failed.length > 0)
            return { success: true, message: `${eventIds.length - failed.length} of ${eventIds.length} events deleted. ${failed.length} failed.` }

        return { success: true, message: `${eventIds.length} event${eventIds.length > 1 ? "s" : ""} deleted successfully.` }
    } catch (err) {
        console.error("[bulkDeleteEvents] error:", err)
        return { success: false, message: "A network error occurred." }
    }
}


export async function bulkCancelEvents(
    { eventIds }: BulkActionParams
): Promise<ActionResult> {
    try {
        const token = await getToken()

        const results = await Promise.allSettled(
            eventIds.map((id) => {
                const endpoint = EVENT_UPDATE.replace("[event_id]", id)
                return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
                    method: "PATCH",
                    headers: authHeaders(token),
                    body: JSON.stringify({ event_status: "cancelled" }),
                })
            })
        )

        const failed = results.filter(
            (r): r is PromiseRejectedResult | PromiseFulfilledResult<Response> =>
                r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)
        )

        revalidateTag(CACHE_TAGS.EVENTS, "max")

        if (failed.length === eventIds.length)
            return { success: false, message: "All cancellations failed. Please try again." }
        if (failed.length > 0)
            return { success: true, message: `${eventIds.length - failed.length} of ${eventIds.length} events cancelled. ${failed.length} failed.` }

        return { success: true, message: `${eventIds.length} event${eventIds.length > 1 ? "s" : ""} cancelled successfully.` }
    } catch (err) {
        console.error("[bulkCancelEvents] error:", err)
        return { success: false, message: "Failed to cancel events." }
    }
}


export async function bulkUnpublishEvents(
    { eventIds }: BulkActionParams
): Promise<ActionResult> {
    try {
        const token = await getToken()

        const results = await Promise.allSettled(
            eventIds.map((id) => {
                const endpoint = EVENT_UPDATE.replace("[event_id]", id)
                return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`, {
                    method: "PATCH",
                    headers: authHeaders(token),
                    body: JSON.stringify({ event_status: "draft" }),
                })
            })
        )

        const failed = results.filter(
            (r): r is PromiseRejectedResult | PromiseFulfilledResult<Response> =>
                r.status === "rejected" || (r.status === "fulfilled" && !r.value.ok)
        )

        revalidateTag(CACHE_TAGS.EVENTS, "max")

        if (failed.length === eventIds.length)
            return { success: false, message: "All unpublish actions failed. Please try again." }
        if (failed.length > 0)
            return { success: true, message: `${eventIds.length - failed.length} of ${eventIds.length} events unpublished. ${failed.length} failed.` }

        return { success: true, message: `${eventIds.length} event${eventIds.length > 1 ? "s" : ""} unpublished successfully.` }
    } catch (err) {
        console.error("[bulkUnpublishEvents] error:", err)
        return { success: false, message: "Failed to unpublish events." }
    }
}


export async function getAttendeesExport(
    { eventId }: { eventId: string }
): Promise<{ success: boolean; message?: string; blob?: Blob }> {
    try {
        const token = await getToken()
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CUSTOMER_LIST_DOWNLOAD_ENDPOINT}`.replace("[event_id]", eventId)

        const res = await fetch(url, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })

        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            return { success: false, message: handleApiError(json) || "Failed to export attendees." }
        }

        const blob = await res.blob()
        return { success: true, blob }
    } catch (err) {
        console.error("[getAttendeesExport] error:", err)
        return { success: false, message: "Failed to download attendee list." }
    }
}


export async function bulkDownloadAttendees(
    { eventIds }: BulkActionParams
): Promise<ActionResult & { blobs?: Array<{ eventId: string; blob: Blob }> }> {
    try {
        const results = await Promise.allSettled(
            eventIds.map((id) => getAttendeesExport({ eventId: id }))
        )

        const blobs: Array<{ eventId: string; blob: Blob }> = []
        let failCount = 0

        results.forEach((r, i) => {
            if (r.status === "fulfilled" && r.value.success && r.value.blob) {
                blobs.push({ eventId: eventIds[i], blob: r.value.blob })
            } else {
                failCount++
            }
        })

        if (blobs.length === 0)
            return { success: false, message: "Failed to download any attendee lists." }

        const message = failCount > 0
            ? `${blobs.length} of ${eventIds.length} downloads succeeded. ${failCount} failed.`
            : `${blobs.length} attendee list${blobs.length > 1 ? "s" : ""} downloaded.`

        return { success: true, message, blobs }
    } catch (err) {
        console.error("[bulkDownloadAttendees] error:", err)
        return { success: false, message: "Failed to download attendee lists." }
    }
}