"use client"

import { useState } from "react"
import { logOut } from "@/actions/auth"

export function useLogOut() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogOut = async () => {
        if (isLoggingOut) return
        setIsLoggingOut(true)
        await logOut()
    }

    return { handleLogOut, isLoggingOut }
}