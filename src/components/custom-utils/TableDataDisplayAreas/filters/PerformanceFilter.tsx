'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"

interface PerformanceFilterProps {
    value?: string | null
    onChange: (value: string | null) => void
    icon: string
}

const PERFORMANCE_OPTIONS = [
    { label: "Fully Booked", value: "fully_booked", color: "bg-emerald-500" },
    { label: "Almost Full", value: "almost_full", color: "bg-green-500" },
    { label: "Moderate Sales", value: "moderate_sales", color: "bg-amber-500" },
    { label: "Low Sales", value: "low_sales", color: "bg-orange-500" },
    { label: "No Sales", value: "no_sales", color: "bg-red-500" },
] as const

export function PerformanceFilter({ value, onChange, icon }: PerformanceFilterProps) {

    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (performanceValue: string) => {
        onChange(performanceValue)
        setIsOpen(false)
    }

    const handleReset = () => {
        onChange(null)
        setIsOpen(false)
    }

    const selectedOption = PERFORMANCE_OPTIONS.find(opt => opt.value === value)

    const hasActiveFilter = !!value

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText={selectedOption ? selectedOption.label : "Performance"}
                    hasActiveFilter={hasActiveFilter}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className="w-56 p-2 rounded-xl shadow-xl bg-white border border-brand-neutral-2 z-50"
            >
                <p className="text-[10px] uppercase tracking-wider font-bold text-brand-neutral-5 px-2 py-1.5">
                    Sale Performance
                </p>

                <div className="py-1">
                    {PERFORMANCE_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-lg hover:bg-brand-neutral-1 transition-colors text-left",
                                value === option.value && "bg-brand-primary-1 text-brand-primary-7 font-medium"
                            )}
                        >
                            <div className={cn("size-2.5 rounded-full shrink-0", option.color)} />
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>

                {hasActiveFilter && (
                    <>
                        <DropdownMenuSeparator className="my-1 bg-brand-neutral-2" />
                        <button
                            onClick={handleReset}
                            className="w-full px-3 py-2 text-center text-xs font-medium text-brand-neutral-5 hover:text-red-600 transition-colors"
                        >
                            Clear filter
                        </button>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}