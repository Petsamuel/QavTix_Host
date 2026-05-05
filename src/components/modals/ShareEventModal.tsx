"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareUrl: string;
}

export default function ShareEventModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link", err);
        }
    }

    const socialPlatforms = [
        { name: "Facebook", icon: "logos:facebook", bgColor: "bg-[#E7EAF3]" },
        { name: "Instagram", icon: "skill-icons:instagram", bgColor: "bg-[#FDE2E9]" },
        { name: "Twitter", icon: "ri:twitter-x-fill", bgColor: "bg-[#F0F0F0]" },
        { name: "Whatsapp", icon: "logos:whatsapp-icon", bgColor: "bg-[#E1F3E6]" },
        { name: "Tiktok", icon: "logos:tiktok-icon", bgColor: "bg-[#E1E1E1]" },
    ]

    return (
        <AnimatedDialog
            open={isOpen}
            showCloseButton={false}
            className="md:max-w-md py-5"
        >
            <button
                onClick={onClose}
                className="absolute right-4 size-7 flex justify-center items-center top-6 z-50 rounded-full p-1 bg-brand-neutral-6 hover:bg-brand-neutral-5 text-white transition-colors"
            >
                <Icon icon="iconamoon:close-duotone" width="24" height="24" className="size-7" />
            </button>
            <DialogHeader className="text-center mb-8">
                <DialogTitle className="text-xl text-center font-bold text-brand-secondary-9">
                    Share with Friends
                </DialogTitle>
                <DialogDescription className="text-sm text-center text-brand-secondary-7">
                    Share Event Ticket purchase link with others
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-8">
                {/* Copy Link Section */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-brand-secondary-9 block mb-2">Copy your link</label>
                    <div className="relative flex items-center bg-[#F4F5F6] border border-[#D0D5DD] rounded-xl px-4 py-3">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="bg-transparent border-none outline-none text-sm text-brand-secondary-7 w-full pr-4 focus:ring-0 truncate"
                        />

                        <div className="flex items-center gap-3">
                            <div className="h-6 w-[1.5px] bg-[#D0D5DD]" />

                            <div className={cn(
                                "size-5 rounded-sm flex items-center justify-center transition-all duration-300",
                                copied ? "bg-brand-primary text-white" : "bg-brand-primary-3 text-white"
                            )}>
                                <Icon icon={copied ? "lucide:check-check" : "lucide:check"} className="size-3 stroke-3" />
                            </div>

                            <button
                                onClick={handleCopy}
                                className="text-brand-secondary-5 hover:text-brand-primary active:scale-90 transition-all"
                                title="Copy to clipboard"
                            >
                                <Icon icon="solar:copy-bold-duotone" className="size-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Social Share Grid */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-brand-secondary-9 block mb-2">Share to</label>
                    <div className="grid grid-cols-5 gap-2">
                        {socialPlatforms.map((platform) => (
                            <div key={platform.name} className="flex flex-col items-center gap-2.5">
                                <button
                                    className={cn(
                                        "size-12 rounded-md flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg",
                                        platform.bgColor
                                    )}
                                >
                                    <Icon icon={platform.icon} className="size-7" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AnimatedDialog>
    );
}