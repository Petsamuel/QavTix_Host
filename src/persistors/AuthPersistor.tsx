"use client"

import { useEffect, useRef } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { clearUser, setUser } from "@/lib/redux/slices/authUserSlice"

export default function AuthPersistor({ userData }:{ userData: AuthUser | null }) {

    const dispatch = useAppDispatch()
    const didRun   = useRef(false)

    useEffect(() => {
        if (didRun.current) return
        didRun.current = true

        function hydrateUser() {
            if (userData?.user_id){
                dispatch(setUser(userData))
            }
            else {
                dispatch(clearUser())
            }
        }

        hydrateUser()
    }, [dispatch, userData?.user_id])

    return null
}