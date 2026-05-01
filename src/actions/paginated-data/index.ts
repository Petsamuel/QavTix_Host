'use server'

import { getAuthToken } from "@/helper-fns/getAuthToken"
import { handleApiError } from "@/helper-fns/handleApiErrors"

export interface FetchParams {
    endpoint:     string
    staticParams: Record<string, string>
    filterParams: Record<string, string | string[]>
    page:         number
    search:       string
    resultsKey?:  string 
}

export interface FetchResult<T, C = unknown> {
    success:      boolean
    results:      T[]
    count:        number
    next:         number | null
    total_pages?: number
    message?:     string
    cards?:       C
}

export async function fetchPaginatedData<T>(
    params: FetchParams
): Promise<FetchResult<T>> {
    try {

        const token = await getAuthToken()
        
        const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${params.endpoint.startsWith('/') ? params.endpoint.slice(1) : params.endpoint}`)

        // Add static params
        Object.entries(params.staticParams).forEach(([key, val]) => url.searchParams.set(key, val))
        
        // Add filter params
        Object.entries(params.filterParams).forEach(([key, val]) => {
            if (Array.isArray(val)) {
                val.forEach(v => url.searchParams.append(key, v))
            } else {
                url.searchParams.set(key, val)
            }
        })

        url.searchParams.set("page", String(params.page))
        if (params.search) url.searchParams.set("search", params.search)

        const res = await fetch(url.toString(), {
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            }
        })

        if (!res.ok) {
            const json = await res.json().catch(() => ({}))
            return { success: false, results: [], count: 0, next: null, message: handleApiError(json) }
        }

        const data = await res.json()
        const d = data.data ?? data
        const paginated = params.resultsKey ? d?.[params.resultsKey] : d

        return {
            success:     true,
            results:     paginated?.results    ?? [],
            count:       paginated?.count      ?? 0,
            next:        paginated?.next       ?? null,
            total_pages: paginated?.total_pages ?? undefined,
            cards:       d?.cards ?? undefined
        }
    } catch (err: any) {
        console.error("[fetchPaginatedData] error:", err)
        return { success: false, results: [], count: 0, next: null, message: "Request failed" }
    }
}