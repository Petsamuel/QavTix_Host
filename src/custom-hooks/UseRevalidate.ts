"use client"

import { useCallback, useEffect, useRef } from "react"

// Module-level — lives outside React, shared across all hook instances
const revalidateCallbacks: Partial<Record<RevalidateTarget, Set<() => void>>> = {}

export function useRevalidate(target: RevalidateTarget) {
    const trigger = useCallback(() => {
        revalidateCallbacks[target]?.forEach(cb => cb())
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
        return () => { revalidateCallbacks[target]?.delete(handler) }
    }, [target])
}