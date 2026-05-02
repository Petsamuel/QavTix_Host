"use client"

import { useState, useEffect, useTransition, useRef } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    ResponsiveContainer, Tooltip,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { formatYTick, getNiceTicks } from "@/helper-fns/chartFormatters"
import ChartLoader from "../loaders/ChartLoader"
import { useAppSelector } from "@/lib/redux/hooks"
import { formatPrice } from "@/helper-fns/formatPrice"
import { getDashboardOverview } from "@/actions/dashboard/client"

type TimeFilter = "annual" | "month" | "week"

interface ChartDataPoint {
    label: string
    value: number
    displayLabel: string
}

interface RevenueGrowthChartProps {
    initialChartData: DashboardChartPoint[]
    chartFilter: "revenue" | "tickets"
    onChartDataChange?: (data: DashboardChartPoint[]) => void
}

const YEARS = ["2023", "2024", "2025", "2026"]
const CURRENT_YEAR = String(new Date().getFullYear())

function toChartPoints(data: DashboardChartPoint[]): ChartDataPoint[] {
    return data.map(d => ({
        label: d.label,
        displayLabel: d.label,
        value: parseFloat(d.amount),
    }))
}

function buildParams(
    timeFilter: TimeFilter,
    selectedYear: string,
    chartFilter: "revenue" | "tickets",
): DashboardOverviewParams {
    const params: DashboardOverviewParams = {
        chart_type: chartFilter,
        year: parseInt(selectedYear),
    }
    if (timeFilter === "month") params.month = new Date().getMonth() + 1
    if (timeFilter === "week") { params.week = true; delete params.year; delete params.month }
    return params
}

const CustomTooltip = ({ active, payload, chartFilter }: any) => {
    const { user } = useAppSelector(store => store.authUser)
    if (!active || !payload?.length) return null
    const point = payload[0].payload as ChartDataPoint
    return (
        <div className="bg-white px-3 py-2 text-xs border border-brand-neutral-3 rounded-lg shadow-sm">
            <p className="font-medium text-brand-neutral-8">{point.displayLabel}</p>
            <p className="text-brand-accent-6 font-semibold">
                {chartFilter === "revenue"
                    ? `${formatPrice((payload[0].value ?? 0), user?.currency)}`
                    : `${payload[0].value?.toLocaleString()} tickets`
                }
            </p>
        </div>
    )
}

export default function RevenueGrowthChart({
    initialChartData,
    chartFilter,
    onChartDataChange,
}: RevenueGrowthChartProps) {
    const [timeFilter, setTimeFilter] = useState<TimeFilter>("annual")
    const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
    const [chartData, setChartData] = useState<ChartDataPoint[]>(() => toChartPoints(initialChartData))
    const [isPending, startTransition] = useTransition()

    const hasMountedRef = useRef(false)
    const renderCount = useRef(0)
    renderCount.current += 1
    console.log(`[RevenueGrowthChart] render #${renderCount.current}`, {
        timeFilter, selectedYear, chartFilter,
        hasMounted: hasMountedRef.current,
    })

    useEffect(() => {
        if (!hasMountedRef.current) {
            hasMountedRef.current = true
            console.log("[RevenueGrowthChart] MOUNT — skipping fetch, using initialChartData")
            return
        }

        console.log("[RevenueGrowthChart] FETCH triggered by:", { timeFilter, selectedYear, chartFilter })
        const params = buildParams(timeFilter, selectedYear, chartFilter)

        startTransition(async () => {
            const result = await getDashboardOverview(params)
            if (result.success && result.data?.chart) {
                const points = toChartPoints(result.data.chart)
                setChartData(points)
                onChartDataChange?.(result.data.chart)
            }
        })
    }, [timeFilter, selectedYear, chartFilter])

    const maxValue = Math.max(...chartData.map(d => d.value), 0)
    const { ticks, yMax } = getNiceTicks(maxValue)
    const chartTitle = chartFilter === "revenue" ? "Revenue Growth Chart" : "Tickets Sold Chart"

    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-brand-neutral-2">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <h2 className="text-xs text-brand-secondary-5">{chartTitle}</h2>
                    {timeFilter === "annual" && (
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-20 text-xs h-9 border-brand-neutral-3 font-bold text-brand-secondary-9 rounded-lg">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {YEARS.map(year => (
                                    <SelectItem key={year} value={year} className="text-xs">{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="flex items-center gap-2 bg-brand-primary-1 rounded-lg py-1 px-2">
                    {(["annual", "month", "week"] as TimeFilter[]).map(f => (
                        <button
                            key={f}
                            onClick={() => setTimeFilter(f)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-xs font-medium transition-all capitalize",
                                timeFilter === f
                                    ? "bg-brand-primary-6 text-white shadow-sm"
                                    : "text-brand-neutral-7 hover:text-brand-neutral-9"
                            )}
                        >
                            {f === "annual" ? "Annual" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {isPending ? (
                <ChartLoader />
            ) : (
                <div className="w-full overflow-x-auto">
                    <div className="min-w-150 h-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                key={`${timeFilter}-${selectedYear}-${chartFilter}`}
                                data={chartData}
                                margin={{ top: 10, bottom: 30 }}
                                barCategoryGap="45%"
                            >
                                <CartesianGrid strokeDasharray="4px" vertical={false} stroke="#d4d9e0" strokeWidth={0.5} />
                                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12, fontWeight: 500 }} tickMargin={12} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} tickFormatter={formatYTick} domain={[0, yMax]} ticks={ticks} tickMargin={8} />
                                <Tooltip content={<CustomTooltip chartFilter={chartFilter} />} cursor={{ fill: "transparent" }} />
                                <Bar dataKey="value" fill="#FFAB73" radius={[4, 4, 2, 2]} maxBarSize={7} barSize={8} isAnimationActive={true} animationBegin={0} animationDuration={500} animationEasing="ease-in-out" background={{ fill: "#E5E7EB", radius: "16px" }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    )
}