"use client"
import { useEffect } from "react"
import { Icon } from "@iconify/react"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import { FEATURED_PLANS } from "@/components-data/pricing-plans"
import { useFeatureCheckout } from "@/contexts/checkout/FeatureCheckoutProvider"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import CustomFeaturePlanSelector from "../custom-utils/inputs/CustomFeaturePlanSelector"
import { DialogDescription, DialogTitle } from "../ui/dialog"

interface AddToFeaturedModalProps {
    isOpen:     boolean
    onClose:    () => void
    onConfirm:  (planId: string) => void
}

export default function AddToFeaturedModal({ isOpen, onConfirm, onClose }: AddToFeaturedModalProps) {

    const {
        selectedPlanId,
        setSelectedPlanId,
        status,
        convertedPrice,
        closeAddModal,
    } = useFeatureCheckout()

    // Set default plan when modal opens
    useEffect(() => {
        if (isOpen && !selectedPlanId && FEATURED_PLANS.length > 0) {
            setSelectedPlanId(FEATURED_PLANS[0].id)
        }
    }, [isOpen])

    const handleProceed = () => {
        if (!selectedPlanId) return
        onConfirm(selectedPlanId)
    }

    return (
        <AnimatedDialog
            open={isOpen && status !== "success" && !closeAddModal}
            onOpenChange={onClose}
            className="md:max-w-[26em] p-0! overflow-hidden"
        >
            <div className="text-center bg-brand-neutral-1/30 px-6 pt-6 pb-4">
                <div className="size-12 bg-brand-primary-1 text-brand-primary-6 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon icon="solar:star-fall-minimalistic-bold-duotone" className="size-6" />
                </div>
                <DialogTitle className={cn(space_grotesk.className, "text-lg font-bold text-brand-neutral-8")}>
                    Feature Your Event
                </DialogTitle>
                <DialogDescription className="text-xs text-brand-neutral-7 mt-1 leading-relaxed">
                    Boost your event's visibility by placing it at the top of the discovery feed.
                </DialogDescription>
            </div>

            <div className="py-6 px-3 pt-2 space-y-4">
                <div className="space-y-2">
                    <label className="text-[11px] font-medium uppercase tracking-widest text-brand-neutral-7 ml-1">
                        Select Promotion Duration
                    </label>
                    <CustomFeaturePlanSelector
                        convertedPrice={convertedPrice}
                        onSelect={(v) => setSelectedPlanId(v)}
                        plans={FEATURED_PLANS}
                        selectedPlanId={selectedPlanId}
                    />
                </div>

                <div className="bg-brand-accent-1 border border-brand-accent-4 rounded-2xl p-4 flex items-start gap-3">
                    <Icon icon="solar:info-circle-bold-duotone" className="size-5 text-brand-accent-6 mt-0.5" />
                    <p className="text-[11px] text-brand-secondary-7 leading-relaxed font-medium">
                        Featured events get up to <span className="font-semibold">5x more views</span> and priority placement in search results.
                    </p>
                </div>
            </div>

            <div className="py-6 px-3 bg-brand-neutral-1/50 border-t border-brand-neutral-2 flex flex-col gap-3">
                <ActionButton1
                    buttonText={status === "processing" ? "Processing..." : "Proceed to Payment"}
                    action={handleProceed}
                    isLoading={status === "processing"}
                    isDisabled={!selectedPlanId || status === "processing"}
                    icon="solar:card-send-bold"
                    className="w-full disabled:opacity-50"
                />
            </div>
        </AnimatedDialog>
    )
}