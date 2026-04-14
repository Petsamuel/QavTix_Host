import { CACHE_TAGS } from "@/cache-tags"
import { GET_PROFILE_ENDPOINT } from "@/endpoints"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const accessToken = req.cookies.get("access_token")?.value
        
        if (!accessToken) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            )
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PROFILE_ENDPOINT}`, {
            method:  "GET",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            next: {
                tags: [CACHE_TAGS.PROFILE]
            }
        })

        const json : ProfileResponse = await res.json()

        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to fetch user" },
                { status: res.status }
            )
        }
        
        return NextResponse.json({ user: json.data }, { status: 200 })

    } catch {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}