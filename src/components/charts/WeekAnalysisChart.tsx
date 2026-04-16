"use client"

import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import WeekAnalysisChartLoader from "../loaders/WeekAnalysisChartLoader"

interface WeekAnalysisChartProps {
    data:      WeekAnalysisData | null
    isPending: boolean
}

export default function WeekAnalysisChart({ data, isPending }: WeekAnalysisChartProps) {
    if (isPending) return <WeekAnalysisChartLoader />

    const change      = data?.change_vs_last_week ?? 0
    const isPositive  = change > 0
    const changeLabel = change === 0
        ? "0% vs last week"
        : `${isPositive ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}% vs last week`

    const chartData = (data?.days ?? []).map(d => ({
        day:     d.day,
        morning: d.morning,
        noon:    d.afternoon,
        evening: d.evening,
    }))

    const isEmpty = !data || chartData.every(d => d.morning === 0 && d.noon === 0 && d.evening === 0)

    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-sm font-bold text-brand-secondary-9">Week-Based Analysis:</h2>
                    <p className="text-xs text-brand-secondary-5">Report from the last 7 days</p>
                    {data?.label && (
                        <p className="text-xs text-brand-secondary-5 mt-2.5 font-medium">
                            {data.label}
                        </p>
                    )}
                </div>
                {data && (
                    <div className={`flex items-center gap-1 font-bold text-xs ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                        <span>{changeLabel}</span>
                    </div>
                )}
            </div>

            {isEmpty ? (
                <div className="h-50 w-full flex items-center justify-center text-xs text-brand-neutral-5">
                    No data for this period
                </div>
            ) : (
                <div className="h-50 w-full overflow-x-auto">
                    <div className="min-w-75 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="day"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#CBD5E1", fontSize: 10 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    ticks={[0, 20, 40, 60]}
                                    tickFormatter={(val) =>
                                        val === 0  ? "0"     :
                                        val === 20 ? "Morn." :
                                        val === 40 ? "Noon"  : "Eve."
                                    }
                                    tick={{ fill: "#94A3B8", fontSize: 10 }}
                                />
                                <Tooltip
                                    cursor={{ stroke: "#E2E8F0", strokeWidth: 1 }}
                                    contentStyle={{
                                        fontSize: "10px",
                                        borderRadius: "8px",
                                        border: "1px solid #E2E8F0",
                                        backgroundColor: "#fff",
                                    }}
                                />
                                <Line type="monotone" dataKey="evening" stroke="#FFD8BE" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                                <Line type="monotone" dataKey="noon"    stroke="#D1D5DB" strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="morning" stroke="#2563EB" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            <p className="text-[10px] text-slate-300 font-bold mt-2">Time</p>
        </div>
    )
}