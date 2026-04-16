"use client"

import { Badge } from "@/components/ui/badge"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { motion, Variants } from "framer-motion"
import { useRef, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { usePricingCheckout } from "@/contexts/checkout/PricingCheckoutContext"


interface PricingCardProps {
    plan:  PricingPlan
    index: number
    canUpgrade: boolean,
    onUpgrade: () => void
}

// SHIMMER SHOWN WHILE LIVE EXCHANGE RATES ARE FETCHING
function PriceSkeleton() {
    return (
        <div className="flex items-baseline gap-2 animate-pulse">
            <Skeleton className="h-7 w-6 rounded-md" />
            <Skeleton className="h-7 w-24 rounded-md" />
            <Skeleton className="h-4 w-14 rounded-md" />
        </div>
    )
}


interface InlineBillingToggleProps {
    billingCycle:    "monthly" | "annual"
    setBillingCycle: (cycle: "monthly" | "annual") => void
}

const InlineBillingToggle = ({ billingCycle, setBillingCycle }: InlineBillingToggleProps) => {
    const { status } = usePricingCheckout()
    const isDisabled = status === "processing"

    return (
        <div className="flex items-center gap-1 bg-transparent border border-brand-neutral-7 rounded-full p-0.5">
            <button
                onClick={() => setBillingCycle("monthly")}
                disabled={isDisabled}
                className={cn(
                    "text-[11px] font-medium px-2.5 py-1 rounded-full transition-all",
                    billingCycle === "monthly"
                        ? "bg-brand-accent-6 text-white shadow-sm"
                        : "text-brand-neutral-7 hover:text-brand-secondary-9",
                    isDisabled && "cursor-not-allowed opacity-50"
                )}
            >
                Monthly
            </button>
            <button
                onClick={() => setBillingCycle("annual")}
                disabled={isDisabled}
                className={cn(
                    "text-[11px] font-medium px-2.5 py-1 rounded-full transition-all",
                    billingCycle === "annual"
                        ? "bg-brand-accent-6 text-white shadow-sm"
                        : "text-brand-neutral-7 hover:text-brand-secondary-9",
                    isDisabled && "cursor-not-allowed opacity-50"
                )}
            >
                Yearly
            </button>
        </div>
    )
}

export default function PricingCard({ plan, index, onUpgrade, canUpgrade }: PricingCardProps) {

    const ref = useRef(null)
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

    const {
        status,
        processingPlanId,
        convertedPrice,
        isRatesLoading,
    } = usePricingCheckout()

    const isCustom = plan.price === 0 && plan.currency === "Custom"
    const isFree   = plan.price === 0 && !isCustom

    // THIS CARD IS THE ONE ACTIVELY RUNNING THE PAYSTACK FLOW
    const isThisCardProcessing = !!processingPlanId

    // ALL OTHER CARDS ARE DISABLED WHILE ANY PAYMENT IS IN FLIGHT
    const isAnyProcessing = status === "processing"
    const isDisabled      = isAnyProcessing && !isThisCardProcessing 

    // ANNUAL: 10 MONTHS BILLED, 2 MONTHS FREE
    const displayPrice = billingCycle === "annual" && !isFree && !isCustom
        ? plan.price * 10
        : plan.price

    const cardVariants: Variants = {
        hidden:  { opacity: 0, y: 60, scale: 0.95 },
        visible: {
            opacity: 1, y: 0, scale: 1,
            transition: {
                duration: 0.6,
                delay:    index * 0.15,
                ease:     [0.25, 0.46, 0.45, 0.94] as const,
            },
        },
    }


    const renderPrice = () => {
        if (isCustom) {
            return (
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={`${space_grotesk.className} text-3xl font-medium text-brand-secondary-9`}>
                        Enterprise
                    </span>
                </div>
            )
        }

        if (isFree) {
            return (
                <div className="flex items-center gap-3 flex-wrap">
                    <span className={`${space_grotesk.className} text-2xl font-medium text-brand-secondary-9`}>
                        Free
                    </span>
                </div>
            )
        }

        // PAID PLAN — SKELETON WHILE RATES LOAD, THEN PRICE + INLINE TOGGLE
        return (
            <div className="space-y-2">
                {isRatesLoading ? (
                    <PriceSkeleton />
                ) : (
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`${space_grotesk.className} text-2xl font-medium text-brand-secondary-9`}>
                            {convertedPrice(displayPrice)}
                        </span>
                        <span className="text-sm text-brand-neutral-7 shrink-0">
                            / {billingCycle === "annual" ? "year" : "month"}
                        </span>
                        <InlineBillingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
                    </div>
                )}
                {billingCycle === "annual" && !isRatesLoading && (
                    <p className="text-xs text-brand-primary-6 font-medium">
                        2 months free
                    </p>
                )}
            </div>
        )
    }

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={cn(isDisabled && "opacity-50 pointer-events-none")}
        >
            <div className={cn(
                "rounded-[32px] p-[1.6px] transition-all",
                 "bg-linear-to-br from-[#0052CC] via-[#FF7A21] to-[#6B7280]",
                !isDisabled && "hover:scale-105 ease-linear duration-200"
            )}>
                <div className={cn(
                    "h-full p-3 bg-white rounded-[30px]",
                    !plan.highlighted && "border border-neutral-5"
                )}>
                    <div className={cn(
                        "rounded-xl p-3 flex flex-col justify-between gap-6",
                        plan.highlighted
                            ? "bg-linear-to-br from-brand-accent-6/20 to-brand-secondary-6/20"
                            : "bg-transparent"
                    )}>
                        <Badge className={cn(
                            "text-sm font-medium w-fit",
                            plan.highlighted
                                ? "bg-brand-primary-1 text-brand-secondary-9"
                                : "bg-neutral-2 text-neutral-8"
                        )}>
                            {plan.name}
                        </Badge>

                        <div className="space-y-3">
                            {renderPrice()}
                        </div>
                    </div>

                    <p className="text-sm text-brand-neutral-7 mt-6 mb-9">
                        {plan.description}
                    </p>

                    <button
                        onClick={() => canUpgrade ? onUpgrade() : undefined}
                        disabled={isThisCardProcessing || isDisabled || !canUpgrade}
                        className={cn(
                            "w-full py-4 rounded-4xl text-sm font-medium transition-all",
                            "disabled:cursor-not-allowed",
                            plan.buttonVariant === "primary"
                                ? "bg-brand-primary-6 hover:bg-brand-primary-7 text-white disabled:bg-brand-primary-4"
                                : "bg-brand-secondary-6 hover:bg-brand-secondary-7 text-white disabled:bg-brand-secondary-4"
                        )}
                    >
                        {isThisCardProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <Icon icon="eos-icons:three-dots-loading" width="20" height="20" />
                                Processing...
                            </span>
                        ) : canUpgrade ? "Upgrade" : "Highest Plan"}
                    </button>
                </div>
            </div>
        </motion.div>
    )
}