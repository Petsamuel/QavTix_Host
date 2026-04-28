"use client"

import {
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts"
import { getNiceTicks, formatYTick } from "@/helper-fns/chartFormatters"
import ChartLoader from "../loaders/ChartLoader"
import { useAppSelector } from "@/lib/redux/hooks"
import { formatPrice } from "@/helper-fns/formatPrice"
import LockedChartOverlay from "./LockedChartOverlay"


interface ChartDataPoint {
    label: string
    value: number
    displayLabel: string
}

interface SalesRevenueGrowthChartProps {
    data: RevenueChartPoint[]
    isPending: boolean
    locked?: boolean
}

const CustomTooltip = ({ active, payload, currency }: any) => {
    if (!active || !payload?.length) return null
    const point = payload[0].payload as ChartDataPoint
    return (
        <div className="bg-white px-3 py-2 text-xs border border-brand-neutral-3 rounded-lg shadow-sm">
            <p className="font-medium text-brand-neutral-8">{point.displayLabel}</p>
            <p className="text-brand-accent-6 font-semibold">
                {formatPrice(payload[0].value ?? 0, currency)}
            </p>
        </div>
    )
}

export default function SalesRevenueGrowthChart({ data, isPending, locked }: SalesRevenueGrowthChartProps) {
    const { user } = useAppSelector(store => store.authUser)
    const currency = user?.currency || ""

    const chartData: ChartDataPoint[] = data ? data.map(d => ({
        label: d.label,
        value: parseFloat(d.amount),
        displayLabel: d.label,
    })) : []

    const maxValue = Math.max(...chartData.map(d => d.value), 0)
    const { ticks, yMax } = getNiceTicks(maxValue)

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-brand-neutral-2 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-b-neutral-5 pb-3">
                <h2 className="text-xs text-brand-secondary-5">Revenue Growth Chart</h2>
            </div>

            {isPending ? (
                <ChartLoader />
            ) : (
                <div className="w-full overflow-x-auto">
                    <div className="min-w-150 h-153">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, bottom: 30 }} barCategoryGap="45%">
                                <CartesianGrid
                                    strokeDasharray="4px"
                                    vertical={false}
                                    stroke="#d4d9e0"
                                    strokeWidth={0.5}
                                />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }}
                                    tickMargin={12}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                                    tickFormatter={formatYTick}
                                    domain={[0, yMax]}
                                    ticks={ticks}
                                    tickMargin={8}
                                />
                                <Tooltip
                                    content={<CustomTooltip currency={currency} />}
                                    cursor={{ fill: "transparent" }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="#FFAB73"
                                    radius={[5, 5, 2, 2]}
                                    maxBarSize={10}
                                    barSize={9}
                                    isAnimationActive
                                    animationBegin={0}
                                    animationDuration={500}
                                    animationEasing="ease-in-out"
                                    background={{ fill: "#E5E7EB", radius: "20px" } as any}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {locked && <LockedChartOverlay />}
        </div>
    )
}