'use client'

import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { formatDate } from '@/helper-fns/date-utils'
import { DateRange } from 'react-day-picker'
import { QuickDateButtons } from './buttons-and-inputs/QuickDateButtons'
import { EventSearchDateRangePicker } from './buttons-and-inputs/EventSearchDateRangePicker'
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import FilterButtonsActions1 from './buttons-and-inputs/FilterActionButtons1'
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import { MobileBottomSheet } from '../../dropdown/EventFilterDropdownMobileBottomSheet'


interface DateFilterProps {
    value?: DateRange | null
    onChange: (value: DateRange | null) => void,
    icon?: string
    label?: string
}

export default function DateFilter({ value, onChange, icon, label = "Date Range" }: DateFilterProps) {
    
    const [isOpen, setIsOpen] = useState(false)
    const isTablet = useMediaQuery('(min-width: 768px)')
    
    const [dateRange, setDateRange] = useState<DateRange>(
        value || { from: undefined, to: undefined }
    )

    const hasActiveFilter = value && (value?.from || value?.to)

    const displayText = (() => {
        if (!hasActiveFilter) return label
        if (value?.from && value?.to) {
            return `${formatDate(value.from, 'MMM dd')} - ${formatDate(value.to, 'MMM dd')}`
        }
        if (value?.from) {
            return formatDate(value.from, 'MMM dd, yyyy')
        }
        return label
    })()

    const handleApply = () => {
        onChange(dateRange.from || dateRange.to ? dateRange : null)
        setIsOpen(false)
    }

    const handleClear = () => {
        setDateRange({ from: undefined, to: undefined })
        onChange(null)
    }

    const handleQuickSelect = (range: DateRange) => {
        setDateRange(range)
    }

    const filterContent = (
        <>
            <QuickDateButtons
                selectedRange={dateRange}
                onSelect={handleQuickSelect}
            />

            <EventSearchDateRangePicker
                value={dateRange}
                onChange={setDateRange}
            />
        </>
    )

    return (
        <>
            {/* Mobile - Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn 
                        onClick={() => setIsOpen(true)}
                        displayText={displayText} 
                        hasActiveFilter={!!hasActiveFilter}
                        icon={icon}
                    />

                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Date"
                    >
                        {filterContent}
                        <FilterButtonsActions1
                            onApply={handleApply}
                            onClear={handleClear}
                        />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet - Dialog */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn 
                            displayText={displayText} 
                            hasActiveFilter={!!hasActiveFilter}
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