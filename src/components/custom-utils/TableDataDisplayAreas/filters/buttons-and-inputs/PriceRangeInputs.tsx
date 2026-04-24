'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'

interface PriceRangeInputsProps {
    min: number
    max: number
    currency: string
    onMinChange: (value: number) => void
    onMaxChange: (value: number) => void
}

function PriceInput({ value, label, currency, onChange }: {
    value: number
    label: string
    currency: string
    onChange: (value: number) => void
}) {
    const [text, setText] = useState(value > 0 ? String(value) : '')
    const internalRef = useRef(value)

    useEffect(() => {
        // Only sync when parent changes it externally (e.g. clear button)
        if (value !== internalRef.current) {
            internalRef.current = value
            setText(value > 0 ? String(value) : '')
        }
    }, [value])

    return (
        <div className="relative">
            <Input
                type="text"
                inputMode="numeric"
                value={text}
                onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '')
                    setText(raw)
                    const num = raw === '' ? 0 : Number(raw)
                    internalRef.current = num
                    onChange(num)
                }}
                placeholder="0"
                className="pl-10 pt-6 pb-2 h-16 rounded-xl placeholder:text-neutral-6 border-2 border-neutral-3 focus:outline-0 focus:outline-offset-0 focus:outline-none focus:ring-0 focus:border-primary text-base"
            />
            <label className="absolute left-4 top-2 text-xs font-medium text-neutral-7 pointer-events-none">
                {label}
            </label>
            <span className="absolute left-4 bottom-3 text-neutral-7 text-base font-medium">
                {currency}
            </span>
        </div>
    )
}

export function PriceRangeInputs({ min, max, currency, onMinChange, onMaxChange }: PriceRangeInputsProps) {
    return (
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-3">
            <PriceInput value={min} label="Minimum amount" currency={currency} onChange={onMinChange} />
            <span className="text-neutral-6 text-sm pb-4">to</span>
            <PriceInput value={max} label="Maximum amount" currency={currency} onChange={onMaxChange} />
        </div>
    )
}