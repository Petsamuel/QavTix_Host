"use client"

import { useEffect } from "react"
import { Icon } from "@iconify/react"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error("Dashboard fetch error:", error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
            <div className="p-4 rounded-full bg-red-50">
                <Icon icon="mage:exclamation-circle" className="size-8 text-red-400" />
            </div>

            <div className="space-y-1 flex items-center justify-center flex-col">
                <h2 className="text-base capitalize font-semibold text-neutral-9">
                    {error?.message || "An unexpected error occurred"}
                </h2>
                <p className="text-sm text-secondary-4 max-w-xs">
                    Something went wrong while fetching your data. Please try again.
                </p>
            </div>

            <button
                onClick={reset}
                className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-7 active:scale-[0.98] transition-all"
            >
                Try again
            </button>
        </div>
    )
}