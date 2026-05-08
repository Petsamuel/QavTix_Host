"use client"

import { useRef, useState, useTransition } from "react"
import {
    LineChart, Line, XAxis, YAxis,
    CartesianGrid, ResponsiveContainer, Tooltip,
} from "recharts"
import { cn } from "@/lib/utils"
import { getNiceTicks, formatYTick } from "@/helper-fns/chartFormatters"
import ChartLoader from "../loaders/ChartLoader"
import { useAppSelector } from "@/lib/redux/hooks"
import { useFormatPrice } from "@/custom-hooks/UseFormatPrice"
import { getCustomerProfile } from "@/actions/customers/client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ChartRange = "day" | "week" | "month"

interface ChartPoint {
    label: string
    value: number
}

function toPoints(data: CustomerProfileChartPoint[]): ChartPoint[] {
    return data.map(d => ({ label: d.label, value: parseFloat(d.amount) }))
}

const CustomTooltip = ({ active, payload, currency, format }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-brand-accent-6 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-semibold">
            {format(payload[0].value ?? 0, currency)}
        </div>
    )
}

interface UserRevenueChartProps {
    userID:      number
    initialData: CustomerProfileChartPoint[]
    className?:  string
}

export function UserRevenueChart({ userID, initialData, className }: UserRevenueChartProps) {

    const { user }    = useAppSelector(store => store.authUser)
    const currency    = user?.currency || ""
    const formatPrice = useFormatPrice()

    const [chartRange,  setChartRange]  = useState<ChartRange>("month")
    const [chartData,   setChartData]   = useState<ChartPoint[]>(() => toPoints(initialData))
    const [isPending,   startTransition] = useTransition()

    // Skip first render — initial data already correct from SSR
    const isFirstRender = useRef(true)

    const handleRangeChange = (range: ChartRange) => {
        setChartRange(range)

        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        startTransition(async () => {
            const result = await getCustomerProfile({
                user_id:     userID,
                chart_range: range,
            })
            if (result.success && result.data?.revenue_chart) {
                setChartData(toPoints(result.data.revenue_chart))
            }
        })
    }

    const maxValue        = Math.max(...chartData.map(d => d.value), 0)
    const { ticks, yMax } = getNiceTicks(maxValue)

    return (
        <div className={cn("bg-white rounded-2xl border border-brand-neutral-2 p-6", className)}>
            <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xs font-medium text-brand-secondary-5">Revenue Chart</h3>
                <Select value={chartRange} onValueChange={(v) => handleRangeChange(v as ChartRange)}>
                    <SelectTrigger className="w-fit capitalize font-medium h-9 text-xs border-neutral-3 text-brand-secondary-8">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {(["day", "week", "month"] as ChartRange[]).map((filter) => (
                            <SelectItem key={filter} value={filter} className="text-xs capitalize">
                                {filter}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {isPending ? (
                <ChartLoader />
            ) : (
                <div className="w-full overflow-x-auto">
                    <div className="min-w-150 h-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                key={chartRange}
                                data={chartData}
                                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="0"
                                    vertical={false}
                                    stroke="#F3F4F6"
                                    strokeWidth={1}
                                />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
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
                                    content={<CustomTooltip currency={currency} format={formatPrice} />}
                                    cursor={{ stroke: "#FF7A00", strokeWidth: 1 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#FF7A00"
                                    strokeWidth={3}
                                    dot={{ fill: "#FF7A00", r: 5 }}
                                    activeDot={{ r: 7, fill: "#FF7A00", stroke: "#fff", strokeWidth: 2 }}
                                    isAnimationActive
                                    animationDuration={400}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    )
}