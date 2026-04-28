"use server";

import { cookies } from "next/headers";
import { getSalesAnalyticsCards, getSalesAnalyticsGraphs, getSalesAnalyticsTransaction } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getSalesAnalyticsCardsClient(params: SalesAnalyticsCardsParams = {}) {
    return getSalesAnalyticsCards(await getToken(), params);
}

export async function getSalesAnalyticsGraphsClient(params: SalesAnalyticsGraphsParams = {}) {
    return getSalesAnalyticsGraphs(await getToken(), params);
}

export async function getSalesAnalyticsTransactionClient(params: SalesAnalyticsGraphsParams = {}) {
    return getSalesAnalyticsTransaction(await getToken(), params);
}
