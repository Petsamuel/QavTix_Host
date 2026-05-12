import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { accessCookieOptions } from '@/components-data/cookie-keys'
import { REFRESH_TOKEN_ENDPOINT, TOKEN_VERIFY_ENDPOINT } from './endpoints'
import { NAVIGATION_LINKS } from './enums/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const HOST_LOGIN_URL = process.env.NEXT_PUBLIC_APP_DOMAIN ?? ''

const SKIP_PATHS = ['/api/auth', '/_next', '/favicon.ico']

const isSkippedPath = (pathname: string) =>
    SKIP_PATHS.some(p => pathname.startsWith(p))

const redirectToLogin = (requestUrl?: string) => {
    const loginUrl = new URL(HOST_LOGIN_URL + "/auth/signin/")
    if (requestUrl) {
        loginUrl.searchParams.set('returnTo', requestUrl)
    }
    const res = NextResponse.redirect(loginUrl)
    res.cookies.delete('host_access_token')
    res.cookies.delete('host_refresh_token')
    return res
}

/**
 * Decodes a JWT and checks if it's expired or close to expiring.
 * Returns true if expired or invalid.
 */
function isTokenExpiredLocally(token: string): boolean {
    try {
        const payloadBase64 = token.split('.')[1]
        if (!payloadBase64) return true

        // Use atob (standard in Edge/Browser) to decode the payload
        const decoded = JSON.parse(atob(payloadBase64))
        const exp = decoded.exp

        if (!exp) return true

        // Return true if token expires in less than 30 seconds
        const currentTime = Math.floor(Date.now() / 1000)
        return exp < (currentTime + 30)
    } catch {
        return true
    }
}


async function refreshAccessToken(
    refreshToken: string,
): Promise<{ success: true; accessToken: string } | { success: false; networkError: boolean }> {
    try {
        const res = await fetch(`${API_BASE_URL}/${REFRESH_TOKEN_ENDPOINT}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken }),
        })

        if (res.ok) {
            const { data } = await res.json()
            return { success: true, accessToken: data.access }
        }

        return { success: false, networkError: false }
    } catch {
        return { success: false, networkError: true }
    }
}

const hostAccessCookieOptions = {
    ...accessCookieOptions,
    domain: process.env.NEXT_PUBLIC_HOST_COOKIE_DOMAIN,
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const response = NextResponse.next()

    if (pathname === '/') {
        return NextResponse.redirect(new URL(NAVIGATION_LINKS.DASHBOARD.href, request.url))
    }

    if (isSkippedPath(pathname)) return response

    const accessToken = request.cookies.get('host_access_token')?.value
    const refreshToken = request.cookies.get('host_refresh_token')?.value

    if (!accessToken && !refreshToken) {
        return redirectToLogin(request.url)
    }

    // Access token exists and is still valid — fast path, no network call
    if (accessToken && !isTokenExpiredLocally(accessToken)) {
        return response
    }

    // Access token missing or expiring — try refresh
    if (refreshToken) {
        // Don't bother calling API if refresh token is also expired
        if (isTokenExpiredLocally(refreshToken)) {
            return redirectToLogin(request.url)
        }

        const result = await refreshAccessToken(refreshToken)

        if (result.success) {
            response.cookies.set('host_access_token', result.accessToken, hostAccessCookieOptions)
            return response
        }

        if (result.networkError) return response  // backend down — let them through

        return redirectToLogin(request.url)
    }

    return redirectToLogin(request.url)
}