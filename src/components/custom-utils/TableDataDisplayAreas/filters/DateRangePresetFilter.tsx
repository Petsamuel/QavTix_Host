'use client'

import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import FilterButtonsActions1 from './buttons-and-inputs/FilterActionButtons1'
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import { MobileBottomSheet } from '../../dropdown/EventFilterDropdownMobileBottomSheet'

const PRESETS: { label: string; value: DatePreset }[] = [
    { label: 'Today',      value: 'day'   },
    { label: 'This Week',  value: 'week'  },
    { label: 'This Month', value: 'month' },
]

interface DateRangePresetFilterProps {
    value?:    DatePreset | null
    onChange:  (value: DatePreset | null) => void
    icon?:     string
    label?:    string
}

export default function DateRangePresetFilter({
    value,
    onChange,
    icon,
    label = 'Date Preset',
}: DateRangePresetFilterProps) {

    const [isOpen,    setIsOpen]    = useState(false)
    const [selected,  setSelected]  = useState<DatePreset | null>(value ?? null)
    const isTablet = useMediaQuery('(min-width: 768px)')

    const hasActiveFilter = !!value
    const displayText     = value
        ? PRESETS.find(p => p.value === value)?.label ?? label
        : label

    const handleApply = () => {
        onChange(selected)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelected(null)
        onChange(null)
    }

    const filterContent = (
        <div className="flex flex-col gap-2">
            {PRESETS.map((preset) => (
                <button
                    key={preset.value}
                    onClick={() => setSelected(preset.value)}
                    className={cn(
                        'w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium transition-colors',
                        selected === preset.value
                            ? 'bg-brand-primary-6 text-white'
                            : 'text-brand-secondary-8 bg-brand-secondary-1 hover:bg-brand-neutral-3'
                    )}
                >
                    {preset.label}
                </button>
            ))}
        </div>
    )

    return (
        <>
            {/* Mobile */}
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
                        title="Date Range"
                    >
                        {filterContent}
                        <FilterButtonsActions1
                            onApply={handleApply}
                            onClear={handleClear}
                        />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet+ */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn
                            displayText={displayText}
                            hasActiveFilter={hasActiveFilter}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={cn(
                            'w-52 z-100! p-3 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]',
                            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
                            'data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]',
                            'data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4',
                            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
                            'data-[state=closed]:duration-400 data-[state=closed]:ease-in',
                            'data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4',
                        )}
                        align="start"
                    >
                        <div className="space-y-3">
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