"use client"

import { SETTINGS_SUB_LINKS } from "@/enums/navigation"
import { Icon } from "@iconify/react"
import { useRouter } from "next/navigation"

export default function LockedChartOverlay() {

    const router = useRouter()

    return (
        <div
            aria-label="Premium feature — upgrade to unlock"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[inherit]"
            style={{
                backdropFilter:       "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                background:           "linear-gradient(135deg, rgba(255, 255, 255, 0.831) 0%, rgba(245,243,255,0.82) 100%)",
            }}
        >
            {/* Lock badge */}
            <div
                className="flex flex-col items-center gap-3 px-6 py-5 rounded-2xl"
                style={{
                    background:  "rgba(255,255,255,0.9)",
                    border:      "1px solid rgba(99,79,212,0.15)",
                    boxShadow:   "0 8px 32px rgba(99,79,212,0.10)",
                }}
            >
                {/* Icon ring */}
                <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                        width:      "44px",
                        height:     "44px",
                        background: "linear-gradient(135deg,#ff7a21 0%,#ff9249 100%)",
                    }}
                >
                    <Icon icon="hugeicons:lock-key" className="text-white w-5 h-5" />
                </div>

                <div className="text-center">
                    <p className="text-[13px] font-bold text-brand-secondary-9 mb-0.5">
                        Premium Feature
                    </p>
                    <p className="text-[11px] text-brand-secondary-4 max-w-40 leading-relaxed">
                        Upgrade your plan to unlock this insight
                    </p>
                </div>

                <button
                    onClick={() => router.push(SETTINGS_SUB_LINKS[2].href)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-4 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                    style={{
                        background: "linear-gradient(135deg,#ff7a21 0%,#ff9249 100%)",
                        color:      "#fff",
                    }}
                >
                    <Icon icon="hugeicons:crown" className="w-3.5 h-3.5" />
                    Upgrade Plan
                </button>
            </div>
        </div>
    )
}