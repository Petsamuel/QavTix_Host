"use client"

import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { space_grotesk } from '@/lib/fonts'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { AnimatedDialogForPrompt } from '../custom-utils/dialogs/AnimatedDialogForPrompts'
import CloseBtn from '../custom-utils/buttons/CloseBtn'
import ActionButton1 from '../custom-utils/buttons/ActionBtn1'

interface Props {
    open: boolean
    onClose: () => void
    featureName: string
    requiredPlan: string
}

export default function UpgradePlanModal({ open, onClose, featureName, requiredPlan }: Props) {
    const router = useRouter()

    return (
        <AnimatedDialogForPrompt open={open} onOpenChange={(v) => !v && onClose()}>
            <div>
                <div className="flex justify-between">
                    <div className="size-14 mb-4 flex items-center justify-center rounded-2xl bg-primary-1">
                        <Icon icon="solar:lock-bold" className="size-9 text-brand-primary-6" />
                    </div>
                    <CloseBtn action={onClose} />
                </div>

                <div className="max-w-xs">
                    <DialogHeader className="mb-4">
                        <DialogTitle className={`${space_grotesk.className} text-2xl font-medium`}>
                            Upgrade Your Plan
                        </DialogTitle>
                        <DialogDescription className="text-neutral-7 mt-2">
                            <span className="font-medium text-brand-secondary-9">{featureName}</span> is not available on your
                            current plan. Upgrade to{" "}
                            <span className="font-medium text-brand-primary-6">{requiredPlan}</span> to unlock it.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex gap-3 justify-center mt-6">
                    <Button
                        onClick={onClose}
                        className="h-14 flex-1 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-brand-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-brand-secondary-5 transition-all duration-150"
                    >
                        Maybe later
                    </Button>
                    <ActionButton1
                        action={() => window.open(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/pricing`, "_blank")}
                        buttonText="View Plans"
                        className="flex-1"
                    />
                </div>
            </div>
        </AnimatedDialogForPrompt>
    )
}