"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export type ItemAction = {
    id:       string
    label:    string
    icon:     string
    variant?: 'default' | 'danger'
    onClick?: () => void | Promise<void>
}

interface ItemActionDropdownProps {
    actions:   ItemAction[]
    disabled?: boolean
}

export default function ItemActionDropdown({ actions, disabled = false }: ItemActionDropdownProps) {

    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen,        setIsOpen]        = useState(false)

    const handleAction = async (action: ItemAction) => {
        if (loadingAction) return
        setLoadingAction(action.id)
        try {
            await action.onClick?.()
        } catch (err) {
            console.error(`Action "${action.label}" failed:`, err)
        } finally {
            setLoadingAction(null)
            setIsOpen(false)
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild disabled={disabled}>
                <button
                    className={cn(
                        "p-1 border border-brand-neutral-5 rounded-md transition-colors",
                        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-neutral-2"
                    )}
                    disabled={disabled}
                >
                    <Icon icon="tabler:dots"     className="w-5 h-5 text-brand-secondary-9 hidden md:inline-block" />
                    <Icon icon="ix:context-menu" className="w-5 h-5 text-brand-secondary-9 md:hidden" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 text-brand-secondary-9 space-y-1.5">
                {actions.map((action) => {
                    const isActionLoading  = loadingAction === action.id
                    const isActionDisabled = loadingAction !== null && !isActionLoading

                    return (
                        <DropdownMenuItem
                            key={action.id}
                            asChild
                            onSelect={(e) => e.preventDefault()}
                        >
                            <button
                                type="button"
                                disabled={isActionDisabled}
                                onClick={() => { if (!isActionDisabled) handleAction(action) }}
                                className={cn(
                                    "w-full text-left flex items-center text-xs gap-2 font-normal cursor-pointer transition-colors px-2 py-1.5 rounded-sm",
                                    "hover:bg-brand-neutral-4 focus:bg-brand-neutral-4 focus:outline-none",
                                    action.variant === 'danger' && "text-red-600 hover:bg-red-50 focus:bg-red-50",
                                    isActionDisabled && "opacity-40 cursor-not-allowed",
                                )}
                            >
                                {isActionLoading
                                    ? <Icon icon="eos-icons:three-dots-loading" className="size-4" />
                                    : <Icon icon={action.icon} className="size-4.5" />
                                }
                                {action.label}
                            </button>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}