"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { CHECKIN_OVERVIEW_ENDPOINT, CHECKIN_ATTENDEES_ENDPOINT, CHECKIN_SCAN_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { cacheTag } from "next/cache";

export async function getCheckInMetrics(
    token: string | undefined, params: CheckInParams = {}
): Promise<GetCheckInResult> {
    'use cache';
    cacheTag(CACHE_TAGS.CHECKIN);
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${CHECKIN_OVERVIEW_ENDPOINT}`)

        if (params.event) url.searchParams.set("event", params.event)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getCheckInMetrics] error:", err)
        return { success: false, message: "Failed to load check-in metrics." }
    }
}

export async function getCheckInAttendees(
    token: string | undefined, params: CheckInParams = {}
): Promise<GetAttendeesResult> {
    'use cache';
    cacheTag(CACHE_TAGS.CHECKIN);
    try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${CHECKIN_ATTENDEES_ENDPOINT}`)

        if (params.event) url.searchParams.set("event", params.event)
        if (params.page) url.searchParams.set("page", String(params.page))
        if (params.search) url.searchParams.set("search", params.search)
        if (params.status) url.searchParams.set("status", params.status)
        if (params.ticket_type) url.searchParams.set("ticket_type", String(params.ticket_type))

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        console.error("[getCheckInAttendees] error:", err)
        return { success: false, message: "Failed to load attendees." }
    }
}

export async function scanCheckIn(token: string): Promise<ScanCheckInResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.post(CHECKIN_SCAN_ENDPOINT, { token })
        return { success: true, data: data.data }
    } catch (err: any) {
        console.error("[scanCheckIn]", err?.response?.data)
        // API never raises 4xx for bad scans — if we get here it's a real error
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}