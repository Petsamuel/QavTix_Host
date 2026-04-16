"use server"

import { CATEGORIES_ENDPOINT } from "@/endpoints"
import { getServerAxios } from "@/lib/axios"

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
        const axiosInstance = await getServerAxios()
        const { data } = await axiosInstance.get(CATEGORIES_ENDPOINT)
        return { success: true, data: data.data ?? [] }
    } catch {
        return { success: false, data: [] }
    }
}