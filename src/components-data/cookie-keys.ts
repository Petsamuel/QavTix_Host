export const COOKIE_KEYS = {
    USER_CURRENCY: "user_currency",
    USER_REGION: "region",
} as const;


const isProd = process.env.NODE_ENV === 'production'

export const accessCookieOptions = {
    httpOnly: true,
    secure:   isProd,
    sameSite: 'strict' as const,
    path:     '/',
    maxAge:   60 * 60 * 10,
    ...(isProd && { domain: '.qavtix.com' }),
}