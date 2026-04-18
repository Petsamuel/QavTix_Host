'use client'

import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import FilterButtonsActions1 from './buttons-and-inputs/FilterActionButtons1'
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import { MobileBottomSheet } from '../../dropdown/EventFilterDropdownMobileBottomSheet'

const CHART_PRESETS: { label: string; value: ChartPreset }[] = [
    { label: 'This Week',  value: 'week'  },
    { label: 'This Month', value: 'month' },
    { label: 'This Year',  value: 'year'  },
]

interface ChartPresetFilterProps {
    value?:     ChartPreset | null
    onChange:   (value: ChartPreset | null) => void
    icon?:      string
    label?:     string
}

export default function ChartPresetFilter({
    value,
    onChange,
    icon,
    label = 'Frequency',
}: ChartPresetFilterProps) {

    const [isOpen,    setIsOpen]    = useState(false)
    const [selected,  setSelected]  = useState<ChartPreset | null>(value ?? null)
    const isTablet = useMediaQuery('(min-width: 768px)')

    const hasActiveFilter = !!value
    const displayText     = value
        ? CHART_PRESETS.find(p => p.value === value)?.label ?? label
        : label

    const handleApply = () => {
        onChange(selected)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelected(null)
        onChange(null)
        setIsOpen(false)
    }

    const filterContent = (
        <div className="flex flex-col gap-2">
            {CHART_PRESETS.map((preset) => (
                <button
                    key={preset.value}
                    type="button"
                    onClick={() => setSelected(preset.value)}
                    className={cn(
                        'w-full text-left px-4 py-2.5 rounded-lg text-xs font-medium transition-all',
                        selected === preset.value
                            ? 'bg-brand-primary-6 text-white shadow-sm'
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
            {/* Mobile View */}
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
                        title="Select Frequency"
                    >
                        <div className="flex flex-col gap-4">
                            {filterContent}
                            <FilterButtonsActions1
                                onApply={handleApply}
                                onClear={handleClear}
                            />
                        </div>
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet & Desktop View */}
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
                            'w-52 z-100 p-3 rounded-xl shadow-lg border-none',
                            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
                            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
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