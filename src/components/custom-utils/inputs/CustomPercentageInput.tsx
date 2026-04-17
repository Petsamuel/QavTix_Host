"use client"

import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface PercentageInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string
    error?: string
    required?: boolean
    helperText?: string
    inputContainerStyles?: string
    value: number;
    onChange?: (value: string) => void
}

export const CustomPercentageInput = forwardRef<HTMLInputElement, PercentageInputProps>(
    ({ 
        label, 
        error, 
        required, 
        helperText,
        inputContainerStyles, 
        className = '', 
        onChange,
        value = 0,
        ...props 
    }, ref) => {
        
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let value = e.target.value.replace(/[^0-9]/g, '')

            if (value === '') {
                onChange?.('')
                return;
            }

            const numericValue = parseInt(value, 10)
            
            if (numericValue > 100) {
                value = '100';
            } else {
                value = numericValue.toString()
            }

            onChange?.(value)
        }

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-brand-secondary-9">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                
                <div className={cn("relative flex items-center", inputContainerStyles)}>
                    <input
                        ref={ref}
                        type="number"
                        value={value}
                        inputMode="numeric"
                        onChange={handleInputChange}
                        // Hide spinners using Tailwind's arbitrary values or utility classes
                        className={cn(
                            "w-full pr-14 pl-4 py-3 text-sm rounded-lg h-14 transition-all outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5",
                            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                            error 
                                ? 'border border-red-400 focus:border-red-500' 
                                : 'border border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6',
                            className
                        )}
                        {...props}
                    />
                    
                    <div className="absolute right-[1.5px] h-[calc(100%-3px)] w-[3.5em] justify-center rounded-r-lg text-center flex items-center bg-brand-neutral-3 border-l border-brand-secondary-5/20 pointer-events-none">
                        <span className="text-brand-secondary-5 font-medium text-xs">%</span>
                    </div>
                </div>

                {helperText && !error && (
                    <p className='text-brand-secondary-5 text-[10px]'>{helperText}</p>
                )}
                {error && (
                    <p className="text-xs text-red-400 ml-1">{error}</p>
                )}
            </div>
        )
    }
)

CustomPercentageInput.displayName = "CustomPercentageInput";

export default CustomPercentageInput;