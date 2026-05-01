"use cache"

import { cacheLife } from "next/cache"
import { EVENT_DETAILS_ENDPOINT, EVENTS_ENDPOINT } from "@/endpoints"

export interface GetEventsResult {
    success: boolean
    data?: EventsData
    message?: string
}

export interface GetEventDetailsResult {
    success: boolean
    data?: EventDetails
    message?: string
}

export interface GetEditEventDetailsResult {
    success: boolean
    data?: EditEventDetails
    message?: string
}

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

export async function getEvents(token: string, params: GetEventsParams = {}): Promise<GetEventsResult> {
    cacheLife("minutes")
    try {
        const data = await apiFetch(token, EVENTS_ENDPOINT, params)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load events." }
    }
}

export async function getEventDetails(token: string, eventID: string): Promise<GetEventDetailsResult> {
    cacheLife("minutes")
    try {
        const endpoint = EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)
        const data = await apiFetch(token, endpoint)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load event details." }
    }
}

export async function getEditEventDetails(token: string, eventID: string): Promise<GetEditEventDetailsResult> {
    cacheLife("minutes")
    try {
        const endpoint = EVENT_DETAILS_ENDPOINT.replace("[event_id]", eventID)
        const data = await apiFetch(token, endpoint)
        return { success: true, data }
    } catch {
        return { success: false, message: "Failed to load event details." }
    }
}