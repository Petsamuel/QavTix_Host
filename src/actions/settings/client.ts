"use server";

import { cookies } from "next/headers";
import { getUserLocation, getPrivacySettings, getSubscription } from "./index";
import { initializeHostSubscription, verifyHostSubscription } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getUserLocationClient() {
    // getUserLocation no longer takes token — it reads Vercel IP headers
    return getUserLocation();
}

export async function getPrivacySettingsClient() {
    return getPrivacySettings(await getToken());
}

export async function getSubscriptionClient() {
    return getSubscription(await getToken());
}

// Mutation actions — re-exported directly (they use getServerAxios internally)
export { initializeHostSubscription, verifyHostSubscription };
