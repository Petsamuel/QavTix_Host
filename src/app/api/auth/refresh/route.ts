import { REFRESH_TOKEN_ENDPOINT } from "@/endpoints"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
    try {
        const refreshToken = req.cookies.get("refresh_token")?.value

        if (!refreshToken) {
            return NextResponse.json(
                { message: "No refresh token" },
                { status: 401 }
            )
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ refresh: refreshToken }),
        })

        const json = await res.json()

        if (!res.ok) {
            // Refresh token is invalid or expired — force re-login
            const response = NextResponse.json(
                { message: "Session expired, please sign in again" },
                { status: 401 }
            )
            response.cookies.delete("access_token")
            response.cookies.delete("refresh_token")
            return response
        }

        const isProd = process.env.NODE_ENV === "production"

        const response = NextResponse.json(
            { message: "Token refreshed" },
            { status: 200 }
        )

        // Set the new access token
        response.cookies.set("access_token", json.data.access, {
            httpOnly: true,
            secure:   isProd,
            sameSite: "strict",
            path:     "/",
            maxAge:   60 * 60 * 10,
            ...(isProd && { domain: ".qavtix.com" })
        })

        return response

    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}