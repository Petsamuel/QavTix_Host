"use client"
import { Skeleton } from "@/components/ui/skeleton"

const ORANGE = "#fbc07cdc"
const GRAY   = "#E0E0E0"

const bars = [14, 50, 70, 20, 42, 68, 32, 18, 48, 14, 50, 70]

export default function ChartLoader() {
    return (
        <div className="w-full border border-brand-neutral-2 rounded-xl p-5 bg-white dark:bg-neutral-900">
            {/* Chart */}
            <div className="relative w-full">

                {/* Y-axis grid lines */}
                <div className="flex flex-col">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-2.5" style={{ height: "52px" }}>
                            <Skeleton className="w-5 h-2.5 shrink-0 rounded" style={{ background: GRAY }} />
                            <div className="flex-1 h-px bg-brand-neutral-2" />
                        </div>
                    ))}
                </div>

                {/* Bars — absolutely overlaid on the grid */}
                <div className="absolute inset-0 left-7 flex items-end pb-0">
                    <div className="flex items-end justify-around w-full gap-1 px-1" style={{ height: "364px" }}>
                        {bars.map((orangePct, i) => (
                            <div key={i} className="flex flex-col items-center justify-end gap-1.5 flex-1 h-full">
                                <div className="w-full flex gap-0.5 items-end justify-center h-full">
                                    {/* Gray bar — full height background */}
                                    <div
                                        className="rounded-t-sm"
                                        style={{ width: "30%", height: "85%", background: GRAY, borderRadius: "7px 7px 0 0", flexShrink: 0 }}
                                    />
                                    {/* Orange bar — data bar */}
                                    <div
                                        className="rounded-t-sm"
                                        style={{ width: "30%", height: `${orangePct}%`, background: ORANGE, borderRadius: "7px 7px 0 0", flexShrink: 0 }}
                                    />
                                </div>
                                {/* Month label */}
                                <Skeleton className="w-7 h-2.5 rounded" style={{ background: GRAY }} />
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}