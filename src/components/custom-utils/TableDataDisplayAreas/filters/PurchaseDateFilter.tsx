"use client"


import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatDate } from "date-fns"
import { Icon } from "@iconify/react"


export function PurchaseDateFilter({ value, onChange, icon }:{ value: Date | null, icon: string, onChange: (date: Date | null) => void  }) {

    const [open, setOpen] = useState(false)
    const baseStyles = 'flex items-center gap-3 transition-colors outline-none'

    const variants = {
        compact: cn(
            'px-2 justify-between text-xs rounded-[11px] h-9 min-w-20 font-medium',
            'bg-white border border-brand-neutral-5',
            'hover:border-brand-primary hover:bg-brand-primary-1'
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        onClick={() => setOpen(true)}
                        className={cn(
                            baseStyles,
                            variants.compact,
                            value ? 'text-brand-neutral-8' : 'text-brand-neutral-7'
                        )}
                    >

                        <span className="truncate">{value ? formatDate(value, 'MM/dd/yyyy') : "Purchase Date"}</span>
                        <Icon
                            icon={icon || "fluent:chevron-down-20-filled"}
                            className={cn(
                                'size-5 shrink-0 text-brand-neutral-8',
                                'group-hover:text-brand-primary-6'
                            )}
                        />
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value || undefined}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            onChange(date || null)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
