"use server"

import { CACHE_TAGS } from "@/cache-tags"
import { CHECKIN_OVERVIEW_ENDPOINT, CHECKIN_ATTENDEES_ENDPOINT, CHECKIN_SCAN_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { cookies } from "next/headers"

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies()
    return cookieStore.get("access_token")?.value
}

export async function getCheckInMetrics(
    params: CheckInParams = {}
): Promise<GetCheckInResult> {
    try {
        const token = await getToken()
        const url   = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${CHECKIN_OVERVIEW_ENDPOINT}`)

        if (params.event) url.searchParams.set("event", params.event)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.CHECKIN] },
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
    params: CheckInParams = {}
): Promise<GetAttendeesResult> {
    try {
        const token = await getToken()
        const url   = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${CHECKIN_ATTENDEES_ENDPOINT}`)

        if (params.event)       url.searchParams.set("event",       params.event)
        if (params.page)        url.searchParams.set("page",        String(params.page))
        if (params.search)      url.searchParams.set("search",      params.search)
        if (params.status)      url.searchParams.set("status",      params.status)
        if (params.ticket_type) url.searchParams.set("ticket_type", String(params.ticket_type))

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            next: { tags: [CACHE_TAGS.CHECKIN] },
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
        const axios  = await getServerAxios()
        const { data } = await axios.post(CHECKIN_SCAN_ENDPOINT, { token })
        return { success: true, data: data.data }
    } catch (err: any) {
        console.error("[scanCheckIn]", err?.response?.data)
        // API never raises 4xx for bad scans — if we get here it's a real error
        return { success: false, message: handleApiError(err?.response?.data) }
    }
}