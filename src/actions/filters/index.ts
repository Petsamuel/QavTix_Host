import { CATEGORIES_ENDPOINT } from "@/endpoints"
import { CACHE_TAGS } from "@/cache-tags"
import { cacheTag } from "next/cache"

export interface ApiCategory {
    id: number
    name: string
}

export interface GetCategoriesResult {
    success: boolean
    data: ApiCategory[]
    message?: string
}

export async function getCategories(token: string | undefined): Promise<GetCategoriesResult> {
    'use cache';
    cacheTag(CACHE_TAGS.EVENTS);
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${CATEGORIES_ENDPOINT}`,
            {
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