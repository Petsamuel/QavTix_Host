"use client"

import { Skeleton } from "@/components/ui/skeleton"

const BLUE_DARK  = "#00388D"
const BLUE_MID   = "#2F70D9"
const ORANGE     = "#FF914D"
const GRAY_LIGHT = "#E0E0E0"
const GRAY_MID   = "#D1D5DB"

export default function SalesBreakdownChartLoader() {
    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[0px_5.8px_23.17px_0px_#3326AE14] border border-neutral-100">
            {/* Header */}
            <div className="mb-2 space-y-1.5">
                <Skeleton className="h-3.5 w-32 rounded" style={{ background: GRAY_LIGHT }} />
                <Skeleton className="h-3 w-40 rounded" style={{ background: GRAY_LIGHT }} />
            </div>

            {/* Donut ring */}
            <div className="h-50 w-full flex items-center justify-center">
                <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                    <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                        {/*
                         * Three arcs that mimic the donut segments.
                         * innerRadius=60, outerRadius=90 → ring width=30
                         * We draw stroked circles with strokeWidth=30 and strokeDasharray
                         * to fake each arc segment.
                         * circumference of r=75 (midpoint) ≈ 471
                         */}
                        <circle
                            cx="90" cy="90" r="75"
                            fill="none"
                            stroke={BLUE_DARK}
                            strokeWidth="30"
                            strokeDasharray={`${471 * 0.94} ${471 * 0.06}`}
                            strokeDashoffset="0"
                            strokeLinecap="butt"
                            style={{ opacity: 0.25, animation: "pulse 1.8s ease-in-out infinite" }}
                        />
                        <circle
                            cx="90" cy="90" r="75"
                            fill="none"
                            stroke={BLUE_MID}
                            strokeWidth="30"
                            strokeDasharray={`${471 * 0.03} ${471 * 0.97}`}
                            strokeDashoffset={`-${471 * 0.94}`}
                            strokeLinecap="butt"
                            style={{ opacity: 0.25, animation: "pulse 1.8s ease-in-out infinite 0.3s" }}
                        />
                        <circle
                            cx="90" cy="90" r="75"
                            fill="none"
                            stroke={ORANGE}
                            strokeWidth="30"
                            strokeDasharray={`${471 * 0.03} ${471 * 0.97}`}
                            strokeDashoffset={`-${471 * 0.97}`}
                            strokeLinecap="butt"
                            style={{ opacity: 0.25, animation: "pulse 1.8s ease-in-out infinite 0.6s" }}
                        />
                        {/* Center hole */}
                        <circle cx="90" cy="90" r="59" fill="white" />
                    </svg>
                </div>
            </div>

            {/* Legend row — 3 items */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                {[BLUE_DARK, BLUE_MID, ORANGE].map((color, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full" style={{ backgroundColor: color, opacity: 0.3 }} />
                            <Skeleton className="h-2.5 w-14 rounded" style={{ background: GRAY_LIGHT }} />
                        </div>
                        <Skeleton className="h-4 w-8 rounded" style={{ background: GRAY_MID }} />
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.15; }
                    50%       { opacity: 0.35; }
                }
            `}</style>
        </div>
    )
}