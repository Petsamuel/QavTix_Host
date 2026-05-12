"use client"

import Image from "next/image"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { DialogDescription, DialogTitle } from "../ui/dialog"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import { usePricingCheckout } from "@/contexts/checkout/PricingCheckoutContext"

export default function PlanUpgradeSuccessMessage() {

    const { successPlan, resetSuccess } = usePricingCheckout()

    return (
        <AnimatedDialog
            open={true}
            onOpenChange={(open) => { if (!open) resetSuccess() }}
            showCloseButton
            className="rounded-3xl! md:max-w-sm!"
            childrenContainerStyles="px-5 py-10"
        >
            <div className="text-center">
                <Image
                    src="/images/vectors/success-indicator2.svg"
                    alt="Payment successful"
                    width={160}
                    height={160}
                    className="mx-auto mb-6"
                />

                {successPlan && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary-6 bg-brand-primary-1 px-3 py-1 rounded-full mb-4">
                        <Icon icon="hugeicons:calendar-add-02" width="14" height="14" />
                        {successPlan.name} activated
                    </span>
                )}

                <DialogTitle className={cn(space_grotesk.className, "text-2xl font-bold text-brand-secondary-9 mb-2")}>
                    You're all set!
                </DialogTitle>

                <DialogDescription className="text-sm text-brand-neutral-7 leading-relaxed mb-8">
                    Your plan has been successfully upgraded. You can now start creating events and
                    accessing premium tools immediately.
                </DialogDescription>
            </div>
        </AnimatedDialog>
    )
}