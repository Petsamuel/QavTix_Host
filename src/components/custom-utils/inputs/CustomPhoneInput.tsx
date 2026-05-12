'use client'

import React from 'react'
import PhoneInput, { getCountryCallingCode, Country, parsePhoneNumber } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import 'react-phone-number-input/style.css'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { inter } from '@/lib/fonts'


interface CountrySelectProps {
    value?: Country
    onChange: (value?: Country) => void
    options: { value?: Country; label: string }[]
    disabled?: boolean
    defaultCountry?: Country
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
    showRequired?: boolean
    label?: string
    className?: string
    disabled?: boolean
    readOnly?: boolean
}

const CustomInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ country, international, withCountryCallingCode, ...rest }, ref) => {
        return (
            <input
                {...rest}
                ref={ref}
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                data-1p-ignore="true"
                className={cn(
                    inter.className,
                    "flex-1 px-4 py-3 text-sm outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5 h-full"
                )}
            />
        )
    }
)

const CustomCountrySelect = ({ value, onChange, options, disabled, defaultCountry }: CountrySelectProps) => {
    const displayCountry = value || defaultCountry || 'US';
    const Flag = flags[displayCountry as Country]

    return (
        <div className="relative flex items-center px-4 h-full cursor-pointer group">
            <select
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                value={value}
                disabled={disabled}
                onChange={(event) => onChange(event.target.value as Country)}
            >
                {options.map(({ value: optValue, label: optLabel }) => (
                    <option key={optValue || 'ZZ'} value={optValue}>
                        {optLabel}
                    </option>
                ))}
            </select>
            <div className="flex items-center gap-2">
                {Flag && (
                    <span className="size-7 overflow-hidden rounded-sm shrink-0 inline-flex">
                        <Flag title={displayCountry} />
                    </span>
                )}
                <ChevronDown className="size-4 text-secondary-5" />
            </div>
            <div className="ml-2 h-8 w-px bg-secondary-4" />
        </div>
    )
}

export default function PhoneNumberInput({
    value,
    onChange,
    error,
    placeholder = '1234567890',
    defaultCountry = 'US',
    label = "Phone Number (Optional)",
    className,
    showRequired,
    disabled,
    readOnly
}: PhoneNumberInputProps) {
    const isInteractable = !disabled && !readOnly;

    // Ensure we always have a country code to display even if value is empty
    // We derive it from the value (if it exists) or fall back to defaultCountry
    const currentCountry = (value && value.startsWith('+'))
        ? undefined // The library will handle deriving it from the string
        : defaultCountry;

    // Fix E.164 warning: if value is local (e.g. '080...'), convert it using the default country.
    // If it's invalid or empty, pass undefined to avoid console errors.
    let safeValue: string | undefined = undefined;
    if (value) {
        if (value.startsWith('+')) safeValue = value;
        else {
            try {
                const parsed = parsePhoneNumber(value, defaultCountry as Country);
                safeValue = parsed?.number || undefined;
            } catch {
                safeValue = undefined;
            }
        }
    }

    const CountrySelect = React.useMemo(() => (props: CountrySelectProps) => (
        <CustomCountrySelect {...props} defaultCountry={defaultCountry} />
    ), [defaultCountry])

    return (
        <div className={cn("w-full space-y-2", className)}>
            <label className="block text-sm font-medium text-secondary-9">
                {label} {showRequired && <span className="text-red-500">*</span>}
            </label>

            <div className={cn(
                inter.className,
                "flex items-center w-full h-14 overflow-hidden text-sm rounded-lg border bg-white transition-all",
                error ? "border-red-400" : "border-brand-secondary-5 hover:border-brand-secondary-6",
                !isInteractable && "bg-brand-neutral-1 opacity-80 pointer-events-none"
            )}>
                <PhoneInput
                    defaultCountry={defaultCountry}
                    value={safeValue}
                    onChange={onChange}
                    disabled={!isInteractable}
                    placeholder={placeholder}
                    autoComplete="off"
                    className="flex w-full h-full custom-phone-input"

                    countrySelectComponent={CountrySelect}
                    inputComponent={CustomInput}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    )
}