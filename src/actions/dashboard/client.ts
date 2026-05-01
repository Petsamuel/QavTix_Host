"use server";

import { getServerAxios } from "@/lib/axios"
import {
    DASHBOARD_FEED_ENDPOINT,
    DASHBOARD_OVERVIEW_ENDPOINT,
    HOST_UPCOMING_EVENTS_ENDPOINT,
} from "@/endpoints"

export async function getDashboardOverview(params: DashboardOverviewParams = {}): Promise<GetDashboardOverviewResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${DASHBOARD_OVERVIEW_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load dashboard overview." }
    }
}

export async function getUpcomingEvents(params: UpcomingEventsParams = {}): Promise<GetUpcomingEventsResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${HOST_UPCOMING_EVENTS_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load upcoming events." }
    }
}

export async function getDashboardFeed(params: DashboardFeedParams = {}): Promise<GetDashboardFeedResult> {
    try {
        const axios = await getServerAxios()
        const { data } = await axios.get(`/${DASHBOARD_FEED_ENDPOINT}`, { params })
        return { success: true, data: data.data ?? data }
    } catch (err) {
        return { success: false, message: "Failed to load dashboard feed." }
    }
}
