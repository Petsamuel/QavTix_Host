"use server";

import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"
import { EVENT_DELETE, EVENT_UPDATE, EVENT_DETAILS_ENDPOINT, EVENTS_ENDPOINT, CUSTOMER_LIST_DOWNLOAD_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { GetEventsResult, GetEventDetailsResult, GetEditEventDetailsResult } from "./index"

interface ActionResult {
    success: boolean
    message?: string
}

interface BulkActionParams {
    eventIds: string[]
}

export async function deleteEvent(
    { eventId }: { eventId: string }
): Promise<ActionResult> {
    try {
        const endpoint = EVENT_DELETE.replace("[event_id]", eventId)
        const axios = await getServerAxios()
        await axios.delete(`/${endpoint}`)

        revalidateTag(CACHE_TAGS.EVENTS, "max")
        revalidateTag(`event-${eventId}`, "max")
        revalidateTag(`event-edit-${eventId}`, "max")

        return { success: true, message: "Event deleted successfully." }
    } catch (err: any) {
        console.error("[deleteEvent] error:", err)
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function updateEventStatus(
    { eventId, status }: { eventId: string; status: "active" | "draft" }
): Promise<ActionResult> {
    try {
        const endpoint = EVENT_UPDATE.replace("[event_id]", eventId)
        const axios = await getServerAxios()
        await axios.patch(`/${endpoint}`, { event_status: status })

        revalidateTag(CACHE_TAGS.EVENTS, "max")
        revalidateTag(`event-${eventId}`, "max")
        revalidateTag(`event-edit-${eventId}`, "max")

        const label = status === "active" ? "published" : "unpublished"
        return { success: true, message: `Event ${label} successfully.` }
    } catch (err: any) {
        console.error("[updateEventStatus] error:", err)
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function cancelEvent(
    { eventId }: { eventId: string }
): Promise<ActionResult> {
    try {
        const endpoint = EVENT_UPDATE.replace("[event_id]", eventId)
        const axios = await getServerAxios()
        await axios.patch(`/${endpoint}`, { event_status: "cancelled" })

        revalidateTag(CACHE_TAGS.EVENTS, "max")
        revalidateTag(`event-${eventId}`, "max")
        revalidateTag(`event-edit-${eventId}`, "max")

        return { success: true, message: "Event cancelled successfully." }
    } catch (err: any) {
        console.error("[cancelEvent] error:", err)
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}

export async function bulkDeleteEvents(
    { eventIds }: BulkActionParams
): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await Promise.allSettled(
            eventIds.map((id) => {
                const endpoint = EVENT_DELETE.replace("[event_id]", id)
                return axios.delete(`/${endpoint}`)
            })
        )
        revalidateTag(CACHE_TAGS.EVENTS, "max")
        return { success: true, message: `${eventIds.length} event(s) processed.` }
    } catch (err) {
        return { success: false, message: "A network error occurred." }
    }
}

export async function bulkCancelEvents(
    { eventIds }: BulkActionParams
): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await Promise.allSettled(
            eventIds.map((id) => {
                const endpoint = EVENT_UPDATE.replace("[event_id]", id)
                return axios.patch(`/${endpoint}`, { event_status: "cancelled" })
            })
        )
        revalidateTag(CACHE_TAGS.EVENTS, "max")
        return { success: true, message: `${eventIds.length} event(s) processed.` }
    } catch (err) {
        return { success: false, message: "Failed to cancel events." }
    }
}

export async function bulkPublishEvents(
    { eventIds }: BulkActionParams
): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await Promise.allSettled(
            eventIds.map((id) => {
                const endpoint = EVENT_UPDATE.replace("[event_id]", id)
                return axios.patch(`/${endpoint}`, { event_status: "active" })
            })
        )
        revalidateTag(CACHE_TAGS.EVENTS, "max")
        return { success: true, message: `${eventIds.length} event(s) processed.` }
    } catch (err) {
        return { success: false, message: "Failed to publish events." }
    }
}

export async function bulkUnpublishEvents(
    { eventIds }: BulkActionParams
): Promise<ActionResult> {
    try {
        const axios = await getServerAxios()
        await Promise.allSettled(
            eventIds.map((id) => {
                const endpoint = EVENT_UPDATE.replace("[event_id]", id)
                return axios.patch(`/${endpoint}`, { event_status: "draft" })
            })
        )
        revalidateTag(CACHE_TAGS.EVENTS, "max")
        return { success: true, message: `${eventIds.length} event(s) processed.` }
    } catch (err) {
        return { success: false, message: "Failed to unpublish events." }
    }
}

export async function bulkDownloadAttendees(
    { eventIds }: BulkActionParams
): Promise<ActionResult & { files?: Array<{ eventId: string; content: string }> }> {
    try {
        const results = await Promise.allSettled(
            eventIds.map((id) => getAttendeesExport({ eventId: id }))
        )

        const files: Array<{ eventId: string; content: string }> = []
        results.forEach((r, i) => {
            if (r.status === "fulfilled" && r.value.success && r.value.content) {
                files.push({ eventId: eventIds[i], content: r.value.content })
            }
        })

        if (files.length === 0)
            return { success: false, message: "Failed to download any attendee lists." }

        return { success: true, message: `${files.length} attendee list(s) downloaded.`, files }
    } catch (err) {
        return { success: false, message: "Failed to download attendee lists." }
    }
}

export async function getEvents(params: GetEventsParams = {}): Promise<GetEventsResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${EVENTS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load events." }
    }
}

export async function getEventDetails(eventID: string): Promise<GetEventDetailsResult> {
    try {
        const endpoint = EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`)
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load event details." }
    }
}

export async function getEditEventDetails(eventID: string): Promise<GetEditEventDetailsResult> {
    try {
        const endpoint = EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${endpoint}`)
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load event details." }
    }
}

export async function getAttendeesExport({ eventId }: { eventId: string }): Promise<any> {
    try {
        const endpoint = CUSTOMER_LIST_DOWNLOAD_ENDPOINT.replace("[event_id]", eventId)
        const axios = await getServerAxios()
        const res = await axios.get(`/${endpoint}`, { responseType: 'text' })
        return { success: true, content: res.data }
    } catch (err) {
        return { success: false, message: "Failed to download attendee list." }
    }
}
