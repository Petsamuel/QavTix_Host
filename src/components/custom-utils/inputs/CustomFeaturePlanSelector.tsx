'use client'

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"

interface Plan {
    id:       string
    name:     string
    price:    number
    duration: string
    features: string[]
}

interface PlanSelectorProps {
    plans:          Plan[]
    selectedPlanId: string | null
    onSelect:       (planId: string) => void
    convertedPrice: (price: number) => string
}

export default function CustomFeaturePlanSelector({
    plans,
    selectedPlanId,
    onSelect,
    convertedPrice,
}: PlanSelectorProps) {
    return (
        <div className="space-y-2">
            {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id

                return (
                    <button
                        key={plan.id}
                        type="button"
                        onClick={() => onSelect(plan.id)}
                        className={cn(
                            "w-full text-left rounded-xl border-2 p-4 transition-all duration-150",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-4",
                            isSelected
                                ? "border-brand-primary-4 bg-brand-primary-1"
                                : "border-brand-neutral-3 bg-white hover:border-brand-neutral-4 hover:bg-brand-neutral-1"
                        )}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                                {/* Radio indicator */}
                                <span className={cn(
                                    "mt-0.5 shrink-0 size-4 rounded-full border-2 flex items-center justify-center transition-colors",
                                    isSelected
                                        ? "border-brand-primary-6 bg-brand-primary-6"
                                        : "border-brand-neutral-5 bg-white"
                                )}>
                                    {isSelected && <span className="size-1.5 rounded-full bg-white" />}
                                </span>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-brand-neutral-9">
                                                {plan.name}
                                            </p>
                                            <p className="text-xs text-brand-secondary-5 mt-0.5">
                                                {plan.duration}
                                            </p>
                                        </div>
                                        <span className={cn(
                                            space_grotesk.className,
                                            "text-sm font-black",
                                            isSelected ? "text-brand-primary-6" : "text-brand-secondary-8"
                                        )}>
                                            {convertedPrice(plan.price)}
                                        </span>
                                    </div>

                                    <ul className="mt-3 pt-3 border-t border-brand-neutral-2 space-y-1.5">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-xs text-brand-secondary-6">
                                                <Icon
                                                    icon="solar:check-circle-bold"
                                                    className={cn(
                                                        "size-3.5 shrink-0",
                                                        isSelected ? "text-brand-primary-6" : "text-brand-neutral-5"
                                                    )}
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </button>
                )
            })}
        </div>
    )
}