"use client"

import { Icon }   from "@iconify/react"
import { cn }     from "@/lib/utils"
import Link       from "next/link"
import { NAVIGATION_LINKS, SETTINGS_SUB_LINKS } from "@/enums/navigation"

interface PlanGateBannerProps {
    message:    string
    variant?:   "inline" | "block"
    className?: string
}

/**
 * Reusable plan-restriction notice.
 * Inline variant — shown under ticket type / promo code inputs.
 * Block variant  — shown when a whole section (e.g. affiliate) is locked.
 */
export function PlanGateBanner({
    message,
    variant   = "inline",
    className,
}: PlanGateBannerProps) {
    if (variant === "inline") {
        return (
            <p
                className={cn(
                    "flex items-center gap-1.5 text-xs text-amber-600 font-medium mt-1.5",
                    className
                )}
                role="alert"
                data-testid="plan-gate-inline"
            >
                <Icon icon="lucide:lock" className="size-3 shrink-0" />
                {message}{" "}
                <Link
                    href={SETTINGS_SUB_LINKS[2].href}
                    className="underline underline-offset-2 hover:text-amber-700 transition-colors"
                >
                    Upgrade
                </Link>
            </p>
        )
    }

    return (
        <div
            className={cn(
                "flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4",
                className
            )}
            role="alert"
            data-testid="plan-gate-block"
        >
            <div className="shrink-0 mt-0.5 size-8 rounded-full bg-amber-100 flex items-center justify-center">
                <Icon icon="lucide:lock" className="size-4 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800">Feature not available on your plan</p>
                <p className="text-xs text-amber-700 mt-0.5">{message}</p>
                <Link
                    href={SETTINGS_SUB_LINKS[2].href}
                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-amber-700 hover:text-amber-800 underline underline-offset-2 transition-colors"
                >
                    View upgrade options
                    <Icon icon="lucide:arrow-right" className="size-3" />
                </Link>
            </div>
        </div>
    )
}