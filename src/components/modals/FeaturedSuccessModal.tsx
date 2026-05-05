"use client"

import { space_grotesk } from "@/lib/fonts";
import Image from "next/image";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { Icon } from "@iconify/react";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import ActionButton1 from "../custom-utils/buttons/ActionBtn1";
import { EVENT_DETAILS_LINK } from "@/enums/navigation";
import { useFeatureCheckout } from "@/contexts/checkout/FeatureCheckoutProvider";

interface FeaturedSuccessModalProps {
    onClose: () => void;
    eventSlug?: string;
}
export default function FeaturedSuccessModal({ onClose, eventSlug }: FeaturedSuccessModalProps) {
    const { resetSuccess, status } = useFeatureCheckout()

    const handleClose = () => { onClose(); resetSuccess() }

    const nextSteps = [
        { icon: "hugeicons:user-id-verification", text: "Increased visibility across the platform", color: "text-blue-500" },
        { icon: "hugeicons:checkmark-badge-03", text: "Featured badge is now live on your event", color: "text-orange-500" },
        { icon: "hugeicons:dollar-circle", text: "Track performance from your dashboard", color: "text-green-500" },
    ]

    return (
        <AnimatedDialog
            open={status === "success"}
            onOpenChange={handleClose}
            showCloseButton={false}
            className="rounded-3xl md:max-w-[26em] pt-0!"
            childrenContainerStyles="px-6 pb-8 pt-0"
        >
            <div className="relative text-center overflow-hidden">
                <Image
                    src="/images/vectors/confetti-lg.svg"
                    alt=""
                    aria-hidden="true"
                    width={500} height={500}
                    className="absolute w-full top-0 left-0 pointer-events-none select-none opacity-60"
                />

                <div className="relative mt-3 z-10 flex flex-col items-center gap-5">
                    <Image
                        src="/images/vectors/publish-status.svg"
                        alt="Success"
                        width={100} height={100}
                    />

                    <div>
                        <DialogTitle className={`text-xl font-bold text-brand-secondary-9 ${space_grotesk.className}`}>
                            Your event is now featured!
                        </DialogTitle>
                        <DialogDescription className="text-brand-secondary-6 text-xs mt-1 max-w-[80%] mx-auto">
                            Added to Featured Events for your selected duration.
                        </DialogDescription>
                    </div>

                    <div className="w-full space-y-2">
                        {nextSteps.map((step, idx) => (
                            <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border border-brand-neutral-2/40 text-left shadow-sm">
                                <Icon icon={step.icon} className={`size-4 shrink-0 ${step.color}`} />
                                <span className="text-xs text-brand-secondary-8">{step.text}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex w-full gap-3 p-1">
                        <button
                            onClick={handleClose}
                            className="flex-1 h-10 rounded-lg border border-brand-primary-6 text-brand-primary-6 font-semibold text-sm"
                        >
                            Go back
                        </button>
                        <ActionButton1
                            buttonText="View Event"
                            icon="solar:arrow-right-linear"
                            iconPosition="right"
                            action={() => {
                                const url = EVENT_DETAILS_LINK.replace("[event_id]", eventSlug?.toString() || "")
                                const a = document.createElement("a")
                                a.href = url
                                a.target = "_blank"
                                a.rel = "noopener noreferrer"
                                a.click()
                            }}
                            className="flex-1 text-sm! rounded-lg! h-10!"
                        />
                    </div>
                </div>
            </div>
        </AnimatedDialog>
    )
}