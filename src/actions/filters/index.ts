"use server"

import { CATEGORIES_ENDPOINT } from "@/endpoints"
import { CACHE_TAGS } from "@/cache-tags"
import { cookies } from "next/headers"

export interface ApiCategory {
    id:   number
    name: string
}

export interface GetCategoriesResult {
    success:    boolean
    data:       ApiCategory[]
    message?:   string
}

export async function getCategories(): Promise<GetCategoriesResult> {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("host_access_token")?.value

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`,
            {
                next: { revalidate: 60 * 60 * 6, tags: [CACHE_TAGS.EVENTS] },
                headers: { ...(token && { Authorization: `Bearer ${token}` }) },
            }
        )
        if (!res.ok) return { success: false, data: [] }
        const json = await res.json()
        return { success: true, data: json.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}