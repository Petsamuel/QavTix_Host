import { useEffect, useState } from "react"

/**
 * Returns false on the server and during the first client render,
 * then flips to true after hydration is complete.
 *
 * Use this anywhere you need to read client-only state (Redux, localStorage,
 * cookies) without causing a server/client hydration mismatch.
 *
 * Pattern:
 *   const isMounted = useIsMounted()
 *   const value = isMounted ? clientValue : serverFallback
 */
export function useIsMounted(): boolean {
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => { setIsMounted(true) }, [])
    return isMounted
}