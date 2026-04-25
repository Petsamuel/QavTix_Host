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

    const { status, resetSuccess } = useFeatureCheckout()

    const nextSteps = [
        {
            icon: "hugeicons:user-id-verification",
            text: "Increased visibility across the platform",
            color: "text-blue-500"
        },
        {
            icon: "hugeicons:checkmark-badge-03",
            text: "Your event is now live with a Featured badge",
            color: "text-orange-500"
        },
        {
            icon: "hugeicons:dollar-circle",
            text: "You can track performance from your dashboard",
            color: "text-green-500"
        }
    ]

    return (
        <AnimatedDialog
            open={status === "success"}
            onOpenChange={() => {
                onClose()
                resetSuccess()
            }}
            showCloseButton={false}
            className="rounded-[40px] md:max-w-[32em]"
            childrenContainerStyles="px-8 pt-0! pb-10"
        >
            <div className="text-center relative overflow-hidden">
                {/* Confetti Backgrounds */}
                <Image
                    src="/images/vectors/confetti.svg"
                    alt="" aria-hidden="true"
                    width={500} height={500}
                    className="block md:hidden absolute w-full top-0 left-0 pointer-events-none select-none opacity-70"
                />
                <Image
                    src="/images/vectors/confetti-lg.svg"
                    alt="" aria-hidden="true"
                    width={500} height={500}
                    className="hidden md:block absolute w-full top-0 left-0 pointer-events-none select-none opacity-70"
                />

                <div className="relative z-10 mt-10">
                    {/* Featured Success Indicator Badge */}
                    <div className="relative mx-auto mb-6 w-fit">
                        <Image
                            src="/images/vectors/publish-status.svg"
                            alt="Success"
                            width={122} height={131}
                            className=""
                        />
                    </div>

                    <DialogTitle className={`text-2xl lg:text-3xl font-bold text-brand-secondary-9 mb-2 ${space_grotesk.className}`}>
                        Congrats! Your event is now featured.
                    </DialogTitle>

                    <DialogDescription className="text-brand-secondary-9 text-sm max-w-[85%] mx-auto">
                        Your event has been added to the Featured Events section. It will remain featured for the selected duration.
                    </DialogDescription>

                    {/* Next Steps Section */}
                    <div className="mt-10 space-y-4">
                        <p className="font-medium text-brand-secondary-9 my-4">What happens next:</p>
                        {nextSteps.map((step, idx) => (
                            <div key={idx} className="flex shadow-[0_5.8px_23.17px_0_#3326AE14] items-center gap-4 p-4 bg-white rounded-md border border-brand-neutral-2/40 text-left">
                                <div className={` ${step.color}`}>
                                    <Icon icon={step.icon} className="size-5" />
                                </div>
                                <span className="text-sm text-brand-secondary-8">
                                    {step.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex w-full flex-col gap-5 mt-10">
                        <ActionButton1
                            buttonText="View Featured Event"
                            icon="solar:arrow-right-linear"
                            iconPosition="right"
                            action={() => window.open(EVENT_DETAILS_LINK.replace("[event_id]", eventSlug?.toString() || ""), "_blank")}
                            className="w-full flex-1 text-sm! rounded-md!"
                        />
                        <button
                            onClick={() => {
                                onClose()
                                resetSuccess()
                            }}
                            className="bg-transparent rounded-md border-2 border-brand-primary-6 h-12 text-brand-primary-6 font-semibold w-full"
                        >
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedDialog>
    )
}