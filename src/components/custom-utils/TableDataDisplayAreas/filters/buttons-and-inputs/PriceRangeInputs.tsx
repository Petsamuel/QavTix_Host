'use client'

import { Input } from '@/components/ui/input'

interface PriceRangeInputsProps {
  min: number
  max: number
  currency: string
  onMinChange: (value: number) => void
  onMaxChange: (value: number) => void
}

export function PriceRangeInputs({
  min,
  max,
  currency,
  onMinChange,
  onMaxChange,
}: PriceRangeInputsProps) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <div>
                <div className="relative">
                    <Input
                        type="number"
                        value={min || ''}
                        onChange={(e) => onMinChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        placeholder="0"
                        className="pl-10 pt-6 pb-2 h-16 rounded-xl border-2 border-brand-neutral-3 focus:outline-0 focus:outline-offset-0 focus:outline-none focus:ring-0 focus:border-brand-primary text-base 
                        [appearance:textfield] 
                        [&::-webkit-outer-spin-button]:appearance-none 
                        [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <label className="absolute left-4 top-2 text-xs font-medium text-brand-neutral-7 pointer-events-none">
                        Minimum amount
                    </label>
                    <span className="absolute left-4 bottom-3 text-brand-neutral-7 text-base font-medium">
                        {currency}
                    </span>
                </div>
            </div>
            <span className="text-brand-neutral-6 text-sm pb-4">to</span>
            <div>
                <div className="relative">
                    <Input
                        type="number"
                        value={max || ''}
                        onChange={(e) => onMaxChange(e.target.value === '' ? 0 : Number(e.target.value))}
                        placeholder="0"
                        className="pl-10 pt-6 pb-2 h-16 rounded-xl border-2 border-brand-neutral-3 focus:outline-0 focus:outline-offset-0 focus:outline-none focus:ring-0 focus:border-brand-primary text-base 
                        [appearance:textfield] 
                        [&::-webkit-outer-spin-button]:appearance-none 
                        [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <label className="absolute left-4 top-2 text-xs font-medium text-brand-neutral-7 pointer-events-none">
                        Maximum amount
                    </label>
                    <span className="absolute left-4 bottom-3 text-brand-neutral-7 text-base font-medium">
                        {currency}
                    </span>
                </div>
            </div>
        </div>
    )
}