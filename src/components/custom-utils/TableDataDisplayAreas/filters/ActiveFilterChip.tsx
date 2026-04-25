'use client'

import { Dispatch, SetStateAction } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { useAppSelector } from '@/lib/redux/hooks'

interface ActiveFilterChipsProps {
    filters: Partial<FilterValues>
    categories?: Category[]
    setFilters: Dispatch<SetStateAction<Partial<FilterValues>>>
    className?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = (d: Date | string) => format(new Date(d), 'MMM d, yyyy')

const formatDateRange = (range?: { from?: Date | string; to?: Date | string } | null): string | null => {
    if (!range) return null
    if (range.from && range.to) return `${fmt(range.from)} – ${fmt(range.to)}`
    if (range.from) return `From ${fmt(range.from)}`
    if (range.to) return `Until ${fmt(range.to)}`
    return null
}

const formatPriceRange = (range?: { min?: number; max?: number } | null, prefix = ''): string | null => {
    if (!range) return null
    if (range.min != null && range.max != null) return `${prefix}${range.min} – ${prefix}${range.max}`
    if (range.min != null) return `${prefix}Min ${range.min}`
    if (range.max != null) return `${prefix}Max ${range.max}`
    return null
}

const DATE_PRESET_LABELS: Record<string, string> = {
    day: 'Today',
    week: 'This Week',
    month: 'This Month',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ActiveFilterChips({
    filters,
    categories = [],
    setFilters,
    className,
}: ActiveFilterChipsProps) {

    const chips: { key: keyof FilterValues; value: string; label: string }[] = []

    // categories — resolve label from id
    filters.categories?.forEach(selectedId => {
        const match = categories.find(c => c.value === selectedId)
        chips.push({ key: 'categories', value: selectedId, label: match?.label ?? selectedId })
    })

    // simple string / enum singles
    if (filters.status) chips.push({ key: 'status', value: filters.status, label: filters.status })
    if (filters.performance) chips.push({ key: 'performance', value: String(filters.performance), label: String(filters.performance) })
    // date ranges
    const dateRangeLabel = formatDateRange(filters.dateRange)

    if (dateRangeLabel) chips.push({ key: 'dateRange', value: dateRangeLabel, label: `Date: ${dateRangeLabel}` })

    // single date
    if (filters.purchaseDate) chips.push({ key: 'purchaseDate', value: filters.purchaseDate.toISOString(), label: `Purchase: ${fmt(filters.purchaseDate)}` })

    // date preset
    if (filters.dateRangePreset) {
        chips.push({
            key: 'dateRangePreset',
            value: filters.dateRangePreset,
            label: DATE_PRESET_LABELS[filters.dateRangePreset] ?? filters.dateRangePreset,
        })
    }

    // price / amount ranges
    const currency = useAppSelector(store => store.authUser.user?.currency)
    const priceRangeLabel = formatPriceRange(filters.priceRange, currency)

    if (priceRangeLabel) chips.push({ key: 'priceRange', value: priceRangeLabel, label: `Price: ${priceRangeLabel}` })

    if (!chips.length) return null

    const removeChip = (key: keyof FilterValues, value: string) => {
        setFilters(prev => {
            const current = prev[key]

            // arrays of primitives (categories, action, auditAction, ticketStatus)
            if (Array.isArray(current) && current.every(v => typeof v === 'string')) {
                return { ...prev, [key]: (current as string[]).filter(v => v !== value) }
            }

            // date ranges — clear the whole range object
            if (['dateRange', 'dateJoined', 'lastActivity', 'purchaseDateRange', 'withdrawalDate'].includes(key)) {
                return { ...prev, [key]: undefined }
            }

            // price / quantity ranges — clear the whole range object
            if (['priceRange', 'spendRange', 'amountRange', 'quantityRange'].includes(key)) {
                return { ...prev, [key]: null }
            }

            // everything else — null it out
            return { ...prev, [key]: null }
        })
    }

    const resetAll = () => {
        setFilters(prev => ({
            ...prev,
            categories: [],
            action: [],
            ticketStatus: [],
            ticketType: [],
            status: null,
            userStatus: null,
            transactionStatus: null,
            listingType: null,
            sortBy: null,
            sort: null,
            event: null,
            performance: null,
            walletBalance: null,
            spend: null,
            amount: null,
            revenue: null,
            numberOfEvents: null,
            priceRange: null,
            spendRange: null,
            amountRange: null,
            quantityRange: null,
            user: null,
            dateRangePreset: null,
            purchaseDate: null,
            dateRange: undefined,
            dateJoined: undefined,
            purchaseDateRange: undefined,
            withdrawalDate: undefined,
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