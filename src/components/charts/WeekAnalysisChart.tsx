"use client"

import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import WeekAnalysisChartLoader from "../loaders/WeekAnalysisChartLoader"
import LockedChartOverlay from "./LockedChartOverlay"

interface WeekDay {
    day: string
    date: string
    morning: number
    afternoon: number
    evening: number
    total: number
}

interface WeekAnalysisData {
    change_vs_last_week: number
    label: string
    days: WeekDay[]
}

interface WeekAnalysisChartProps {
    data: WeekAnalysisData | null
    isPending: boolean
    locked?: boolean
}

export default function WeekAnalysisChart({ data, isPending, locked }: WeekAnalysisChartProps) {

    if (isPending) return <WeekAnalysisChartLoader />

    const change = data?.change_vs_last_week ?? 0
    const isPositive = change > 0
    const changeLabel = change === 0
        ? "No change vs last week"
        : `${isPositive ? "↑" : "↓"} ${Math.abs(change).toFixed(1)}% vs last week`

    // Use real values directly
    const chartData = (data?.days ?? []).map(d => ({
        day: d.day,
        morning: d.morning || 0,
        afternoon: d.afternoon || 0,
        evening: d.evening || 0,
    }))

    const hasNoData = !data || chartData.every(d => d.morning === 0 && d.afternoon === 0 && d.evening === 0)

    const maxValue = Math.max(...chartData.map(d => Math.max(d.morning, d.afternoon, d.evening)), 5)

    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-base font-bold text-brand-secondary-9">Week-Based Analysis</h2>
                    <p className="text-xs text-brand-secondary-5">Report from the last 7 days</p>
                    {data?.label && (
                        <p className="text-[11px] text-brand-secondary-5 mt-2">{data.label}</p>
                    )}
                </div>

                {data && (
                    <div className={`flex items-center gap-1 font-semibold text-xs shrink-0 ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                        <span>{changeLabel}</span>
                    </div>
                )}
            </div>

            {hasNoData ? (
                <div className="h-64 flex items-center justify-center text-xs text-slate-400 font-medium">
                    No sales data for this period
                </div>
            ) : (
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                            data={chartData} 
                            margin={{ top: 20, right: 20, left: -10, bottom: 30 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
                                dy={12}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                domain={[0, Math.ceil(maxValue * 1.2)]}
                                tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                                width={45}
                            />

                            <Tooltip
                                cursor={{ stroke: "#E2E8F0", strokeWidth: 2 }}
                                contentStyle={{
                                    fontSize: "13px",
                                    borderRadius: "10px",
                                    border: "none",
                                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                    padding: "10px 12px"
                                }}
                                formatter={(value: number | undefined, name: string | undefined) => [
                                    value,
                                    name === "afternoon" ? "Afternoon" : (name || "").charAt(0).toUpperCase() + (name || "").slice(1)
                                ]}
                            />

                            {/* Morning - Blue */}
                            <Line 
                                type="monotone" 
                                dataKey="morning" 
                                stroke="#3B82F6" 
                                strokeWidth={3.5} 
                                dot={false}
                                activeDot={{ r: 5, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
                            />

                            {/* Afternoon - Slate */}
                            <Line 
                                type="monotone" 
                                dataKey="afternoon" 
                                stroke="#64748B" 
                                strokeWidth={3.5} 
                                dot={false}
                                activeDot={{ r: 5, fill: "#64748B", stroke: "#fff", strokeWidth: 2 }}
                            />

                            {/* Evening - Orange */}
                            <Line 
                                type="monotone" 
                                dataKey="evening" 
                                stroke="#F59E0B" 
                                strokeWidth={3.5} 
                                dot={false}
                                activeDot={{ r: 5, fill: "#F59E0B", stroke: "#fff", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {locked && <LockedChartOverlay />}
        </div>
    )
}