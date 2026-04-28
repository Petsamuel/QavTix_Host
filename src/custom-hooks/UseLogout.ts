"use client"

import { useState } from "react"
import { logOut } from "@/actions/auth"
import { useAppDispatch } from "@/lib/redux/hooks"
import { clearUser } from "@/lib/redux/slices/authUserSlice"

export function useLogOut() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const dispatch = useAppDispatch()

    const handleLogOut = async () => {
        if (isLoggingOut) return
        setIsLoggingOut(true)
        dispatch(clearUser())
        await logOut()
        setIsLoggingOut(false)
        window.location.href = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/auth/signin`
    }

    return { handleLogOut, isLoggingOut }
}