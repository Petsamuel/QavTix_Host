"use server";

import { cookies } from "next/headers";
import { getFinancials, getPayoutAccounts } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getFinancialsClient(params: FinancialsParams = {}) {
    return getFinancials(await getToken(), params);
}

export async function getPayoutAccountsClient() {
    return getPayoutAccounts(await getToken());
}
