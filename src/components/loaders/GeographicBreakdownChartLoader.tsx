"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Wallet, Rocket } from "lucide-react"

const GRAY_LIGHT    = "#E5E7EB"
const GRAY_MID      = "#D1D5DB"
const WHITE_FAINT   = "rgba(255,255,255,0.2)"
const WHITE_DIMMER  = "rgba(255,255,255,0.1)"

// Placeholder bar heights (%) — same as ChartLoader's pattern: varied heights so it doesn't look flat
const BAR_HEIGHTS = [45, 70, 30, 85, 55, 65, 40, 75, 50, 60]

export default function GeographicBreakdownChartLoader() {
    return (
        <div className="w-full bg-white rounded-[32px] p-8 shadow-sm border border-neutral-50">
            {/* Section label */}
            <Skeleton className="h-3 w-36 rounded mb-6" style={{ background: GRAY_LIGHT }} />

            {/* Blue gradient card */}
            <div
                className="w-full rounded-[24px] p-8 mb-10 relative overflow-x-auto"
                style={{ background: "linear-gradient(183.13deg,#2E71D5 2.58%,#0052CC 97.42%)" }}
            >
                {/* "Tickets Sold" label */}
                <span
                    className="text-[11px] absolute top-6 left-8"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                >
                    Tickets Sold
                </span>

                {/* Bar chart skeleton — always shows bars */}
                <div className="mt-4 overflow-x-auto">
                    <div style={{ minWidth: "600px", height: "240px", display: "flex", alignItems: "flex-end", gap: "0", paddingLeft: "8px" }}>
                        {/* Y-axis placeholder */}
                        <div
                            style={{
                                width:          "32px",
                                height:         "100%",
                                display:        "flex",
                                flexDirection:  "column",
                                justifyContent: "space-between",
                                paddingBottom:  "24px",
                                flexShrink:     0,
                            }}
                        >
                            {[5, 4, 3, 2, 1, 0].map(i => (
                                <div
                                    key={i}
                                    style={{
                                        height:       "2px",
                                        width:        "16px",
                                        borderRadius: "2px",
                                        background:   WHITE_FAINT,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Bars column */}
                        <div
                            style={{
                                flex:           1,
                                height:         "100%",
                                display:        "flex",
                                alignItems:     "flex-end",
                                gap:            "12px",
                                paddingBottom:  "24px",
                            }}
                        >
                            {BAR_HEIGHTS.map((pct, i) => (
                                <div
                                    key={i}
                                    style={{
                                        flex:           1,
                                        display:        "flex",
                                        flexDirection:  "column",
                                        alignItems:     "center",
                                        justifyContent: "flex-end",
                                        gap:            "6px",
                                        height:         "100%",
                                    }}
                                >
                                    {/* Bar */}
                                    <div
                                        style={{
                                            width:        "10px",
                                            height:       `${pct}%`,
                                            background:   WHITE_FAINT,
                                            borderRadius: "10px",
                                            animation:    `pulse 1.8s ease-in-out infinite ${i * 0.1}s`,
                                        }}
                                    />
                                    {/* X label */}
                                    <div
                                        style={{
                                            height:       "7px",
                                            width:        "24px",
                                            borderRadius: "3px",
                                            background:   WHITE_DIMMER,
                                            flexShrink:   0,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                {/* Best Location */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-44 rounded" style={{ background: GRAY_MID }} />
                    <Skeleton className="h-3.5 w-28 rounded" style={{ background: GRAY_LIGHT }} />
                </div>

                {/* Purchases */}
                <StatRowLoader icon={<ShoppingCart size={16} className="text-white" />} />

                {/* Revenue */}
                <StatRowLoader icon={<Wallet size={16} className="text-white" />} />

                {/* Clicks */}
                <StatRowLoader icon={<Rocket size={16} className="text-white" />} />
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.6; }
                    50%       { opacity: 1; }
                }
            `}</style>
        </div>
    )
}

function StatRowLoader({ icon }: { icon: React.ReactNode }) {
    const GRAY_LIGHT = "#E5E7EB"
    const GRAY_MID   = "#D1D5DB"
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-primary-4 rounded-lg opacity-40">
                    {icon}
                </div>
                <Skeleton className="h-3 w-16 rounded" style={{ background: GRAY_LIGHT }} />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded" style={{ background: GRAY_MID }} />
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-brand-primary-4 rounded-full"
                        style={{
                            width:     "60%",
                            opacity:   0.3,
                            animation: "pulse 1.8s ease-in-out infinite",
                        }}
                    />
                </div>
            </div>
        </div>
    )
}