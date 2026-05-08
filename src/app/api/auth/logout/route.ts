import { accessCookieOptions, refreshCookieOptions } from "@/components-data/cookie-keys"
import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ success: true })

    response.cookies.delete({ name: "host_access_token", path: accessCookieOptions.path, ...("domain" in accessCookieOptions && { domain: accessCookieOptions.domain }) })
    response.cookies.delete({ name: "host_refresh_token", path: refreshCookieOptions.path, ...("domain" in refreshCookieOptions && { domain: refreshCookieOptions.domain }) })

    return response
}