'use client'

import { forwardRef, useState } from 'react'
import { Icon } from '@iconify/react'

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    required?: boolean
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ label, error, required, className = '', autoComplete = "new-password", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)

        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-brand-neutral-9 mb-2">
                    {label}
                </label>

                <div 
                    className={`
                        relative flex items-center gap-3 px-4 py-3.5 
                        rounded-[6px] border h-14 text-sm transition-all duration-200
                        outline-none bg-white
                        ${error 
                            ? 'border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500' 
                            : 'border-neutral-5 focus-within:border-primary-6 focus-within:shadow-sm'
                        }
                    `}
                >
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        className={`flex-1 outline-none text-sm text-brand-neutral-9 placeholder:text-brand-neutral-6 bg-transparent ${className}`}
                        autoComplete={autoComplete}
                        {...props}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="shrink-0 p-1 hover:bg-brand-neutral-2 rounded transition-colors"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <Icon icon="octicon:eye-16" className="w-5 h-5 text-brand-neutral-8" />
                        ) : (
                            <Icon icon="octicon:eye-closed-16" className="w-5 h-5 text-brand-neutral-8" />
                        )}
                    </button>
                </div>

                {error && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

export default PasswordInput;