'use client'
import { forwardRef, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppSelector } from '@/lib/redux/hooks'
import { CURRENCY_SELECT_OPTIONS } from '@/components-data/currencies'


interface PriceInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label?: string
    error?: string
    required?: boolean
    helperText?: string
    currency?: string
    onCurrencyChange?: (currency: string) => void
    currencies?: { value: string; label: string }[]
    disableCurrencySelect?: boolean
    onChange?: (value: string) => void
}

const CustomPriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
    ({
        label,
        error,
        required,
        helperText,
        className = '',
        currency,
        onCurrencyChange,
        currencies = CURRENCY_SELECT_OPTIONS,
        disableCurrencySelect = false,
        onChange,
        ...props
    }, ref) => {

        const { user } = useAppSelector(store => store.authUser)

        const activeCurrency = user?.currency ?? currencies[0]?.value

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value.replace(/[^0-9.]/g, '')
            onChange?.(value)
        }


        useEffect(() => {
            if (onCurrencyChange && disableCurrencySelect && currency !== activeCurrency) {
                onCurrencyChange(activeCurrency)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [activeCurrency, currency, disableCurrencySelect])

        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative flex items-center overflow-hidden">
                    {/* Input Field */}
                    <input
                        ref={ref}
                        type="text"
                        inputMode="decimal"
                        onChange={handleInputChange}
                        className={`
                            w-full pr-28 pl-4 disabled:opacity-50 py-3 text-sm rounded-lg h-14 transition-all
                            ${error
                                ? 'border border-red-400 focus:border-red-500'
                                : 'border border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6'
                            }
                            outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5
                            ${className}
                        `}
                        {...props}
                    />

                    {/* Currency Select */}
                    <div className="absolute right-[1.5px] h-[95%] flex items-center">
                        <Select
                            value={activeCurrency}
                            onValueChange={onCurrencyChange}
                            disabled={disableCurrencySelect}
                        >
                            <SelectTrigger
                                className={`
                                    h-full min-h-full bg-brand-neutral-3 w-20 rounded-s-none border-none
                                    focus:ring-0 focus:ring-offset-0 text-sm font-medium text-brand-secondary-9
                                    ${disableCurrencySelect ? 'opacity-60 cursor-not-allowed pointer-events-none' : ''}
                                `}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {currencies.map((curr) => (
                                    <SelectItem key={curr.value} value={curr.value}>
                                        {curr.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {helperText && !error && (
                    <p className="text-brand-secondary-5 text-[10px]">{helperText}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500 ml-1">{error}</p>
                )}
            </div>
        )
    }
)

CustomPriceInput.displayName = 'CustomPriceInput'

export default CustomPriceInput