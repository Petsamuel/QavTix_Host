"use client"

import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { space_grotesk } from '@/lib/fonts'
import { Icon } from '@iconify/react'
import { useRouter } from 'next/navigation'
import { AnimatedDialogForPrompt } from '../custom-utils/dialogs/AnimatedDialogForPrompts'
import ActionButton1 from '../custom-utils/buttons/ActionBtn1'
import { NAVIGATION_LINKS } from '@/enums/navigation'


export interface PromptModalConfig {
    icon: string
    iconBg: string
    iconColor: string
    title: string
    description: React.ReactNode
    primaryLabel: string
    primaryAction: (router: ReturnType<typeof useRouter>) => void
    secondaryLabel: string
}

export const UPGRADE_PLAN_CONFIG = (featureName: string, requiredPlan: string): PromptModalConfig => ({
    icon: "solar:lock-bold",
    iconBg: "bg-brand-primary-1",
    iconColor: "text-brand-primary-6",
    title: "Upgrade Your Plan",
    description: (
        <>
            <span className="font-medium text-brand-secondary-9">{featureName}</span> is not
            available on your current plan. Upgrade your plan to unlock this feature.
        </>
    ),
    primaryLabel: "View Plans",
    primaryAction: () => window.open(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/pricing`, "_blank"),
    secondaryLabel: "Go back",
})

export const VERIFICATION_REQUIRED_CONFIG: PromptModalConfig = {
    icon: "solar:shield-warning-bold",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    title: "Verification Required",
    description: (
        <>
            You need to wait till your <span className="font-medium text-brand-secondary-9">account is verified</span> before
            accessing this section.
        </>
    ),
    primaryLabel: "Dashboard",
    primaryAction: (router) => router.push(NAVIGATION_LINKS.DASHBOARD.href),
    secondaryLabel: "Go back",
}



interface Props {
    open: boolean
    onClose: () => void
    config: PromptModalConfig
}

export default function ContentGatePromptModal({ open, onClose, config }: Props) {
    const router = useRouter()

    return (
        <AnimatedDialogForPrompt open={open} onOpenChange={(v) => !v && onClose()}>
            <div>
                <div className="size-14 mb-4 flex items-center justify-center rounded-2xl" style={{ background: "inherit" }}>
                    <div className={`size-14 mb-4 flex items-center justify-center rounded-full ${config.iconBg}`}>
                        <Icon icon={config.icon} className={`size-8.5 ${config.iconColor}`} />
                    </div>
                </div>

                <div className="max-w-xs">
                    <DialogHeader className="mb-4">
                        <DialogTitle className={`${space_grotesk.className} text-2xl font-medium`}>
                            {config.title}
                        </DialogTitle>
                        <DialogDescription className="text-brand-neutral-7 mt-2">
                            {config.description}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex gap-3 justify-center mt-6">
                    <Button
                        onClick={onClose}
                        className="h-14 flex-1 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border-2 border-brand-secondary-3 font-medium text-sm hover:bg-neutral-2 hover:border-brand-secondary-5 transition-all duration-150"
                    >
                        <Icon icon="hugeicons:arrow-left-01" className="size-4" />
                        {config.secondaryLabel}
                    </Button>
                    <ActionButton1
                        action={() => config.primaryAction(router)}
                        buttonText={config.primaryLabel}
                        className="flex-1"
                    />
                </div>
            </div>
        </AnimatedDialogForPrompt>
    )
}