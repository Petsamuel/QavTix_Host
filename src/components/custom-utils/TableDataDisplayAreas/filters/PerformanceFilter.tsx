'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"

interface PerformanceFilterProps {
    value?: { min: number; max: number }
    onChange: (value: { min: number; max: number }) => void
    icon: string
}

export function PerformanceFilter({ value, onChange, icon }: PerformanceFilterProps) {

    
    const [isOpen, setIsOpen] = useState(false)
    const [range, setRange] = useState<[number, number]>(
        value ? [value.min, value.max] : [0, 100]
    )

    const performanceLevels = [
        { label: 'Low', value: [0, 30], color: 'bg-red-500' },
        { label: 'Mid', value: [30, 70], color: 'bg-amber-400' },
        { label: 'High', value: [70, 100], color: 'bg-green-500' }
    ] as const

    const handlePresetSelect = (min: number, max: number) => {
        setRange([min, max])
        onChange({ min, max })
    }

    const handleSliderChange = (val: number[]) => {
        const newRange: [number, number] = [val[0], val[1]]
        setRange(newRange)
    }

    const handleSliderCommit = (val: number[]) => {
        onChange({ min: val[0], max: val[1] })
    }

    const handleReset = () => {
        const defaultRange: [number, number] = [0, 100]
        setRange(defaultRange)
        onChange({ min: 0, max: 100 })
    }

    const hasActiveFilter = range[0] > 0 || range[1] < 100

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText="Performance"
                    onClick={() => setIsOpen(true)}
                    hasActiveFilter={hasActiveFilter}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-64 z-200! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)] bg-white border-brand-neutral-2",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
                )}
            >
                {/* Header */}
                <div className="mb-4">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-brand-neutral-5 mb-1">
                        Sale Performance
                    </p>
                    <div className="flex justify-between items-baseline">
                        <span className="text-[11px] text-brand-neutral-6">Target range</span>
                        <span className="text-xs font-bold text-brand-primary-9 bg-brand-primary-1 px-1.5 py-0.5 rounded">
                            {range[0]}% — {range[1]}%
                        </span>
                    </div>
                </div>

                {/* Performance Presets */}
                <div className="grid grid-cols-3 gap-1.5 mb-5">
                    {performanceLevels.map((level) => {
                        const isSelected = range[0] === level.value[0] && range[1] === level.value[1]
                        return (
                            <button
                                key={level.label}
                                onClick={() => handlePresetSelect(level.value[0], level.value[1])}
                                className={cn(
                                    "flex flex-col items-center gap-1 py-2 px-1 rounded-lg border transition-all outline-none",
                                    isSelected 
                                        ? "border-brand-primary-6 bg-brand-primary-1/30" 
                                        : "border-brand-neutral-2 hover:bg-brand-neutral-1"
                                )}
                            >
                                <div className={cn("size-1.5 rounded-full", level.color)} />
                                <span className="text-[10px] font-semibold text-brand-secondary-8">{level.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Custom Slider */}
                <div className="px-1 mb-4">
                    <Slider
                        value={range}
                        onValueChange={handleSliderChange}
                        onValueCommit={handleSliderCommit}
                        min={0}
                        max={100}
                        step={5}
                        className="my-4"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-brand-neutral-4 uppercase tracking-tighter">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Footer Action */}
                {hasActiveFilter && (
                    <>
                        <DropdownMenuSeparator className="bg-brand-neutral-2" />
                        <button
                            onClick={handleReset}
                            className="w-full pt-3 text-center text-[11px] font-medium text-brand-neutral-5 hover:text-red-500 transition-colors"
                        >
                            Reset to default (0-100%)
                        </button>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}