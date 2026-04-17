'use client'

import { Dispatch, SetStateAction } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface ActiveFilterChipsProps {
    filters:    Partial<FilterValues>
    categories: Category[]                  // available categories — used to resolve label from id
    setFilters: Dispatch<SetStateAction<Partial<FilterValues>>>
    className?: string
}

export default function ActiveFilterChips({ filters, categories, setFilters, className }: ActiveFilterChipsProps) {

    const chips: { key: keyof FilterValues; value: string; label: string }[] = []

    // categories — only selected ones (filters.categories holds the selected IDs as strings)
    if (filters.categories?.length) {
        filters.categories.forEach(selectedId => {
            const match = categories.find(cat => cat.value === selectedId)
            chips.push({
                key:   'categories',
                value: selectedId,
                label: match?.label ?? selectedId,
            })
        })
    }

    // status — single value
    if (filters.status) {
        chips.push({ key: 'status', value: filters.status, label: filters.status })
    }


    if (filters.purchaseDate) {
        chips.push({ key: 'purchaseDate', value: filters.purchaseDate.toLocaleDateString(), label: filters.purchaseDate.toLocaleDateString() })
    }

    // ticketType — array of strings
    if (filters.ticketType?.length) {
        filters.ticketType.forEach(type => {
            chips.push({ key: 'ticketType', value: type, label: type })
        })
    }

    if (!chips.length) return null

    const removeChip = (key: keyof FilterValues, value: string) => {
        setFilters(prev => {
            const current = prev[key]
            if (Array.isArray(current)) {
                return { ...prev, [key]: current.filter(v => v !== value) }
            }
            return { ...prev, [key]: null }
        })
    }

    const resetAll = () => {
        setFilters(prev => ({
            ...prev,
            categories: [],
            status:     null,
            ticketType: [],
            priceRange: undefined,
            dateRange:  undefined,
            purchaseDate: null
        }))
    }

    return (
        <div className={cn("flex flex-wrap items-center gap-2 mt-3", className)}>
            {chips.map(chip => (
                <span
                    key={`${chip.key}-${chip.value}`}
                    className="flex items-center gap-1.5 border border-brand-neutral-5 px-3 py-2 h-7 rounded-sm bg-brand-neutral-4 text-brand-neutral-7 text-xs font-medium capitalize"
                >
                    {chip.label}
                    <button
                        onClick={() => removeChip(chip.key, chip.value)}
                        className="text-brand-neutral-6 hover:text-brand-secondary-9 transition-colors"
                        aria-label={`Remove ${chip.label} filter`}
                    >
                        <Icon icon="mage:multiply" className="size-3" />
                    </button>
                </span>
            ))}

            <button
                onClick={resetAll}
                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors ml-1"
            >
                Reset Filters
                <Icon icon="mage:multiply" className="size-3" />
            </button>
        </div>
    )
}