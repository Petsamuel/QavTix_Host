"use server";

import { cookies } from "next/headers";
import { getDashboardOverview, getUpcomingEvents, getDashboardFeed } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getDashboardOverviewClient(params: DashboardOverviewParams = {}) {
    return getDashboardOverview(await getToken(), params);
}

export async function getUpcomingEventsClient(params: UpcomingEventsParams = {}) {
    return getUpcomingEvents(await getToken(), params);
}

export async function getDashboardFeedClient(params: DashboardFeedParams = {}) {
    return getDashboardFeed(await getToken(), params);
}
