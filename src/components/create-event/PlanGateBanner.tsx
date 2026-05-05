"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { SETTINGS_SUB_LINKS } from "@/enums/navigation"

interface PlanGateBannerProps {
    message: string
    variant?: "inline" | "block"
    className?: string
}

/**
 * Reusable plan-restriction notice.
 * Inline variant — shown under ticket type / promo code inputs.
 * Block variant  — shown when a whole section (e.g. affiliate) is locked.
 */
export function PlanGateBanner({
    message,
    className,
}: PlanGateBannerProps) {
    return (
        <div
            className={cn(
                "flex items-start gap-3 mt-1",
                className
            )}
            role="alert"
            data-testid="plan-gate"
        >
            <div className="shrink-0 size-8 rounded-full bg-brand-primary-1 flex items-center justify-center">
                <Icon icon="lucide:lock" className="size-4 text-brand-primary-6" />
            </div>
            <p className="text-xs pt-1 leading-snug text-brand-neutral-7">
                {message}{" "}
                <Link
                    href={SETTINGS_SUB_LINKS[2].href}
                    className="font-semibold text-sm text-brand-primary-6 hover:text-brand-primary-7 hover:underline underline-offset-2 transition-colors"
                >
                    Upgrade
                </Link>
            </p>
        </div>
    )
}