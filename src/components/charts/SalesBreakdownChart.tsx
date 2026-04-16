"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import SalesBreakdownChartLoader from "../loaders/SalesBreakdownChartLoader"

const COLORS = ["#00388D", "#2F70D9", "#FF914D", "#22C55E", "#A855F7", "#EAB308"]

const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const data = payload[0].payload as SalesBreakdownItem & { color: string }
    return (
        <div className="bg-[#001D4A] text-white p-4 rounded-lg shadow-xl border-none relative">
            <p className="text-sm font-semibold">{data.ticket_type}</p>
            <p className="text-[10px] text-neutral-400 mb-1">{data.count} tickets</p>
            <p className="text-sm font-bold">{data.percentage.toFixed(1)}%</p>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#001D4A] rotate-45" />
        </div>
    )
}

interface SalesBreakdownChartProps {
    overall:   SalesBreakdownItem[]
    isPending: boolean
}

export default function SalesBreakdownChart({ overall, isPending }: SalesBreakdownChartProps) {
    if (isPending) return <SalesBreakdownChartLoader />

    const chartData = overall.map((item, i) => ({
        ...item,
        color: COLORS[i % COLORS.length],
    }))

    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[0px_5.8px_23.17px_0px_#3326AE14] border border-neutral-100">
            <div className="mb-2">
                <h2 className="text-sm font-bold text-brand-secondary-9">Sales Breakdown</h2>
                <p className="text-sm text-brand-secondary-5">Sales by Ticket Type</p>
            </div>

            {overall.length === 0 ? (
                <div className="h-50 w-full flex items-center justify-center text-xs text-brand-neutral-5">
                    No data available
                </div>
            ) : (
                <>
                    <div className="h-50 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip content={<CustomTooltip />} />
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={0}
                                    dataKey="percentage"
                                    stroke="none"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {chartData.map((item) => (
                            <div key={item.ticket_type} className="flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-1">
                                    <div
                                        className="size-2 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap truncate max-w-16">
                                        {item.ticket_type}
                                    </span>
                                </div>
                                <span className="text-sm font-bold text-slate-700">
                                    {item.percentage.toFixed(1)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}