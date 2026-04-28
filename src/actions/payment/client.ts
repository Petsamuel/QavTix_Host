"use server";

import { cookies } from "next/headers";
import { getPaymentMethods, getPlans } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getPaymentMethodsClient() {
    return getPaymentMethods(await getToken());
}

export async function getPlansClient() {
    return getPlans(await getToken());
}
