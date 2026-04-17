"use server"

import type { CompleteEventFormData } from "@/schemas/create-event.schema"
import { EVENT_CREATE }  from "@/endpoints"
import { handleApiError }   from "@/helper-fns/handleApiErrors"
import { cookies }          from "next/headers"
import { countries, getStates } from "@/components-data/location"
import { buildEventPayload } from "@/helper-fns/mapEventCreateData"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("access_token")?.value
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
}: {
    eventData: Partial<CompleteEventFormData>
}): Promise<{ success: boolean; message?: string; eventId?: string }> {
    try {
        const token = await getToken()
        const body  = buildEventPayload(eventData, "active")

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_CREATE}`,
            {
                method:  "POST",
                headers: authHeaders(token),
                body:    JSON.stringify(body),
            }
        )

        const json = await res.json().catch(() => ({}))

        console.log(json)

        if (!res.ok) {
            return { success: false, message: handleApiError(json) || "Failed to publish event." }
        }

        
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
}: {
    eventData:    Partial<CompleteEventFormData>
    scheduledAt?: string   // ISO string — only when scheduling for later
}): Promise<{ success: boolean; message?: string; eventId?: string }> {
    try {
        const token = await getToken()
        const body  = {
            ...buildEventPayload(eventData, "draft"),
            ...(scheduledAt ? { scheduled_at: scheduledAt } : {}),
        }

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${EVENT_CREATE}`,
            {
                method:  "POST",
                headers: authHeaders(token),
                body:    JSON.stringify(body),
            }
        )

        const json = await res.json().catch(() => ({}))

        if (!res.ok) {
            return { success: false, message: handleApiError(json) || "Failed to save draft." }
        }

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