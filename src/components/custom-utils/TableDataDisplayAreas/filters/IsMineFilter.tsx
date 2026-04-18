"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"

type IsMineValue = boolean | null

interface IsMineFilterProps {
    value:    IsMineValue
    onChange: (value: IsMineValue) => void
    icon:     string
}

const OPTIONS = [
    {
        value:       null as IsMineValue,
        label:       "All Tickets",
        icon:        "hugeicons:ticket-02",
        description: "Show all available tickets",
    },
    {
        value:       true as IsMineValue,
        label:       "My Listings",
        icon:        "hugeicons:user-circle",
        description: "Tickets listed by me",
    },
    {
        value:       false as IsMineValue,
        label:       "Others",
        icon:        "hugeicons:user-group",
        description: "Tickets listed by others",
    },
]

export function IsMineFilter({ value, onChange, icon }: IsMineFilterProps) {

    const [isOpen, setIsOpen] = useState(false)

    const selected = OPTIONS.find(o => o.value === value) ?? OPTIONS[0]

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText={selected.label}
                    onClick={() => setIsOpen(true)}
                    hasActiveFilter={value !== null}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={5}
                className={cn(
                    "w-56 z-200! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
                    "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=open]:zoom-in-90 data-[state=open]:slide-in-from-top-4",
                    "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-400 data-[state=closed]:ease-in data-[state=closed]:zoom-out-90 data-[state=closed]:slide-out-to-top-4"
                )}
            >
                <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-neutral-7">
                    Filter By Owner
                </p>

                {OPTIONS.map(option => {
                    const isSelected = value === option.value
                    return (
                        <DropdownMenuItem
                            key={String(option.value)}
                            onSelect={e => {
                                e.preventDefault()
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            className={cn(
                                "flex items-center gap-2.5 px-2 py-2.5 rounded-lg cursor-pointer transition-colors outline-none",
                                "focus:bg-brand-neutral-1 active:scale-[0.98]",
                                isSelected && "bg-brand-primary-1/40"
                            )}
                        >
                            <div className={cn(
                                "size-8 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-brand-primary-6" : "bg-brand-neutral-3"
                            )}>
                                <Icon
                                    icon={option.icon}
                                    className={cn("size-4", isSelected ? "text-white" : "text-brand-neutral-7")}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-xs font-medium",
                                    isSelected ? "text-brand-primary-8" : "text-brand-secondary-9"
                                )}>
                                    {option.label}
                                </p>
                                <p className="text-[10px] text-brand-neutral-6 truncate">{option.description}</p>
                            </div>
                            {isSelected && (
                                <Icon icon="iconamoon:check-bold" className="text-brand-primary-6 size-3 shrink-0" />
                            )}
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}