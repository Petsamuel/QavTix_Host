"use client"

import { useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import { isHost } from "@/lib/features/plan-gate"

export function useHostGate() {
    const user = useAppSelector(s => s.authUser.user)
    const allowed = isHost(user)
    const [modalOpen, setModalOpen] = useState(!allowed)

    return { allowed, modalOpen, setModalOpen }
}