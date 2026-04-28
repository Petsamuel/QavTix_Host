"use server";

import { cookies } from "next/headers";
import { getCategories } from "./index";

async function getToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get("host_access_token")?.value;
}

export async function getCategoriesClient() {
    return getCategories(await getToken());
}
