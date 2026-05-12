"use server";

import { CHECKIN_SCAN_ENDPOINT, CHECKIN_OVERVIEW_ENDPOINT, CHECKIN_ATTENDEES_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"

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

export async function getCheckInMetricsClient(params: CheckInParams = {}): Promise<GetCheckInResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${CHECKIN_OVERVIEW_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load check-in metrics." }
    }
}

export async function getCheckInAttendeesClient(params: CheckInParams = {}): Promise<GetAttendeesResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${CHECKIN_ATTENDEES_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load attendees." }
    }
}

