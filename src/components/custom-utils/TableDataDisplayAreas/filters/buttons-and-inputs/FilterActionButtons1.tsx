'use client'

import { ReactNode } from 'react'

interface FilterActionsProps {
    onClear: () => void
    onApply: () => void
    clearLabel?: ReactNode
    applyLabel?: ReactNode
    isApplying?: boolean
    applyDisabled?: boolean
    className?: string
}

export default function FilterButtonsActions1({
    onClear,
    onApply,
    clearLabel = 'Clear',
    applyLabel = 'Apply',
    isApplying = false,
    applyDisabled = false,
    className = '',
}: FilterActionsProps) {
    return (
        <div className={`flex gap-4 pt-4 ${className}`}>
            {/* Clear Button */}
            <button
                type="button"
                onClick={onClear}
                className="flex-1 h-10 text-brand-secondary-8 max-w-36 border border-brand-neutral-6 rounded-full font-medium text-sm transition-all hover:bg-brand-neutral-2 hover:shadow-sm active:scale-[0.98]"
                disabled={isApplying}
            >
                {clearLabel}
            </button>

            {/* Apply Button */}
            <button
                type="button"
                onClick={onApply}
                disabled={applyDisabled || isApplying}
                className={`flex-1 h-10 max-w-36 rounded-full font-medium text-sm transition-all shadow-lg active:scale-[0.98] 
                    ${isApplying || applyDisabled
                        ? 'bg-brand-neutral-4 text-brand-neutral-6 cursor-not-allowed'
                        : 'bg-brand-primary-6 text-white hover:bg-brand-primary-7'
                    }
                `}
            >
                {isApplying ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Applying...
                    </span>
                ) : (
                    applyLabel
                )}
            </button>
        </div>
    )
}