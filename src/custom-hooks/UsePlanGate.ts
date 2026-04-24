"use client"

import { useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import { type FeatureGate, hasAccess, PlanType } from "@/lib/features/plan-gate"

export function usePlanGate(gate: FeatureGate) {
    const plan = useAppSelector(s => s.authUser.user?.plan_type) as PlanType ?? "free"

    const allowed = hasAccess(plan, gate.requiredPlan)
    const [modalOpen, setModalOpen] = useState(!allowed)

    return {
        allowed,
        modalOpen,
        setModalOpen,
        featureName: gate.label,
        requiredPlan: gate.requiredPlan,
    }
}