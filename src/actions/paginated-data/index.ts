"use server"

import { getServerAxios } from "@/lib/axios"

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

export async function fetchPaginatedData<T>(params: FetchParams): Promise<FetchResult<T>> {
    try {
        const axiosInstance = await getServerAxios()

        const requestParams: Record<string, any> = {
            ...params.staticParams,
            ...params.filterParams,
            page: params.page,
            ...(params.search ? { search: params.search } : {}),
        }

        const endpoint = params.endpoint.startsWith('/') ? params.endpoint : `/${params.endpoint}`

        console.log(endpoint, requestParams)

        const { data } = await axiosInstance.get(endpoint, { params: requestParams })

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
        console.log("[fetchPaginatedData] status :", err?.response?.status)
        console.log("[fetchPaginatedData] url    :", err?.config?.baseURL + err?.config?.url)
        console.log("[fetchPaginatedData] params :", JSON.stringify(err?.config?.params))
        console.log("[fetchPaginatedData] body   :", JSON.stringify(err?.response?.data))
        return { success: false, results: [], count: 0, next: null, message: "Request failed" }
    }
}