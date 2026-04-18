'use client'

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { space_grotesk } from "@/lib/fonts"

interface Plan {
    id: string
    name: string
    price: number
    duration: string
    features: string[]
}

interface PlanSelectorProps {
    plans: Plan[]
    selectedPlanId: string | null
    onSelect: (planId: string) => void
    convertedPrice: (price: number) => string
}

export default function CustomFeaturePlanSelector({
    plans,
    selectedPlanId,
    onSelect,
    convertedPrice,
}: PlanSelectorProps) {

    const [isOpen, setIsOpen] = useState(false)
    const selectedPlan = plans.find(p => p.id === selectedPlanId)

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="w-full h-14 rounded-lg border border-brand-neutral-4 bg-brand-neutral-2 px-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-primary/20 hover:border-brand-neutral-5 transition-all">
                    <span className="text-sm text-brand-neutral-8">
                        {selectedPlan ? selectedPlan.name : "Choose a plan..."}
                    </span>
                    <Icon icon="lucide:chevron-down" className="w-4 h-4 text-brand-neutral-6" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent 
                align="start" 
                sideOffset={8}
                className="max-w-full w-[20em] bg-brand-neutral-3 z-999 p-4 rounded-2xl border border-brand-neutral-2 shadow-xl"
            >
                <RadioGroup value={selectedPlanId}>
                    {plans.map((plan) => {
                        const isSelected = selectedPlanId === plan.id

                        return (
                            <DropdownMenuItem
                                key={plan.id}
                                onSelect={() => {
                                    onSelect(plan.id)
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "p-0 focus:bg-transparent shadow-[0px_5.8px_23.17px_0px_#3326AE14] cursor-pointer border rounded-xl mb-1 last:mb-0",
                                    isSelected ? "bg-brand-primary-1 border-brand-primary-2 pointer-events-none" : "bg-white border-brand-neutral-2"
                                )}
                            >
                                <div className="w-full p-4 rounded-xl hover:bg-brand-neutral-1 transition-colors">
                                    <div className="flex items-baseline gap-2">
                                        <RadioGroupItem value={plan.id} checked={plan.id === selectedPlanId} className="text-brand-neutral-6 size-3 ring-1" />
                                        <div className="w-full">
                                            <div className="flex w-full items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-brand-neutral-9">
                                                        {plan.name}
                                                    </span>
                                                    <p className="text-xs text-brand-secondary-6">{plan.duration}</p>
                                                </div>

                                                <span className={cn(space_grotesk.className, "text-xs font-black text-brand-secondary-7")}>
                                                    {convertedPrice(plan.price)}
                                                </span>
                                            </div>

                                            <ul className="space-y-1.5 border-t border-brand-neutral-2/50 pt-3">
                                                {plan.features.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-xs text-brand-neutral-8">
                                                        <div className="size-1.5 rounded-full bg-brand-secondary-8 mt-1" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </DropdownMenuItem>
                        )
                    })}
                </RadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}