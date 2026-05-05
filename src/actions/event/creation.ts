"use server"

import type { CompleteEventFormData } from "@/schemas/create-event.schema"
import { EVENT_CREATE } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { cookies } from "next/headers"
import { buildEventPayload } from "@/helper-fns/mapEventCreateData"
import { revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/cache-tags"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("host_access_token")?.value
}

function authHeaders(token?: string) {
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
}

// Publish

export async function publishEvent({
    eventData,
    media,
}: {
    eventData: Partial<CompleteEventFormData>
    media?: any[]
}): Promise<{ success: boolean; message?: string; eventId?: string }> {
    try {
        const token = await getToken()
        const body = buildEventPayload(eventData, "active", media)

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_CREATE}`,
            {
                method: "POST",
                headers: authHeaders(token),
                body: JSON.stringify(body),
            }
        )

        const json = await res.json().catch(() => ({}))

        if (!res.ok) {
            return { success: false, message: handleApiError(json) || "Failed to publish event." }
        }

        revalidateTag(CACHE_TAGS.EVENTS, 'max')

        return {
            success: true,
            message: "Event published successfully.",
            eventId: json.data?.id ?? json.id,
        }
    } catch (err) {
        console.error("[publishEvent] error:", err)
        return { success: false, message: "Failed to publish event." }
    }
}

// Save as Draft / Schedule

export async function saveEventAsDraft({
    eventData,
    scheduledAt,
    media,
}: {
    eventData: Partial<CompleteEventFormData>
    scheduledAt?: string
    media?: any[]
}): Promise<{ success: boolean; message?: string; eventId?: string }> {
    try {
        const token = await getToken()
        const body = {
            ...buildEventPayload(eventData, "draft", media),
            ...(scheduledAt ? { is_scheduled: true, scheduled_time: scheduledAt } : {}),
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_CREATE}`,
            {
                method: "POST",
                headers: authHeaders(token),
                body: JSON.stringify(body),
            }
        )

        const json = await res.json()


        if (!res.ok) {
            return { success: false, message: handleApiError(json) || "Failed to save draft." }
        }

        revalidateTag(CACHE_TAGS.EVENTS, 'max')

        return {
            success: true,
            message: scheduledAt ? "Event scheduled successfully." : "Draft saved successfully.",
            eventId: json.data?.id ?? json.id,
        }
    } catch (err) {
        console.error("[saveEventAsDraft] error:", err)
        return { success: false, message: "Failed to save draft." }
    }
}

// Update Functions

import { EVENT_UPDATE } from "@/endpoints"

export async function updateAndPublishEvent({
    eventId,
    eventData,
    media,
}: {
    eventId: string | number
    eventData: Partial<CompleteEventFormData>
    media?: any[]
}): Promise<{ success: boolean; message?: string }> {
    try {
        const token = await getToken()
        const body = buildEventPayload(eventData, "active", media)
        const endpoint = EVENT_UPDATE.replace("[event_id]", String(eventId))

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
            {
                method: "PATCH",
                headers: authHeaders(token),
                body: JSON.stringify(body),
            }
        )

        console.log(res)

        const json = await res.json().catch(() => ({}))

        if (!res.ok) {
            return { success: false, message: handleApiError(json) || "Failed to update event." }
        }

        revalidateTag(CACHE_TAGS.EVENTS, 'max')

        return {
            success: true,
            message: "Event updated and published successfully.",
        }
    } catch (err) {
        console.error("[updateAndPublishEvent] error:", err)
        return { success: false, message: "Failed to update event." }
    }
}

export async function updateEventAsDraft({
    eventId,
    eventData,
    scheduledAt,
    media,
}: {
    eventId: string | number
    eventData: Partial<CompleteEventFormData>
    scheduledAt?: string
    media?: any[]
}): Promise<{ success: boolean; message?: string; eventId?: string }> {
    try {
        const token = await getToken()
        const body = {
            ...buildEventPayload(eventData, "draft", media),
            ...(scheduledAt ? { is_scheduled: true, scheduled_time: scheduledAt } : {}),
        }
        const endpoint = EVENT_UPDATE.replace("[event_id]", String(eventId))

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
            {
                method: "PATCH",
                headers: authHeaders(token),
                body: JSON.stringify(body),
            }
        )

        const json = await res.json().catch(() => ({}))

        if (!res.ok) {
            return { success: false, message: handleApiError(json) || "Failed to update draft." }
        }

        revalidateTag(CACHE_TAGS.EVENTS, 'max')

        return {
            success: true,
            message: scheduledAt ? "Event updated and scheduled successfully." : "Draft updated successfully.",
            eventId: String(eventId)
        }
    } catch (err) {
        console.error("[updateEventAsDraft] error:", err)
        return { success: false, message: "Failed to update draft." }
    }
}

