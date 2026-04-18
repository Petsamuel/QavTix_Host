'use client'

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface SortOption {
    value: string
    label: string
    icon: string
    description: string
}

const sortOptions: SortOption[] = [
    { value: '-created_at',   label: 'Newest First',       icon: 'mdi:arrow-down',              description: 'Most recent events' },
    { value: 'created_at',    label: 'Oldest First',       icon: 'mdi:arrow-up',                description: 'Earliest events' },
    { value: 'title',         label: 'Name (A-Z)',         icon: 'mdi:sort-alphabetical-ascending', description: 'Alphabetically ascending' },
    { value: '-title',        label: 'Name (Z-A)',         icon: 'mdi:sort-alphabetical-descending', description: 'Alphabetically descending' },
    { value: '-start_datetime', label: 'Start Date (Soonest)', icon: 'mdi:calendar-clock',      description: 'Events starting soonest' },
    { value: 'start_datetime', label: 'Start Date (Latest)',  icon: 'mdi:calendar-clock-outline', description: 'Events starting later' },
]

interface SortByFilterProps {
    value?: string | null
    onChange: (ordering: string | null) => void
    icon: string
}

export function SortByFilter({ value, onChange, icon }: SortByFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState<string | null>(value || null)

    const handleSelect = (orderingValue: string) => {
        setSelectedValue(orderingValue)
        onChange(orderingValue)
        setIsOpen(false)
    }

    const handleReset = () => {
        const defaultOrdering = null
        setSelectedValue(defaultOrdering)
        onChange(defaultOrdering)
        setIsOpen(false)
    }

    const currentOption = sortOptions.find(opt => opt.value === selectedValue)

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText={currentOption?.label || "Sort By"}
                    hasActiveFilter={selectedValue !== null}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-72 p-2 rounded-4xl bg-white border border-brand-neutral-2 z-50 shadow-[0px_10px_30px_rgba(0,0,0,0.08)]",
                    // Matching your CategoryFilter animations
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2",
                    "data-[state=open]:duration-300 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-2"
                )}
            >

                <div className="space-y-1">
                    {sortOptions.map((option) => {
                        const isSelected = selectedValue === option.value
                        return (
                            <DropdownMenuItem
                                key={option.value}
                                onSelect={(e) => {
                                    e.preventDefault()
                                    handleSelect(option.value)
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer outline-none transition-all",
                                    isSelected 
                                        ? "bg-brand-primary-1/50" 
                                        : "hover:bg-brand-neutral-1 focus:bg-brand-neutral-1"
                                )}
                            >
                                <div className={cn(
                                    "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                    isSelected ? "bg-brand-primary-6 text-white" : "bg-brand-neutral-2 text-brand-neutral-6"
                                )}>
                                    <Icon icon={option.icon} className="size-4 text-inherit"  />
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <p className={cn(
                                        "text-xs font-medium truncate",
                                        isSelected ? "text-brand-primary-7" : "text-brand-neutral-8"
                                    )}>
                                        {option.label}
                                    </p>
                                    <p className="text-[10px] text-brand-neutral-7 leading-tight truncate">
                                        {option.description}
                                    </p>
                                </div>

                                {isSelected && (
                                    <Icon icon="solar:check-read-linear" className="size-4 text-brand-primary-6 shrink-0" />
                                )}
                            </DropdownMenuItem>
                        )
                    })}
                </div>

                {selectedValue !== null && (
                    <>
                        <DropdownMenuSeparator className="my-2 bg-brand-neutral-4" />
                        <button
                            onClick={handleReset}
                            className="w-full py-2 text-xs font-semibold text-brand-neutral-7 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Icon icon="solar:restart-bold" className="size-3" />
                            Reset to Default
                        </button>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}