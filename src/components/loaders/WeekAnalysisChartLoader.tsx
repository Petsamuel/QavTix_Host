"use client"

import { Skeleton } from "@/components/ui/skeleton"

const GRAY_LIGHT  = "#E0E0E0"
const GRAY_MID    = "#D1D5DB"
const BLUE_LINE   = "#2563EB"
const GRAY_LINE   = "#D1D5DB"
const ORANGE_LINE = "#FFD8BE"

// 7 data points per line — heights encode a plausible wave shape
const MORNING_PTS = [20, 15, 40, 38, 25, 22, 60]
const NOON_PTS    = [30, 45, 15, 50, 35, 40, 42]
const EVENING_PTS = [60, 55, 65, 40, 68, 58, 48]

const W = 300
const H = 120
const PAD_L = 38
const PAD_B = 20
const PAD_T = 8
const CHART_W = W - PAD_L
const CHART_H = H - PAD_B - PAD_T
const MAX_VAL = 80

function toX(i: number) {
    return PAD_L + (i / 6) * CHART_W
}
function toY(v: number) {
    return PAD_T + CHART_H - (v / MAX_VAL) * CHART_H
}
function polyline(pts: number[]) {
    return pts.map((v, i) => `${toX(i)},${toY(v)}`).join(" ")
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export default function WeekAnalysisChartLoader() {
    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="flex justify-between items-start mb-8">
                <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-40 rounded" style={{ background: GRAY_MID }} />
                    <Skeleton className="h-3 w-36 rounded" style={{ background: GRAY_LIGHT }} />
                    <Skeleton className="h-3 w-32 rounded mt-2.5" style={{ background: GRAY_LIGHT }} />
                </div>
                <Skeleton className="h-4 w-24 rounded" style={{ background: GRAY_LIGHT }} />
            </div>

            <div className="h-50 w-full overflow-hidden">
                <div className="min-w-75 h-full">
                    <svg
                        width="100%"
                        viewBox={`0 0 ${W} ${H}`}
                        preserveAspectRatio="none"
                        style={{ display: "block" }}
                    >
                        {[20, 40, 60].map(v => (
                            <line
                                key={v}
                                x1={PAD_L} y1={toY(v)}
                                x2={W}     y2={toY(v)}
                                stroke={GRAY_LIGHT}
                                strokeWidth="0.8"
                                strokeDasharray="3 3"
                            />
                        ))}

                        {(["Morn.", "Noon", "Eve."] as const).map((label, i) => (
                            <text
                                key={label}
                                x={PAD_L - 4}
                                y={toY([20, 40, 60][i]) + 3}
                                textAnchor="end"
                                fontSize="9"
                                fill={GRAY_MID}
                            >
                                {label}
                            </text>
                        ))}

                        <polyline
                            points={polyline(EVENING_PTS)}
                            fill="none"
                            stroke={ORANGE_LINE}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ opacity: 0.4, animation: "pulse 1.8s ease-in-out infinite" }}
                        />

                        <polyline
                            points={polyline(NOON_PTS)}
                            fill="none"
                            stroke={GRAY_LINE}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ opacity: 0.4, animation: "pulse 1.8s ease-in-out infinite 0.3s" }}
                        />

                        <polyline
                            points={polyline(MORNING_PTS)}
                            fill="none"
                            stroke={BLUE_LINE}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ opacity: 0.4, animation: "pulse 1.8s ease-in-out infinite 0.6s" }}
                        />

                        {DAYS.map((day, i) => (
                            <text
                                key={day}
                                x={toX(i)}
                                y={H - 4}
                                textAnchor="middle"
                                fontSize="9"
                                fill={GRAY_LIGHT}
                            >
                                {day}
                            </text>
                        ))}
                    </svg>
                </div>
            </div>

            <Skeleton className="h-2.5 w-6 rounded mt-2" style={{ background: GRAY_LIGHT }} />

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; }
                    50%       { opacity: 0.5; }
                }
            `}</style>
        </div>
    )
}