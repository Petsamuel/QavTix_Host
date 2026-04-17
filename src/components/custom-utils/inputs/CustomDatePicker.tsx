'use client'

import * as React from "react"
import { useState } from "react" // Import useState
import { format } from "date-fns"
import { Calendar as CalendarIcon, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CustomDatePickerProps {
  label: string
  value?: string | Date
  onChange: (date?: string) => void
  error?: string
  placeholder?: string
  disabled?: boolean
  icon?: LucideIcon
  className?: string
  disabledPastDate?: boolean
}

export default function CustomDatePicker({
  label,
  value,
  onChange,
  error,
  disabled = false,
  disabledPastDate = false,
  placeholder = "DD/MM/YYYY",
  icon: Icon = CalendarIcon,
  className
}: CustomDatePickerProps) {
    const [open, setOpen] = useState(false)
    const dateValue = value ? new Date(value) : undefined

    return (
        <div className={cn("w-full space-y-2.75", className)}>
            <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                {label}
            </label>
            
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                        "w-full h-14 px-4 flex items-center justify-between text-xs rounded-lg transition-all outline-none bg-white",
                        error
                            ? 'border border-red-400 focus:border-red-500'
                            : 'border border-brand-secondary-5 focus:border-[1.5px] focus:border-brand-accent-4 hover:border-brand-secondary-6',
                        !value ? "text-brand-secondary-5" : "text-brand-neutral-9"
                        )}
                    >
                        <span>
                            {dateValue ? format(dateValue, "PPP") : placeholder}
                        </span>
                        <Icon className="size-4 opacity-50" />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        disabled={disabled}
                        hidden={disabledPastDate ? { before: new Date() } : undefined}
                        onSelect={(date) => {
                            onChange(date?.toISOString())
                            setOpen(false) 
                        }}
                    />
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-xs text-red-500 ml-1 mt-1">
                {error}
                </p>
            )}
        </div>
    )
}