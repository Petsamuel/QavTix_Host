"use client"

import { useCallback, useEffect, useRef } from "react"

// Module-level — lives outside React, shared across all hook instances
const revalidateCallbacks: Partial<Record<RevalidateTarget, Set<() => void>>> = {}

export function useRevalidate(target: RevalidateTarget) {
    const trigger = useCallback(() => {
        revalidateCallbacks[target]?.forEach(cb => cb())
        // Cross-tab sync using localStorage storage event
        if (typeof window !== "undefined") {
            localStorage.setItem(`qavtix-revalidate-${target}`, String(Date.now()))
        }
    }, [target])

    return { trigger }
}

export function useOnRevalidate(target: RevalidateTarget, cb: () => void) {
    const cbRef = useRef(cb)
    cbRef.current = cb

    useEffect(() => {
        if (!revalidateCallbacks[target]) {
            revalidateCallbacks[target] = new Set()
        }
        const handler = () => cbRef.current()
        revalidateCallbacks[target]!.add(handler)

        // Cross-tab storage listener
        const handleStorage = (e: StorageEvent) => {
            if (e.key === `qavtix-revalidate-${target}`) {
                cbRef.current()
            }
        }
        window.addEventListener("storage", handleStorage)

        return () => {
            revalidateCallbacks[target]?.delete(handler)
            window.removeEventListener("storage", handleStorage)
        }
    }, [target])
}