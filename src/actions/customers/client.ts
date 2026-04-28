"use server";

import { cookies } from "next/headers";
import { getCustomers, getCustomerProfile, getAttendeesExport } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getCustomersClient(params: CustomersParams = {}) {
    return getCustomers(await getToken(), params);
}

export async function getCustomerProfileClient(params: CustomerProfileParams) {
    return getCustomerProfile(await getToken(), params);
}

export async function getAttendeesExportClient() {
    return getAttendeesExport(await getToken());
}
