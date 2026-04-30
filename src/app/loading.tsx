"use client"

import { Icon } from "@iconify/react"

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[50vh] w-full">
            <Icon icon="svg-spinners:ring-resize" className="text-brand-primary-6 w-10 h-10" />
        </div>
    )
}
