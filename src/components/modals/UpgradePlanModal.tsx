"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { hostPricingData } from "@/components-data/pricing-plans"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { usePricingCheckout } from "@/contexts/checkout/PricingCheckoutContext"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"


interface UpgradePlanModalProps {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    currentPlanSlug: PlanSlug
}


interface PlanOptionProps {
    plan: PricingPlan
    isSelected: boolean
    isCurrent: boolean
    onSelect: () => void
}

function PlanOption({ plan, isSelected, isCurrent, onSelect }: PlanOptionProps) {
    const { convertedPrice, isRatesLoading } = usePricingCheckout()
    const isFree = plan.price === 0

    return (
        <button
            type="button"
            onClick={onSelect}
            disabled={isCurrent}
            aria-pressed={isSelected}
            className={cn(
                "w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 focus:outline-none",
                isCurrent
                    ? "opacity-50 cursor-not-allowed border-brand-neutral-3 bg-brand-neutral-1"
                    : isSelected
                        ? "border-brand-primary-6 bg-brand-primary-1/30 shadow-md"
                        : "border-brand-neutral-3 bg-white hover:border-brand-primary-4 hover:bg-brand-primary-1/10",
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                            "text-sm font-bold",
                            isSelected ? "text-brand-primary-7" : "text-brand-secondary-9"
                        )}>
                            {plan.name}
                        </span>
                        {plan.highlighted && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-primary-6 text-white">
                                Popular
                            </span>
                        )}
                        {isCurrent && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-neutral-3 text-brand-neutral-7">
                                Current
                            </span>
                        )}
                        {plan.trial && !isCurrent && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                {plan.trial}
                            </span>
                        )}
                    </div>

                    <div className="mt-1">
                        {isRatesLoading ? (
                            <div className="h-5 w-24 bg-brand-neutral-2 rounded animate-pulse" />
                        ) : (
                            <span className={cn(
                                space_grotesk.className,
                                "text-base font-semibold",
                                isSelected ? "text-brand-primary-7" : "text-brand-secondary-9"
                            )}>
                                {isFree ? "Free" : convertedPrice(plan.price)}
                                {!isFree && (
                                    <span className="text-xs font-normal text-brand-neutral-6 ml-1">/ month</span>
                                )}
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-brand-neutral-6 mt-1 leading-snug line-clamp-2">
                        {plan.description}
                    </p>
                </div>

                {/* Selection indicator */}
                <div className={cn(
                    "mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected && !isCurrent
                        ? "border-brand-primary-6 bg-brand-primary-6"
                        : "border-brand-neutral-4 bg-white"
                )}>
                    {isSelected && !isCurrent && (
                        <Icon icon="hugeicons:checkmark-circle-03" className="w-3 h-3 text-white" />
                    )}
                </div>
            </div>

            {/* Key features preview */}
            {!isCurrent && isSelected && (
                <ul className="mt-3 pt-3 border-t border-brand-primary-2 space-y-1.5">
                    {plan.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <Icon icon="hugeicons:checkmark-circle-03" className="w-3.5 h-3.5 text-brand-primary-6 shrink-0 mt-0.5" />
                            <span className="text-[11px] text-brand-secondary-7 leading-snug">{feature}</span>
                        </li>
                    ))}
                    {plan.features.length > 4 && (
                        <li className="text-[11px] text-brand-primary-6 font-medium pl-5.5">
                            +{plan.features.length - 4} more features
                        </li>
                    )}
                </ul>
            )}
        </button>
    )
}


export default function UpgradePlanModal({
    isOpen,
    setIsOpen,
    currentPlanSlug,
}: UpgradePlanModalProps) {

    const { subscribe, status } = usePricingCheckout()

    // Pre-select the next plan above the current one
    const currentIndex = hostPricingData.plans.findIndex(p => p.id === currentPlanSlug)
    const defaultSelection = hostPricingData.plans[currentIndex + 1] ?? hostPricingData.plans[hostPricingData.plans.length - 1]

    const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(defaultSelection)

    const isProcessing = status === "processing"

    const handleClose = () => {
        if (!isProcessing) setIsOpen(false)
    }

    const handleConfirm = async () => {
        if (!selectedPlan || isProcessing) return
        setIsOpen(false)
        await subscribe(selectedPlan)
    }

    // Only show plans above the current plan
    const upgradeOptions = hostPricingData.plans.filter(
        (_, idx) => idx > currentIndex
    )

    return (
        <AnimatedDialog
            open={isOpen}
            onOpenChange={open => { if (!open) handleClose() }}
            showCloseButton={!isProcessing}
            className="md:max-w-md p-0"
        >
            {/* Header */}
            <DialogHeader className="flex flex-col items-center text-center mb-2">
                <div className="w-12 h-12 rounded-full bg-brand-primary-1 flex items-center justify-center mb-3">
                    <Icon icon="game-icons:upgrade" className="w-6 h-6 text-brand-primary-6" />
                </div>
                <DialogTitle className={cn(space_grotesk.className, "text-xl font-bold text-brand-secondary-10")}>
                    Choose Your Plan
                </DialogTitle>
                <DialogDescription className="text-sm text-brand-secondary-6 max-w-xs mt-1">
                    Select the plan you'd like to upgrade to. You can switch between options below.
                </DialogDescription>
            </DialogHeader>

            {/* Plan options */}
            <div className="space-y-3 mt-4">
                {upgradeOptions.map(plan => (
                    <PlanOption
                        key={plan.id}
                        plan={plan}
                        isSelected={selectedPlan?.id === plan.id}
                        isCurrent={plan.id === currentPlanSlug}
                        onSelect={() => setSelectedPlan(plan)}
                    />
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
                <button
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="w-full flex-1 h-12 md:h-14 rounded-full border border-brand-neutral-6 bg-white px-5 py-2.5 text-sm font-medium text-brand-secondary-8 hover:bg-brand-neutral-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>

                <ActionButton1
                    action={handleConfirm}
                    isDisabled={!selectedPlan || isProcessing}
                    isLoading={isProcessing}
                    buttonText="Upgrade"
                    buttonType="button"
                    className="w-full flex-1 h-12 text-sm!"
                    iconPosition="right"
                    icon="stash:arrow-right"
                />
            </div>
        </AnimatedDialog>
    )
}
