"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Option {
    value: string
    label: string
}

interface SearchableSelectProps {
    options: Option[]
    value?: string
    onValueChange: (value: string) => void
    placeholder?: string
    searchPlaceholder?: string
    label?: string
    error?: string
    required?: boolean
    disabled?: boolean
    className?: string
}

export default function SearchableSelect({
    options,
    value,
    onValueChange,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    label,
    error,
    required,
    disabled,
    className,
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false)

    const selected = options.find(o => o.value === value)

    return (
        <div className={cn("w-full space-y-2", className)}>
            {label && (
                <label className="block text-sm font-medium text-brand-secondary-9">
                    {label}
                    {required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}

            <Popover open={open} onOpenChange={setOpen} modal={false}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "w-full h-12 px-4 justify-between font-normal rounded-lg text-sm",
                            error
                                ? "border-red-400 focus:border-red-500"
                                : "border-brand-secondary-5 focus:border-brand-accent-4",
                            !selected && "text-brand-secondary-5"
                        )}
                    >
                        <span className="truncate">{selected?.label ?? placeholder}</span>
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50 ml-2" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="w-var(--radix-popover-trigger-width] p-0 max-w-[17em]"
                    align="start"
                >
                    <Command>
                        <CommandInput placeholder={searchPlaceholder} className="h-10 text-sm" />
                        <CommandList>
                            <CommandEmpty className="py-6 text-center text-sm text-brand-secondary-5">
                                No results found.
                            </CommandEmpty>
                            <CommandGroup>
                                {options.map(option => (
                                    <CommandItem
                                        key={option.value}
                                        value={option.label}   // search against label, not code
                                        onSelect={() => {
                                            onValueChange(option.value)
                                            setOpen(false)
                                        }}
                                        className="text-sm cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 size-4 shrink-0",
                                                value === option.value ? "opacity-100 text-brand-primary-6" : "opacity-0"
                                            )}
                                        />
                                        {option.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && (
                <p className="text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    )
}