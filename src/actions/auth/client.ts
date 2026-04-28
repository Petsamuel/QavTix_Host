"use server";

import { cookies } from "next/headers";
import { getHostProfile } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getHostProfileClient() {
    return getHostProfile(await getToken());
}
