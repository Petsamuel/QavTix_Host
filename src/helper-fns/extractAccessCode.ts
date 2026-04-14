export function extractAccessCode(urlOrCode: string): string {
    try {
        const url = new URL(urlOrCode)
        return url.pathname.split('/').filter(Boolean).pop()!
    } catch {
        // Already a plain code, not a URL
        return urlOrCode
    }
}
