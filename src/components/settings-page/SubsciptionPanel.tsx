"use client"

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { openPasswordModal } from "@/lib/redux/slices/passwordModalConfirmationSlice"
import { ToggleItem } from "@/components/custom-utils/inputs/CustomToggleItem"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { renewSubscription, toggleAutoRenew } from "@/actions/settings"
import { hostPricingData } from "@/components-data/pricing-plans"
import { usePricingCheckout } from "@/custom-hooks/PricingCheckoutContext"



const PLAN_ORDER: PlanSlug[] = ["standard", "pro", "enterprise"]

const PLAN_STATUS_STYLES: Record<SubscriptionStatus, string> = {
    active:    "bg-green-50  text-green-700  border-green-200",
    trialing:  "bg-blue-50   text-blue-700   border-blue-200",
    cancelled: "bg-neutral-100 text-neutral-500 border-neutral-200",
    expired:   "bg-red-50    text-red-600    border-red-200",
}

const PLAN_STATUS_LABEL: Record<SubscriptionStatus, string> = {
    active:    "Active",
    trialing:  "Trial",
    cancelled: "Cancelled",
    expired:   "Expired",
}

interface SubscriptionPanelProps {
    initialData:  SubscriptionData | null
    fetchError:   string | null
}

export default function SubscriptionPanel({ initialData, fetchError }: SubscriptionPanelProps) {
    
    const dispatch    = useAppDispatch()
    const router      = useRouter()
    const { subscribe } = usePricingCheckout()

    const [data,         setData]         = useState<SubscriptionData | null>(initialData)
    const [isRenewing,   setIsRenewing]   = useState(false)
    const [isTogglingAR, setIsTogglingAR] = useState(false)
    const [mounted,      setMounted]      = useState(false)

    useEffect(() => { setMounted(true) }, [])

    const { control } = useForm({
        defaultValues: { autoRenew: initialData?.auto_renew ?? false },
    })

    // Derived state
    const currentPlanSlug  = data?.plan_slug ?? "standard"
    const currentPlanIndex = PLAN_ORDER.indexOf(currentPlanSlug)
    const isHighestPlan    = currentPlanIndex === PLAN_ORDER.length - 1
    const isExpired        = data?.is_expired ?? false
    const isCancelled      = data?.status === "cancelled"
    const isActive         = data?.status === "active" || data?.status === "trialing"
    const canRenew         = isExpired || isCancelled
    const canUpgrade       = !isHighestPlan && isActive

    // Find the current plan from pricing data
    const currentPricingPlan = hostPricingData.plans.find(p => p.id === currentPlanSlug)
        ?? hostPricingData.plans[0]

    // Auto-renew toggle
    const handleAutoRenewToggle = useCallback(async () => {
        if (isTogglingAR || !data) return
        const newValue = !data.auto_renew
        setIsTogglingAR(true)

        // Optimistic update
        setData(prev => prev ? { ...prev, auto_renew: newValue } : prev)

        const result = await toggleAutoRenew(newValue)
        setIsTogglingAR(false)

        if (!result.success) {
            // Revert on failure
            setData(prev => prev ? { ...prev, auto_renew: !newValue } : prev)
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not update auto-renewal",
                description: result.message ?? "Please try again.",
            }))
        } else {
            dispatch(showAlert({
                variant:     "default",
                title:       "Auto-renewal updated",
                description: newValue
                    ? "Your subscription will automatically renew."
                    : "Auto-renewal has been disabled.",
            }))
            router.refresh()
        }
    }, [data, isTogglingAR, dispatch, router])

    // Renew
    const handleRenew = useCallback(async () => {
        if (isRenewing) return
        setIsRenewing(true)
        const result = await renewSubscription()
        setIsRenewing(false)

        dispatch(showAlert({
            variant:     result.success ? "default" : "destructive",
            title:       result.success ? "Subscription renewed" : "Renewal failed",
            description: result.success
                ? "Your subscription has been renewed successfully."
                : (result.message ?? "Please try again."),
        }))

        if (result.success) router.refresh()
    }, [isRenewing, dispatch, router])

    // Upgrade──
    const handleUpgrade = useCallback(() => {
        const nextPlan = hostPricingData.plans[currentPlanIndex + 1]
        if (!nextPlan) return
        subscribe(nextPlan)
    }, [currentPlanIndex, subscribe])

    // Cancel — opens password modal──
    const handleCancel = useCallback(() => {
        dispatch(openPasswordModal("cancel_plan"))
    }, [dispatch])

    if (!mounted) return null

    // Fetch error state
    if (fetchError || !data) {
        return (
            <main className="w-full pt-8 pb-16">
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <Icon icon="hugeicons:alert-02" className="w-7 h-7 text-red-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-brand-secondary-8">
                            Failed to load subscription
                        </p>
                        <p className="text-xs text-brand-neutral-6">
                            {fetchError ?? "Please refresh the page to try again."}
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    const expiresLabel = data.expires_at
        ? format(new Date(data.expires_at), "dd/MM/yyyy")
        : "—"

    const renewsLabel = data.auto_renew && data.expires_at
        ? `Your subscription will automatically renew on ${expiresLabel}`
        : `Your subscription expires on ${expiresLabel}`

    return (
        <main className="w-full pt-8 pb-16">
            <div className="space-y-12 max-w-4xl">

                {/* ── Auto-Renewal─ */}
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">
                            Subscription Renewal
                        </h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Control how your subscription is renewed
                        </p>
                    </header>
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                    <div className="w-full max-w-sm space-y-2">
                        <ToggleItem
                            control={control}
                            name="autoRenew"
                            label="Allow auto-renewal"
                            disabled={isTogglingAR}
                            onChange={handleAutoRenewToggle}
                        />
                        <p className="text-xs text-brand-neutral-6 pl-1">
                            {renewsLabel}
                        </p>
                    </div>
                </section>

                {/* ── Plan Status─ */}
                <section className="space-y-6">
                    <header>
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-bold text-brand-secondary-9">Status</h3>
                            <span className={cn(
                                "text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5",
                                PLAN_STATUS_STYLES[data.status]
                            )}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                {PLAN_STATUS_LABEL[data.status]}
                            </span>
                        </div>
                        <p className="text-sm text-brand-secondary-9 font-medium mt-1">
                            You are currently subscribed to the{" "}
                            <span className="font-bold">{data.plan.name}</span>
                        </p>
                    </header>
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                    {/* Plan card + features */}
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Pricing card — just the card shell, no feature list */}
                        <div className="w-full lg:w-72 shrink-0">
                            <div className={cn(
                                "rounded-[32px] p-[1.6px]",
                                currentPricingPlan.highlighted
                                    ? "bg-linear-to-br from-[#0052CC] via-[#FF7A21] to-[#6B7280]"
                                    : "border border-neutral-5 rounded-[32px]"
                            )}>
                                <div className="h-full p-3 bg-white rounded-[30px]">
                                    <div className={cn(
                                        "rounded-xl p-4 flex flex-col gap-4",
                                        currentPricingPlan.highlighted
                                            ? "bg-linear-to-br from-accent-6/20 to-secondary-6/20"
                                            : "bg-transparent"
                                    )}>
                                        <span className={cn(
                                            "text-sm font-medium w-fit px-3 py-1 rounded-full",
                                            currentPricingPlan.highlighted
                                                ? "bg-primary-1 text-secondary-9"
                                                : "bg-neutral-2 text-neutral-8"
                                        )}>
                                            {data.plan.name}
                                        </span>

                                        <div>
                                            <div className="flex items-baseline gap-1.5 flex-wrap">
                                                <span className="text-2xl font-bold text-secondary-9">
                                                    ₦{Number(
                                                        data.billing_cycle === "annual"
                                                            ? data.plan.annual_price
                                                            : data.plan.monthly_price
                                                    ).toLocaleString()}
                                                </span>
                                                <span className="text-sm text-neutral-7">
                                                    / {data.billing_cycle}
                                                </span>

                                                {/* Billing cycle badge */}
                                                <span className="flex items-center gap-0.5 text-[10px] font-medium rounded-full overflow-hidden border border-neutral-4">
                                                    <span className={cn(
                                                        "px-2 py-0.5",
                                                        data.billing_cycle === "monthly"
                                                            ? "bg-brand-accent-6 text-white"
                                                            : "text-neutral-6"
                                                    )}>
                                                        Monthly
                                                    </span>
                                                    <span className={cn(
                                                        "px-2 py-0.5",
                                                        data.billing_cycle === "annual"
                                                            ? "bg-brand-accent-6 text-white"
                                                            : "text-neutral-6"
                                                    )}>
                                                        Yearly
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-neutral-7 mt-4 mb-6 px-1">
                                        {currentPricingPlan.description}
                                    </p>

                                    {/* Upgrade CTA inside card */}
                                    {canUpgrade && (
                                        <button
                                            onClick={handleUpgrade}
                                            className="w-full py-4 rounded-4xl text-sm font-medium bg-primary-6 hover:bg-primary-7 text-white transition-all"
                                        >
                                            Upgrade
                                        </button>
                                    )}

                                    {isHighestPlan && isActive && (
                                        <div className="w-full py-3 rounded-4xl text-sm font-medium text-center bg-neutral-2 text-neutral-6">
                                            Highest Plan
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Feature list */}
                        <div className="flex-1 bg-white border border-brand-neutral-2 rounded-2xl p-6">
                            <ul className="columns-1 sm:columns-2 gap-x-8 space-y-0">
                                {currentPricingPlan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2.5 py-2 break-inside-avoid">
                                        <Icon
                                            icon="hugeicons:checkmark-circle-03"
                                            className="w-5 h-5 text-neutral-5 shrink-0 mt-0.5"
                                        />
                                        <span className="text-sm text-secondary-9 font-medium">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Actions─ */}
                <div className="flex items-center gap-4 flex-wrap">
                    {canRenew && (
                        <button
                            onClick={handleRenew}
                            disabled={isRenewing}
                            className={cn(
                                "flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all",
                                "bg-brand-primary-1 text-brand-primary-6 hover:bg-brand-primary-2",
                                "disabled:opacity-60 disabled:cursor-not-allowed"
                            )}
                        >
                            {isRenewing ? (
                                <Icon icon="eos-icons:three-dots-loading" className="w-5 h-5" />
                            ) : (
                                <>
                                    <span>Renew Subscription</span>
                                    <Icon icon="stash:arrow-right" className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    )}

                    {isActive && (
                        <button
                            onClick={handleCancel}
                            className={cn(
                                "px-8 py-4 rounded-full text-sm font-semibold transition-all",
                                "border border-neutral-4 text-neutral-7 hover:border-red-400 hover:text-red-500",
                            )}
                        >
                            Cancel Subscription
                        </button>
                    )}
                </div>

            </div>
        </main>
    )
}