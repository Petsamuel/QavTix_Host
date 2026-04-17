"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { space_grotesk } from "@/lib/fonts";

interface PublishStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'SUCCESS' | 'FAILED';
    eventId?: string;
    errorMessage?: string;
    onCreateAnother?: () => void;
    onViewDashboard?: () => void;
    onShare?: (eventId: string) => void;
    onRetry?: () => void;
}

export default function EventPublishStatusModal({
    isOpen,
    onClose,
    type,
    eventId,
    errorMessage,
    onCreateAnother,
    onViewDashboard,
    onShare,
    onRetry
}: PublishStatusModalProps) {
    const isSuccess = type === 'SUCCESS';

    const handleShareClick = () => {
        if (onShare) onShare(eventId || "")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-160 p-0! overflow-hidden border-none rounded-4xl"
            >
                <DialogTitle className="sr-only">
                    {isSuccess ? "Publish Success" : "Publish Failed"}
                </DialogTitle>

                {/* Background Vector - Mirrored from your alert style */}
                <div className="bg-[url('/images/vectors/logo-bg-element3.svg')] -right-8 md:-right-[10em] opacity-90 h-full w-[70%] bottom-0 absolute bg-contain bg-no-repeat object-bottom pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 z-50 size-7 rounded-full flex items-center justify-center bg-brand-neutral-6 hover:bg-brand-neutral-5 text-white transition-colors"
                >
                    <Icon icon="iconamoon:close-duotone" className="size-5" />
                </button>

                <div className="relative z-10 py-9 px-4 md:px-9 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative size-20 md:size-24 mb-4">
                        <Image
                            src={isSuccess ? "/images/vectors/shield.png" : "/images/vectors/scan-failed.svg"}
                            alt="Status Illustration"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <h2 className={cn(space_grotesk.className, "text-xl md:text-3xl font-bold text-brand-secondary-9 mb-3")}>
                        {isSuccess ? "Event Published Successfully" : "Publishing Failed"}
                    </h2>

                    <p className="text-sm text-brand-secondary-8 mb-6 max-w-lg">
                        {isSuccess ? (
                            <>
                                Your event was successfully published.{" "}
                                <span className="font-bold text-brand-secondary-9">Event ID: {eventId}</span>
                            </>
                        ) : (
                            errorMessage || "Something went wrong while trying to publish your event. Please check your connection and try again."
                        )}
                    </p>

                    {/* Action Area */}
                    <div className="w-full max-w-md space-y-2">
                        <div className="flex flex-col items-center sm:flex-row gap-3 w-full justify-center">
                            {isSuccess ? (
                                <>
                                    <Button
                                        onClick={onCreateAnother}
                                        className={cn(
                                            "text-white w-42 bg-brand-primary-6 font-medium hover:bg-brand-primary-7 hover:shadow-sm text-center px-8 py-3 rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-1",
                                        )}
                                    >
                                        <Icon icon="lucide:plus" className="size-5" /> Create Another
                                    </Button>
                                    <Button 
                                        onClick={onViewDashboard}
                                        className={cn(
                                            "text-white w-42 bg-brand-primary-6 font-medium hover:bg-brand-primary-7 hover:shadow-sm text-center px-8 py-3 rounded-md hover:opacity-90 transition-opacity inline-flex items-center gap-1",
                                        )}
                                    >
                                        View Dashboard <Icon icon="lucide:arrow-right" className="size-5" />
                                    </Button>
                                </>
                            ) : (
                                <Button 
                                    onClick={onRetry}
                                    className="w-48 text-sm bg-brand-primary-6 hover:bg-brand-primary-7 text-white h-12 rounded-xl font-medium"
                                >
                                    Try Again
                                </Button>
                            )}
                        </div>

                        {isSuccess && (
                            <>
                                <div className="relative flex items-center py-2">
                                    <div className="grow border-t border-gray-200"></div>
                                    <span className="shrink mx-4 text-sm font-medium text-gray-400 font-sans">or</span>
                                    <div className="grow border-t border-gray-200"></div>
                                </div>

                                <button
                                    onClick={handleShareClick}
                                    className="text-brand-primary-6 text-sm font-bold hover:underline decoration-2 underline-offset-4 flex items-center justify-center gap-2 w-full transition-all"
                                >
                                    Share Event Link with Friends
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}