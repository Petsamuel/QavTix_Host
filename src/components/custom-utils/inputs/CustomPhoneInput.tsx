'use client'

import React from 'react'
import PhoneInput, { getCountryCallingCode, Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { inter } from '@/lib/fonts'

interface CountrySelectProps {
    value?: Country
    onChange: (value?: Country) => void
    options: { value?: Country; label: string }[]
}

interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    country?: string;
    international?: boolean;
    withCountryCallingCode?: boolean;
}

interface PhoneNumberInputProps {
    value?: string
    onChange: (value: string | undefined) => void
    error?: string
    placeholder?: string
    defaultCountry?: Country
    label?: string
    className?: string
}

export default function PhoneNumberInput({
    value,
    onChange,
    error,
    placeholder = '8123456789',
    defaultCountry = 'NG',
    label = "Phone Number (Optional)",
    className
}: PhoneNumberInputProps) {
    
    // Ensure we always have a country code to display even if value is empty
    // We derive it from the value (if it exists) or fall back to defaultCountry
    const currentCountry = (value && value.startsWith('+')) 
        ? undefined // The library will handle deriving it from the string
        : defaultCountry;

    return (
        <div className={cn("w-full space-y-2", className)}>
            <label className="block text-sm font-medium text-brand-secondary-9">
                {label}
            </label>
            
            <div className={cn(
                inter.className,
                "flex items-center w-full h-14 text-sm rounded-lg border bg-white transition-all focus-within:ring-1 focus-within:ring-brand-accent-4",
                error ? "border-red-400" : "border-brand-secondary-5 hover:border-brand-secondary-6"
            )}>
                <PhoneInput
                    international
                    withCountryCallingCode
                    defaultCountry={defaultCountry}
                    value={value ?? ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="flex w-full h-full custom-phone-input"
                    
                    countrySelectComponent={({ value: country, onChange: onCountryChange, options }: CountrySelectProps) => {
                        // If 'country' is undefined (because user cleared input), 
                        // we fallback to display the defaultCountry code
                        const displayCountry = country || defaultCountry;
                        
                        return (
                            <div className="relative flex items-center px-4 h-full cursor-pointer group">
                                <select
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    value={displayCountry}
                                    onChange={(event) => onCountryChange(event.target.value as Country)}
                                >
                                    {options.map(({ value: optValue, label: optLabel }) => (
                                        <option key={optValue || 'ZZ'} value={optValue}>
                                            {optLabel}
                                        </option>
                                    ))}
                                </select>
                                <div className="flex items-center gap-2 text-sm font-medium text-brand-secondary-9 min-w-15">
                                    <span>+{displayCountry ? getCountryCallingCode(displayCountry) : ''}</span>
                                    <ChevronDown className="size-4 text-brand-secondary-5" />
                                </div>
                                <div className="ml-2 h-8 w-px bg-brand-secondary-4" />
                            </div>
                        )
                    }}

                    numberinputcomponent={React.forwardRef<HTMLInputElement, NumberInputProps>(
                        ({ country, international, withCountryCallingCode, ...rest }, ref) => {
                            const { value, onChange, ...inputProps } = rest;
                            
                            return (
                                <input
                                    {...inputProps}
                                    value={value}
                                    onChange={onChange}
                                    ref={ref}
                                    autoComplete="off"
                                    data-lpignore="true"
                                    data-form-type="other"
                                    data-1p-ignore="true"
                                    name={`phone-${Math.random()}`} 
                                    className={cn(
                                        inter.className,
                                        "flex-1 bg-transparent px-4 py-3 text-sm outline-none text-brand-neutral-9 placeholder:text-brand-secondary-5 h-full"
                                    )}
                                />
                            )
                        }
                    )}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    )
}