export async function getAuthToken(): Promise<string | undefined> {
    try {
        const res = await fetch("/api/auth/token")
        const data = await res.json()
        return data.token
    } catch (error) {
        console.error("Failed to get auth token:", error)
        return undefined
    }
}
