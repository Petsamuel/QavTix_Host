import { accessCookieOptions, refreshCookieOptions } from "@/components-data/cookie-keys"
import { NextResponse } from "next/server"

export async function POST() {
    const response = NextResponse.json({ success: true })

    // To reliably delete cookies in the browser, set them with maxAge: 0
    // (just calling .delete() can fail if the domain/path don't exactly match)
    response.cookies.set("host_access_token", "", {
        ...accessCookieOptions,
        maxAge: 0,
        expires: new Date(0),
    })
    response.cookies.set("host_refresh_token", "", {
        ...refreshCookieOptions,
        maxAge: 0,
        expires: new Date(0),
    })

    return response
}