"use server";

import { LOGIN_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { redirect } from "next/navigation"

export const logOut = async () => {
    const { cookies } = await import("next/headers")
    const cookiesStore = await cookies()
    cookiesStore.delete("host_access_token")
    cookiesStore.delete("host_refresh_token")
    redirect(process.env.NEXT_PUBLIC_APP_DOMAIN || "/")
}

export async function verifyPassword(
    email: string,
    password: string,
): Promise<{ success: boolean; message?: string }> {
    try {
        const axiosInstance = await getServerAxios()
        await axiosInstance.post(LOGIN_ENDPOINT, { email, password })
        return { success: true }
    } catch (error: any) {
        return { success: false, message: handleApiError(error?.response?.data) }
    }
}
