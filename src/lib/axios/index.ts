"use server"

import axios from "axios"
import { cookies } from "next/headers"

export async function getServerAxios() {
    const appCookies = await cookies()
    const accessToken = appCookies.get("host_access_token")?.value

    return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
            "Content-Type":  "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
    })
}