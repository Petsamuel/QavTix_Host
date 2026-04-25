export type PlanType = "free" | "pro" | "enterprise"

export interface FeatureGate {
    key: string        // matches features.* key from API
    label: string
    requiredPlan: PlanType
}

export const FEATURE_GATES = {
    QR_CHECKIN: {
        key: "qr_checkin",
        label: "QR Check-In",
        requiredPlan: "pro",
    },
    AFFILIATE: {
        key: "affiliate",
        label: "Affiliate Dashboard",
        requiredPlan: "pro",
    },
    MARKETING_DASHBOARD: {
        key: "marketing_dashboard",
        label: "Marketing Dashboard",
        requiredPlan: "pro",
    },
    GEO_BREAKDOWN: {
        key: "geo_breakdown",
        label: "Geographic Breakdown",
        requiredPlan: "enterprise",
    },
    SPONSORED_CAMPAIGNS: {
        key: "sponsored_campaigns",
        label: "Sponsored Campaigns",
        requiredPlan: "enterprise",
    },
} satisfies Record<string, FeatureGate>

const PLAN_RANK: Record<PlanType, number> = { free: 0, pro: 1, enterprise: 2 }

export function hasAccess(userPlan: PlanType, requiredPlan: PlanType): boolean {
    return PLAN_RANK[userPlan] >= PLAN_RANK[requiredPlan]
}



export const ROLE_GATES = {
    HOST_ONLY: {
        key: "host_only",
        label: "Host Dashboard",
    },
} as const

export function isHost(user: { role?: string; verified?: boolean } | null | undefined): boolean {
    return !!user?.verified && user?.role === "host"
}