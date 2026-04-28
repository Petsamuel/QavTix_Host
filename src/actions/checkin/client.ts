"use server";

import { cookies } from "next/headers";
import { getCheckInMetrics, getCheckInAttendees } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getCheckInMetricsClient(params: CheckInParams = {}) {
    return getCheckInMetrics(await getToken(), params);
}

export async function getCheckInAttendeesClient(params: CheckInParams = {}) {
    return getCheckInAttendees(await getToken(), params);
}
