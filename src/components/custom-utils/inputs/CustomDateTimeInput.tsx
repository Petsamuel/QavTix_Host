'use client'
import { forwardRef, useCallback } from 'react'
import { cn } from "@/lib/utils"

interface DateTimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    disablePastDate?: boolean
}

export const CustomDateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
    ({ label, error, disablePastDate = true, className = '', ...props }, ref) => {

        const getMinDateTime = useCallback(() => {
            const now = new Date()
            const pad = (n: number) => String(n).padStart(2, '0')
            return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
        }, [])

        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                    {label}
                </label>
                <div className="relative">
                    <input
                        type="datetime-local"
                        ref={ref}
                        min={disablePastDate ? getMinDateTime() : undefined}
                        className={cn(
                            "w-full h-14 px-4 py-3 text-sm rounded-lg bg-white outline-none transition-all",
                            "border border-brand-secondary-2 focus:border-brand-accent-4 hover:border-brand-secondary-6",
                            error && "border-red-400 focus:border-red-500 ring-1 ring-red-400/20",
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium" role="alert">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

CustomDateTimeInput.displayName = "CustomDateTimeInput"