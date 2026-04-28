"use server";

import { cookies } from "next/headers";
import { getEvents, getEventDetails, getEditEventDetails, getAttendeesExport } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getEventsClient(params: GetEventsParams = {}) {
    return getEvents(await getToken(), params);
}

export async function getEventDetailsClient(eventID: string) {
    return getEventDetails(await getToken(), eventID);
}

export async function getEditEventDetailsClient(eventID: string) {
    return getEditEventDetails(await getToken(), eventID);
}

export async function getAttendeesExportClient({ eventId }: { eventId: string }) {
    return getAttendeesExport(await getToken(), { eventId });
}
