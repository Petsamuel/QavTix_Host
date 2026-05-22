"use client"

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { setUser } from "@/lib/redux/slices/authUserSlice"
import { ToggleItem } from "@/components/custom-utils/inputs/CustomToggleItem"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { renewSubscription, toggleAutoRenew, getSubscriptionClient } from "@/actions/settings/client"
import { hostPricingData } from "@/components-data/pricing-plans"
import { usePricingCheckout } from "@/contexts/checkout/PricingCheckoutContext"
import { useOnRevalidate } from "@/custom-hooks/UseRevalidate"
import PricingCard from "../cards/PricingCard"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import PlanUpgradeSuccessMessage from "../modals/PlanUpgradeSuccessMessage"
import CancelSubscriptionModal from "../modals/CancelPlanModal"

const PLAN_ORDER: PlanSlug[] = ["standard", "pro", "enterprise"]

// Only paid plans can cancel — free/standard are excluded
const CANCELLABLE_PLANS: PlanSlug[] = ["pro", "enterprise"]

const PLAN_STATUS_STYLES: Record<SubscriptionStatus, string> = {
    active: "bg-green-50/50  text-green-700  border-green-200",
    trialing: "bg-blue-50/50   text-blue-700   border-blue-200",
    cancelled: "bg-neutral-100  text-neutral-500 border-neutral-200",
    expired: "bg-red-50/50    text-red-600    border-red-200",
}

const PLAN_STATUS_LABEL: Record<SubscriptionStatus, string> = {
    active: "Active",
    trialing: "Trial",
    cancelled: "Cancelled",
    expired: "Expired",
}

interface SubscriptionPanelProps {
    initialData: SubscriptionData | null
    fetchError: string | null
}

export default function SubscriptionPanel({ initialData, fetchError }: SubscriptionPanelProps) {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const { subscribe, status } = usePricingCheckout()

    const [data, setData] = useState<SubscriptionData | null>(initialData)
    const [isRenewing, setIsRenewing] = useState(false)
    const [isTogglingAR, setIsTogglingAR] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [openCancelSubModal, setCancelOpenSubModal] = useState(false)

    useEffect(() => { setMounted(true) }, [])

    const { control } = useForm({
        defaultValues: { autoRenew: initialData?.auto_renew ?? false },
    })

    const refreshProfile = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/profile")
            if (res.ok) {
                const { user } = await res.json()
                if (user) {
                    dispatch(setUser(user))
                }
            }
        } catch (error) {
            console.error("Failed to refresh profile:", error)
        }
    }, [dispatch])

    useOnRevalidate("subscription", async () => {
        const res = await getSubscriptionClient()
        if (res.success && res.data) {
            setData(res.data)
        }
        router.refresh()
    })

    useEffect(() => {
        if (initialData) {
            setData(initialData)
            refreshProfile()
        }
    }, [initialData, refreshProfile])

    // Derived state
    const currentPlanSlug = (data?.plan_slug === "free" ? "standard" : (data?.plan_slug ?? "standard")) as PlanSlug
    const currentPlanIndex = PLAN_ORDER.indexOf(currentPlanSlug)
    const isHighestPlan = currentPlanIndex === PLAN_ORDER.length - 1
    const isExpired = data?.is_expired ?? false
    const isCancelled = data?.status === "cancelled"
    const isActive = data?.status === "active" || data?.status === "trialing"
    const canRenew = isExpired || isCancelled
    const canUpgrade = !isHighestPlan
    const canCancel = isActive && CANCELLABLE_PLANS.includes(currentPlanSlug)

    const currentPricingPlan = hostPricingData.plans.find(p => p.id === currentPlanSlug)
        ?? hostPricingData.plans[0]

    const handleAutoRenewToggle = useCallback(async () => {
        if (isTogglingAR || !data) return
        const previousValue = data.auto_renew
        const newValue = !previousValue
        setIsTogglingAR(true)
        setData(prev => prev ? { ...prev, auto_renew: newValue } : prev)
        try {
            const result = await toggleAutoRenew(newValue)
            if (!result.success) throw new Error(result.message)
            dispatch(showAlert({ variant: "success", title: "Auto-renewal updated", description: newValue ? "Enabled." : "Disabled." }))
            router.refresh()
        } catch (error: any) {
            setData(prev => prev ? { ...prev, auto_renew: previousValue } : prev)
            dispatch(showAlert({ variant: "destructive", title: "Update failed", description: error.message ?? "Please try again." }))
        } finally {
            setIsTogglingAR(false)
        }
    }, [data, isTogglingAR, dispatch, router])

    const handleRenew = useCallback(async () => {
        if (isRenewing) return
        setIsRenewing(true)
        const result = await renewSubscription()
        setIsRenewing(false)
        dispatch(showAlert({
            variant: result.success ? "success" : "destructive",
            title: result.success ? "Subscription renewed" : "Renewal failed",
            description: result.success ? "Your subscription has been renewed successfully." : (result.message ?? "Please try again."),
        }))
        if (result.success) router.refresh()
    }, [isRenewing, dispatch, router])

    const handleUpgrade = useCallback(() => {
        const nextPlan = hostPricingData.plans[currentPlanIndex + 1]
        if (!nextPlan) return

        subscribe(nextPlan)
    }, [currentPlanIndex, currentPlanSlug, subscribe])

    const handleCancel = () => setCancelOpenSubModal(true)

    if (!mounted) return null

    if (fetchError || !data) {
        return (
            <main className="w-full pt-8 pb-16">
                <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                        <Icon icon="hugeicons:alert-02" className="w-7 h-7 text-red-400" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-brand-secondary-8">Failed to load subscription</p>
                        <p className="text-xs text-brand-neutral-6">{fetchError ?? "Please refresh the page to try again."}</p>
                    </div>
                </div>
            </main>
        )
    }

    const expiresLabel = data.expires_at ? format(new Date(data.expires_at), "dd/MM/yyyy") : "—"
    const renewsLabel = data.auto_renew && data.expires_at
        ? `Your subscription will automatically renew on ${expiresLabel}`
        : `Your subscription expires on ${expiresLabel}`

    return (
        <>
            {status === "success" && <PlanUpgradeSuccessMessage />}
            <main className="w-full pt-8 pb-16">
                <div className="space-y-12 max-w-4xl">

                    {/* Auto-Renewal */}
                    <section className="space-y-6">
                        <header>
                            <h3 className="text-base font-bold text-brand-secondary-9">Subscription Renewal</h3>
                            <p className="text-sm text-brand-secondary-9 font-medium">Control how your subscription is renewed</p>
                        </header>
                        <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                        {(() => {
                            const isFreePlan = data.plan_slug === 'free' || data.plan_slug === 'standard' || data.plan?.slug === 'free' || data.plan?.slug === 'standard'
                            return (
                                <div className={cn("w-full max-w-sm space-y-2", isFreePlan && "hidden")}>
                                    <ToggleItem
                                        control={control}
                                        name="autoRenew"
                                        label="Allow auto-renewal"
                                        disabled={isTogglingAR || isFreePlan}
                                        onChange={isFreePlan ? undefined : handleAutoRenewToggle}
                                    />
                                    <p className="text-xs text-brand-neutral-6 pl-1">
                                        {isFreePlan
                                            ? "Upgrade to a paid plan to enable auto-renewal"
                                            : renewsLabel}
                                    </p>
                                </div>
                            )
                        })()}

                    </section>

                    {/* Plan Status */}
                    <section className="space-y-6">
                        <header>
                            <div className="flex items-center gap-3">
                                <h3 className="text-base font-bold text-brand-secondary-9">Status</h3>
                                <span className={cn(
                                    "text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5",
                                    PLAN_STATUS_STYLES[data.status] || PLAN_STATUS_STYLES.active
                                )}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {PLAN_STATUS_LABEL[data.status] || PLAN_STATUS_LABEL.active}
                                </span>
                            </div>
                            <p className="text-sm text-brand-secondary-9 font-medium mt-1">
                                You are currently subscribed to the{" "}
                                <span className="font-bold">{currentPricingPlan.name}</span>
                            </p>
                            {isActive && data.plan_slug !== "standard" && data.plan_slug !== "free" && data.expires_at && (
                                <p className="text-xs text-brand-neutral-6 mt-1 flex items-center gap-1.5">
                                    <Icon icon="hugeicons:calendar-03" className="w-3.5 h-3.5" />
                                    <span>Plan {data.auto_renew ? "renews" : "expires"} on: <span className="font-semibold">{expiresLabel}</span></span>
                                </p>
                            )}
                        </header>
                        <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />

                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-[20em]">
                                <PricingCard
                                    plan={currentPricingPlan}
                                    index={currentPlanIndex}
                                    canUpgrade={canUpgrade}
                                    onUpgrade={handleUpgrade}
                                />
                            </div>
                            <div className="flex-1 bg-white border border-brand-neutral-2 rounded-2xl p-6">
                                <ul className="columns-1 sm:columns-2 gap-x-8 space-y-0">
                                    {currentPricingPlan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2.5 py-2 break-inside-avoid">
                                            <Icon icon="hugeicons:checkmark-circle-03" className="w-5 h-5 text-brand-neutral-5 shrink-0 mt-0.5" />
                                            <span className="text-xs text-brand-secondary-9 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 flex-wrap mt-8">
                    <ActionButton1
                        buttonText="Renew Subscription"
                        action={handleRenew}
                        isLoading={isRenewing}
                        isDisabled={!canRenew}
                        icon="stash:arrow-right"
                        iconPosition="right"
                        className="px-8 py-4 text-sm! font-semibold hover:bg-brand-primary-2 disabled:opacity-50!"
                    />

                    {/* Only visible for pro / enterprise on an active subscription */}
                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            className={cn(
                                "px-8 py-4 rounded-full text-sm font-semibold transition-all",
                                "border border-brand-neutral-8 text-brand-neutral-8 hover:border-red-400 hover:text-red-500",
                            )}
                        >
                            Cancel Subscription
                        </button>
                    )}
                </div>
            </main>

            {canCancel && (
                <CancelSubscriptionModal
                    isOpen={openCancelSubModal}
                    setIsOpen={setCancelOpenSubModal}
                    planSlug={currentPlanSlug as "pro" | "enterprise"}
                    expiresAt={data.expires_at}
                />
            )}
        </>
    )
}