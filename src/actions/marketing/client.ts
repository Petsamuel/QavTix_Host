"use server";

import { cookies } from "next/headers";
import { getPromoCodes, getAffiliateLinks, getEmailCampaigns } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getPromoCodesClient(params: {
    page?: number
    search?: string
    status?: string
    event?: string
} = {}) {
    return getPromoCodes(await getToken(), params);
}

export async function getAffiliateLinksClient(params: {
    page?: number
} = {}) {
    return getAffiliateLinks(await getToken(), params);
}

export async function getEmailCampaignsClient(params: {
    page?: number
} = {}) {
    return getEmailCampaigns(await getToken(), params);
}
