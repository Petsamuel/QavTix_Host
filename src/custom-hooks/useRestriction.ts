"use client"

/**
 * usePlanRestrictions
 *
 * Single source of truth for all plan-based feature gates in the create-event
 * flow.  Reads the authenticated user's plan slug from Redux, maps it onto the
 * plan feature set, and returns typed helpers that components can call.
 *
 * Backend also enforces these limits — the frontend guards are UX-only:
 * they show friendly errors before the user even tries to submit.
 */

import { useAppSelector } from "@/lib/redux/hooks"
import { useMemo } from "react"
import { useEventCreation } from "@/contexts/create-event/CreateEventProvider"


export interface PlanFeatures {
    affiliate: boolean
    qr_checkin: boolean
    promo_codes: boolean
    bulk_refunds: boolean
    geo_breakdown: boolean
    group_sharing: boolean
    revenue_chart: boolean
    week_analysis: boolean
    sales_insights: boolean
    email_campaigns: boolean
    fraud_detection: boolean
    resale_controls: boolean
    featured_listing: boolean
    max_ticket_types: number | null   // null = unlimited
    priority_support: boolean
    promo_code_limit: number          // 0 = disabled
    team_permissions: number          // 0 = disabled
    advanced_security: boolean
    dedicated_manager: boolean
    max_active_events: number | null   // null = unlimited
    marketing_dashboard: boolean
    sponsored_campaigns: boolean
    advanced_event_setup: boolean
    email_campaign_limit: number
    attendee_export_limit: number | null   // null = unlimited
    customer_profile_insights: boolean
    max_ticket_sales: number | null    // null = unlimited
    customize_sender_name: boolean
}

// ─── Static plan registry ─────────────────────────────────────────────────────
// This avoids an extra API call at form render time.  Update when plans change.

const PLAN_FEATURES: Record<string, PlanFeatures> = {
    free: {
        affiliate: false,
        qr_checkin: false,
        promo_codes: false,
        bulk_refunds: false,
        geo_breakdown: false,
        group_sharing: false,
        revenue_chart: false,
        week_analysis: false,
        sales_insights: true,
        email_campaigns: false,
        fraud_detection: true,
        resale_controls: false,
        featured_listing: false,
        max_ticket_types: 1,
        priority_support: false,
        promo_code_limit: 0,
        team_permissions: 0,
        advanced_security: false,
        dedicated_manager: false,
        max_active_events: 2,
        marketing_dashboard: false,
        sponsored_campaigns: false,
        advanced_event_setup: false,
        email_campaign_limit: 0,
        attendee_export_limit: 250,
        customer_profile_insights: false,
        max_ticket_sales: 750,
        customize_sender_name: false,
    },
    pro: {
        affiliate: true,
        qr_checkin: true,
        promo_codes: true,
        bulk_refunds: false,
        geo_breakdown: false,
        group_sharing: true,
        revenue_chart: false,
        week_analysis: false,
        sales_insights: true,
        email_campaigns: true,
        fraud_detection: true,
        resale_controls: false,
        featured_listing: false,
        max_ticket_types: null,
        priority_support: true,
        promo_code_limit: 100,
        team_permissions: 1,
        advanced_security: false,
        dedicated_manager: false,
        max_active_events: null,
        marketing_dashboard: true,
        sponsored_campaigns: false,
        advanced_event_setup: true,
        email_campaign_limit: 100,
        attendee_export_limit: 1000,
        customer_profile_insights: false,
        max_ticket_sales: 2500,
        customize_sender_name: true,
    },
    enterprise: {
        affiliate: true,
        qr_checkin: true,
        promo_codes: true,
        bulk_refunds: true,
        geo_breakdown: true,
        group_sharing: true,
        revenue_chart: true,
        week_analysis: true,
        sales_insights: true,
        email_campaigns: true,
        fraud_detection: true,
        resale_controls: true,
        featured_listing: true,
        max_ticket_types: null,
        priority_support: true,
        promo_code_limit: 300,
        team_permissions: 3,
        advanced_security: true,
        dedicated_manager: true,
        max_active_events: null,
        marketing_dashboard: true,
        sponsored_campaigns: true,
        advanced_event_setup: true,
        email_campaign_limit: 100,
        attendee_export_limit: null,
        customer_profile_insights: true,
        max_ticket_sales: 10000,
        customize_sender_name: true,
    },
}

// Fallback: treat unknown slugs as free-tier
const FREE_FEATURES = PLAN_FEATURES["free"]

// ─── Return type ──────────────────────────────────────────────────────────────

export interface PlanRestrictions {
    planSlug: string
    planName: string
    features: PlanFeatures

    // Ticket type helpers
    canAddTicketType: (currentCount: number) => boolean
    ticketTypeLimit: number | null
    ticketTypeLimitMsg: string | null   // null when not restricted

    // Promo code helpers
    canAddPromoCode: boolean
    promoCodeLimit: number          // 0 = disabled
    promoCodeLimitMsg: string | null   // null when not restricted

    // Feature flag helpers (true = allowed)
    canUseAffiliate: boolean
    canUseQrCheckin: boolean
    canUsePromoCodes: boolean
    canUseTeamPermissions: boolean

    // Upgrade prompt text (null when feature is available)
    upgradePromptFor: (feature: keyof PlanFeatures) => string | null

    // Ticket sales limit
    ticketSalesLimit: number | null
}


export function usePlanRestrictions(): PlanRestrictions {
    const planSlug: string = useAppSelector(
        (state) =>
            state.authUser?.user?.plan_type ??
            "free"
    )

    // Try to get dynamic plans from context
    let context: any = null
    try { context = useEventCreation() } catch (e) { /* ignore */ }
    const dynamicPlans = context?.plans

    return useMemo<PlanRestrictions>(() => {
        const slug = planSlug?.toLowerCase() ?? "free"
        let features = PLAN_FEATURES[slug] ?? FREE_FEATURES

        // Override with dynamic API data if available
        if (dynamicPlans && Array.isArray(dynamicPlans)) {
            const dynamicPlan = dynamicPlans.find((p: any) => p.slug?.toLowerCase() === slug)
            if (dynamicPlan?.features) {
                features = {
                    ...features,
                    ...dynamicPlan.features,
                    // Ensure max_ticket_sales is preserved or mapped correctly
                    max_ticket_sales: dynamicPlan.features.max_ticket_sales ?? features.max_ticket_sales
                }
            }
        }

        const planDisplayNames: Record<string, string> = {
            free: "Free",
            pro: "Pro",
            enterprise: "Enterprise",
        }

        const canAddTicketType = (currentCount: number): boolean => {
            if (features.max_ticket_types === null) return true
            return currentCount < features.max_ticket_types
        }

        const ticketTypeLimitMsg =
            features.max_ticket_types === null
                ? null
                : `Your current plan allows only ${features.max_ticket_types} ticket type${features.max_ticket_types === 1 ? "" : "s"}.`

        const promoCodeLimitMsg =
            features.promo_codes === false
                ? `Promo codes are not available on the ${planDisplayNames[slug] ?? slug} plan.`
                : features.promo_code_limit === 0
                    ? `Your plan does not include promo codes.`
                    : null

        const upgradePromptFor = (feature: keyof PlanFeatures): string | null => {
            const val = features[feature]
            if (val === true || val === null || (typeof val === "number" && val > 0)) return null

            const featureLabels: Partial<Record<keyof PlanFeatures, string>> = {
                affiliate: "Affiliate Program",
                qr_checkin: "QR Check-In",
                promo_codes: "Promo Codes",
                team_permissions: "Team Permissions",
                geo_breakdown: "Geo Breakdown",
                marketing_dashboard: "Marketing Dashboard",
                advanced_event_setup: "Advanced Event Setup",
                customer_profile_insights: "Customer Insights",
                resale_controls: "Resale Controls",
                revenue_chart: "Revenue Chart",
                week_analysis: "Weekly Analysis",
                customize_sender_name: "Customize Sender Name",
            }

            const label = featureLabels[feature] ?? String(feature).replace(/_/g, " ")
            return `${label} is not available on your current plan. Upgrade to access this feature.`
        }

        return {
            planSlug: slug,
            planName: planDisplayNames[slug] ?? slug,
            features,

            canAddTicketType,
            ticketTypeLimit: features.max_ticket_types,
            ticketTypeLimitMsg,

            canUsePromoCodes: features.promo_codes,
            promoCodeLimit: features.promo_code_limit,
            promoCodeLimitMsg,
            canAddPromoCode: features.promo_codes && features.promo_code_limit > 0,

            canUseAffiliate: features.affiliate,
            canUseQrCheckin: features.qr_checkin,
            canUseTeamPermissions: features.team_permissions > 0,

            upgradePromptFor,
            ticketSalesLimit: features.max_ticket_sales,
        }
    }, [planSlug])
}