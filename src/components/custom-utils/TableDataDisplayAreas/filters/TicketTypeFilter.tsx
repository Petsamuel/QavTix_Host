'use client'

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { Icon } from "@iconify/react"
import FilterButtonsActions1 from "./buttons-and-inputs/FilterActionButtons1"
import { cn } from "@/lib/utils"
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import { MobileBottomSheet } from "../../dropdown/EventFilterDropdownMobileBottomSheet"

interface TicketTypeOption {
    value: string
    label: string
    icon: string
    description: string
}

const ticketTypeOptions: TicketTypeOption[] = [
    {
        value: 'free',
        label: 'Free',
        icon: 'mdi:gift-outline',
        description: 'No cost to attend'
    },
    {
        value: 'paid',
        label: 'Paid',
        icon: 'mdi:currency-usd',
        description: 'Requires payment'
    },
    {
        value: 'donation',
        label: 'Donation',
        icon: 'mdi:hand-heart',
        description: 'Pay what you can'
    }
]

interface TicketTypeFilterProps {
    value?: string[]
    onChange: (value: string[]) => void
    icon?: string
    label?: string
}

export function TicketTypeFilter({ 
    value = [], 
    onChange, 
    icon, 
    label = "Ticket Type" 
}: TicketTypeFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const isTablet = useMediaQuery('(min-width: 768px)')
    const [selectedTypes, setSelectedTypes] = useState<string[]>(value)

    const hasActiveFilter = selectedTypes.length > 0

    const displayText = (() => {
        if (!hasActiveFilter) return label
        if (selectedTypes.length === 1) {
            return ticketTypeOptions.find(opt => opt.value === selectedTypes[0])?.label || label
        }
        return `${selectedTypes.length} selected`
    })()

    const handleToggle = (typeValue: string) => {
        setSelectedTypes((prev) =>
            prev.includes(typeValue)
                ? prev.filter((v) => v !== typeValue)
                : [...prev, typeValue]
        )
    }

    const handleApply = () => {
        onChange(selectedTypes)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelectedTypes([])
        onChange([])
    }

    const filterContent = (
        <div className="grid grid-cols-1 gap-3">
            {ticketTypeOptions.map((type) => {
                const isSelected = selectedTypes.includes(type.value)
                return (
                    <button
                        key={type.value}
                        onClick={() => handleToggle(type.value)}
                        className={cn(
                            'flex items-center gap-4 p-5 rounded-2xl border-2 transition-all',
                            isSelected
                                ? 'border-brand-primary-6 bg-linear-to-br from-primary-1 to-primary-2 shadow-md'
                                : 'border-neutral-3 hover:border-brand-primary-3 hover:bg-brand-neutral-1'
                        )}
                    >
                        <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                            isSelected ? 'bg-brand-primary-6' : 'bg-brand-neutral-2'
                        )}>
                            <Icon
                                icon={type.icon}
                                className={cn('w-6 h-6', isSelected ? 'text-white' : 'text-brand-neutral-7')}
                            />
                        </div>
                        <div className="flex-1 text-left">
                            <p className={cn('font-semibold', isSelected ? 'text-brand-primary-8' : 'text-brand-secondary-9')}>
                                {type.label}
                            </p>
                            <p className="text-sm text-brand-neutral-6">{type.description}</p>
                        </div>
                        {isSelected && (
                            <Icon icon="mdi:check-circle" className="w-6 h-6 text-brand-primary-6" />
                        )}
                    </button>
                )
            })}
        </div>
    )

    return (
        <>
            {/* Mobile - Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn 
                        onClick={() => setIsOpen(true)}
                        displayText={displayText} 
                        hasActiveFilter={hasActiveFilter}
                        icon={icon}
                    />

                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Ticket Type"
                    >
                        {filterContent}
                        <FilterButtonsActions1
                            onApply={handleApply}
                            onClear={handleClear}
                        />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet - Dropdown */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn 
                            displayText={displayText} 
                            hasActiveFilter={hasActiveFilter}
                            icon={icon}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className={cn(
                            "w-[25em] z-100! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
                            // Open animation
                            "data-[state=open]:animate-in",
                            "data-[state=open]:fade-in-0",
                            "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                            "data-[state=open]:zoom-in-90",
                            "data-[state=open]:slide-in-from-top-4",
                            // Close animation
                            "data-[state=closed]:animate-out",
                            "data-[state=closed]:fade-out-0",
                            "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
                            "data-[state=closed]:zoom-out-90",
                            "data-[state=closed]:slide-out-to-top-4"
                        )}
                        align="start"
                    >
                        <div className="space-y-6">
                            {filterContent}
                            <FilterButtonsActions1
                                onApply={handleApply}
                                onClear={handleClear}
                            />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}