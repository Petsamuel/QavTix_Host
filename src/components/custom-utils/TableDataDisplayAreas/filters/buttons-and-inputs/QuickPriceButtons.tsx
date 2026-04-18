'use client'

import { cn } from '@/lib/utils'

interface QuickPriceButtonsProps {
  currency: string
  selectedMax: number
  onSelect: (value: number) => void
}

export function QuickPriceButtons({
  currency,
  selectedMax,
  onSelect,
}: QuickPriceButtonsProps) {
    const quickPrices = [
        { label: 'Free', value: 0 },
        { label: `${currency}5,000`, value: 5000 },
        { label: `${currency}10,000`, value: 10000 },
        { label: `${currency}20,000`, value: 20000 },
    ]

    return (
        <div className="flex flex-wrap gap-3">
            {quickPrices.map((price) => {
                const isSelected = 
                (price.value === 0 && selectedMax === 0) ||
                (price.value > 0 && selectedMax === price.value)

                return (
                <button
                    key={price.value}
                    onClick={() => onSelect(price.value)}
                    className={cn(
                        'px-4 py-3 rounded-lg h-10 flex justify-center items-center text-xs font-medium transition-all',
                        isSelected
                            ? 'bg-primary-1 text-brand-neutral-8 border border-brand-primary-6'
                            : 'bg-white text-brand-neutral-7 border border-brand-neutral-4 hover:border-brand-neutral-6'
                        )}
                >
                    {price.label}
                </button>
                )
            })}
        </div>
    )
}