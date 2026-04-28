'use client'

import { forwardRef } from 'react'

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string
    error?: string
    required?: boolean
    helperText?: string
}

const CustomTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
    ({ label, error, required, helperText, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-2.75">
                <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                    {label}
                </label>
                <textarea
                    ref={ref}
                    className={`
                        w-full resize-none px-4 py-3 text-sm rounded-lg transition-all h-60
                        ${error
                            ? 'border border-red-400 focus:border-red-500'
                            : 'border border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6'
                        }
                        outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5
                        scrollbar-thin
                        ${className}
                    `}
                    {...props}
                />
                {
                    helperText &&
                    <p className='text-brand-secondary-5 text-[10px]'>{helperText}</p>
                }
                {error && (
                    <p className="text-xs text-red-500 ml-1">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

export default CustomTextArea;