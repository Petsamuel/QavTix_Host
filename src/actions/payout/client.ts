"use server";

import { cookies } from "next/headers";
import { getPaystackBanks, verifyAccountNumber } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getPaystackBanksClient(country: string = "nigeria") {
    return getPaystackBanks(await getToken(), country);
}

// verifyAccountNumber doesn't need a token (calls Paystack directly) — re-export as-is
export { verifyAccountNumber };
