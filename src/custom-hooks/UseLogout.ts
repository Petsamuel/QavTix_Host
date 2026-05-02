"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function useLogOut() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const router = useRouter()

    const handleLogOut = async () => {
        if (isLoggingOut) return
        setIsLoggingOut(true)

        await fetch("/api/auth/logout", { method: "POST" })

        setIsLoggingOut(false)
        window.location.href = process.env.NEXT_PUBLIC_APP_DOMAIN || "https://qavtix.com"

    }

    return { handleLogOut, isLoggingOut }
}