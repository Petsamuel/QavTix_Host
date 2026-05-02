"use server";

import { accessCookieOptions, refreshCookieOptions } from "@/components-data/cookie-keys";
import { LOGIN_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"
import { getServerAxios } from "@/lib/axios"
import { cookies } from "next/headers";
import { redirect } from "next/navigation"

export const logOut = async () => {
    const cookiesStore = await cookies()

    cookiesStore.delete({
        name: "host_access_token",
        path: accessCookieOptions.path,
        ...("domain" in accessCookieOptions && { domain: accessCookieOptions.domain })
    })
    cookiesStore.delete({
        name: "host_refresh_token",
        path: refreshCookieOptions.path,
        ...("domain" in accessCookieOptions && { domain: refreshCookieOptions.domain })
    })

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
