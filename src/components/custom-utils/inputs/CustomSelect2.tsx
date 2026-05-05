'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface FormSelectProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string
    error?: string
    required?: boolean
    disabled?: boolean
    options: readonly{ value: string; label: string }[]
    value?: string
    onValueChange?: (value: string) => void
}

const CustomSelect2 = ({
    label,
    error,
    required,
    disabled,
    options,
    value,
    onValueChange,
    className = '',
    ...props
}: FormSelectProps) => {
    return (
        <div className={`w-full ${className}`} {...props}>
            <Label className="block text-sm font-medium text-brand-neutral-9 mb-2">
                {label}
            </Label>
            <Select value={value} onValueChange={onValueChange} disabled={disabled}>
                <SelectTrigger
                    className={`
                        w-full px-4 py-3 text-sm rounded-lg shadow-none min-h-14 h-14 border
                        ${error 
                            ? 'border border-red-400 focus:border-red-500' 
                            : 'border border-brand-neutral-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-neutral-6'
                        }
                        outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.value} value={option.value} className='hover:bg-brand-accent-3! text-xs'>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">
                    {error}
                </p>
            )}
        </div>
    )
}

export default CustomSelect2;