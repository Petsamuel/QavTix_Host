"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ShareModalProps {
    isOpen:   boolean;
    onClose:  () => void;
    shareUrl: string;
    title?:   string;
}

type SocialPlatform = {
    name:       string
    icon:       string
    bgColor:    string
    noShareApi: boolean
    tooltip?:   string
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
    { name: "Facebook",  icon: "logos:facebook",         bgColor: "bg-[#E7EAF3]", noShareApi: false },
    { name: "Instagram", icon: "skill-icons:instagram",  bgColor: "bg-[#FDE2E9]", noShareApi: false },
    { name: "Twitter",   icon: "ri:twitter-x-fill",      bgColor: "bg-[#F0F0F0]", noShareApi: false },
    { name: "WhatsApp",  icon: "logos:whatsapp-icon",     bgColor: "bg-[#E1F3E6]", noShareApi: false },
]

const buildShareHref = (name: string, encodedUrl: string, encodedFullText: string): string | null => {
    switch (name) {
        case "Facebook":  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
        case "Twitter":   return `https://twitter.com/intent/tweet?text=${encodedFullText}`
        case "WhatsApp":  return `https://wa.me/?text=${encodedFullText}`
        case "Instagram": return `https://www.instagram.com/` // Fallback to opening Instagram site
        default:          return null
    }
}

const buildShareText = (title: string | undefined, shareUrl: string) =>
    encodeURIComponent(title ? `Check out ${title}! 🎉 Get your tickets now: ${shareUrl}` : `Check out this event! Get your tickets now: ${shareUrl}`)


export default function ShareEventModal({ isOpen, onClose, shareUrl, title }: ShareModalProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
        } catch {
            const input = document.createElement("input")
            input.value = shareUrl
            document.body.appendChild(input)
            input.select()
            document.execCommand("copy")
            document.body.removeChild(input)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const encodedUrl      = encodeURIComponent(shareUrl)
    const encodedFullText = buildShareText(title, shareUrl)

    const handlePlatformClick = (platform: SocialPlatform) => {
        if (platform.noShareApi) {
            handleCopy()
            return
        }
        const href = buildShareHref(platform.name, encodedUrl, encodedFullText)
        if (href) window.open(href, "_blank", "noopener,noreferrer,width=600,height=500")
    }

    return (
        <AnimatedDialog open={isOpen} showCloseButton={false} className="md:max-w-md py-4">
            <button
                onClick={onClose}
                className="absolute right-4 size-7 flex justify-center items-center top-12 z-50 rounded-full p-1 bg-brand-neutral-6 hover:bg-brand-neutral-5 text-white transition-colors"
            >
                <Icon icon="iconamoon:close-duotone" width="24" height="24" className="size-7" />
            </button>

            <DialogHeader className="text-center mb-7">
                <DialogTitle className="text-xl text-center font-bold text-brand-secondary-9">
                    Share with Friends
                </DialogTitle>
                <DialogDescription className="text-sm text-center text-brand-secondary-7">
                    Share this event with your network
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-8">
                {/* Social Share Grid */}
                <div className="space-y-4">
                    <label className="text-sm font-bold text-brand-secondary-9 block">Share to</label>
                    <div className="grid grid-cols-4 gap-2">
                        {SOCIAL_PLATFORMS.map((platform) => (
                            <div key={platform.name} className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => handlePlatformClick(platform)}
                                    title={platform.tooltip}
                                    className={cn(
                                        "size-12 rounded-md flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95",
                                        platform.bgColor
                                    )}
                                >
                                    <Icon icon={platform.icon} className="size-7" />
                                </button>
                                <span className="text-[10px] text-brand-secondary-6 text-center leading-tight">
                                    {platform.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Copy Link */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-brand-secondary-9 block">Copy link</label>
                    <div className="flex items-center bg-[#F4F5F6] border border-[#D0D5DD] rounded-xl px-4 py-3 gap-3">
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="bg-transparent border-none outline-none text-sm text-brand-secondary-7 w-full focus:ring-0 truncate cursor-default"
                        />
                        <div className="h-6 w-[1.5px] bg-[#D0D5DD] shrink-0" />
                        <button
                            onClick={handleCopy}
                            title={copied ? "Copied!" : "Copy to clipboard"}
                            className={cn(
                                "shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md transition-all duration-200",
                                copied
                                    ? "text-brand-primary bg-brand-primary-1"
                                    : "text-brand-secondary-6 hover:text-brand-primary hover:bg-brand-primary-1"
                            )}
                        >
                            <Icon icon={copied ? "lucide:check-check" : "solar:copy-bold-duotone"} className="size-4" />
                            <span>{copied ? "Copied!" : "Copy"}</span>
                        </button>
                    </div>
                </div>
            </div>
        </AnimatedDialog>
    )
}