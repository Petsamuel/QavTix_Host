"use client"

import {
    BarChart, Bar, XAxis, YAxis,
    ResponsiveContainer, Tooltip,
} from "recharts"
import { ShoppingCart, Wallet, Rocket } from "lucide-react"
import { useAppSelector } from "@/lib/redux/hooks"
import { formatPrice } from "@/helper-fns/formatPrice"
import GeographicBreakdownChartLoader from "../loaders/GeographicBreakdownChartLoader"

// Placeholder bars shown when there is no real location data.
// They give the chart a populated look so the card is never scanty.
const PLACEHOLDER_BARS = [
    { location: "—", tickets: 45 },
    { location: "—", tickets: 70 },
    { location: "—", tickets: 30 },
    { location: "—", tickets: 85 },
    { location: "—", tickets: 55 },
    { location: "—", tickets: 65 },
    { location: "—", tickets: 40 },
    { location: "—", tickets: 75 },
    { location: "—", tickets: 50 },
    { location: "—", tickets: 60 },
]

interface GeographicBreakdownChartProps {
    data:      GeoBreakdownData | null
    isPending: boolean
}

export default function GeographicBreakdownChart({ data, isPending }: GeographicBreakdownChartProps) {
    if (isPending) return <GeographicBreakdownChartLoader />

    const { user }  = useAppSelector(store => store.authUser)
    const currency  = user?.currency || ""

    const locations = data?.locations ?? []
    const best      = data?.best_location
    const hasData   = locations.length > 0

    // Use real data if available, fall back to placeholders
    const chartData = hasData
        ? locations.map(l => ({ location: l.city, tickets: l.tickets }))
        : PLACEHOLDER_BARS

    // Progress percentages — relative to max across all locations
    const maxTickets = hasData ? Math.max(...locations.map(l => l.tickets),         1) : 1
    const maxRevenue = hasData ? Math.max(...locations.map(l => parseFloat(l.revenue)), 1) : 1
    const maxClicks  = hasData ? Math.max(...locations.map(l => l.clicks),          1) : 1

    const bestTickets = best?.tickets             ?? 0
    const bestRevenue = parseFloat(best?.revenue  ?? "0")
    const bestClicks  = best?.clicks              ?? 0

    const ticketsPct = hasData ? Math.round((bestTickets / maxTickets) * 100) : 0
    const revenuePct = hasData ? Math.round((bestRevenue / maxRevenue) * 100) : 0
    const clicksPct  = hasData ? Math.round((bestClicks  / maxClicks)  * 100) : 0

    return (
        <div className="w-full bg-white rounded-[32px] p-8 shadow-sm border border-neutral-50">
            <h2 className="text-brand-secondary-5 text-xs mb-6">Geographic Breakdown</h2>

            {/* Blue gradient chart card */}
            <div className="w-full bg-[linear-gradient(183.13deg,#2E71D5_2.58%,#0052CC_97.42%)] rounded-[24px] p-8 mb-10 relative overflow-x-auto">
                <span className="text-white text-[11px] absolute top-6 left-8">Tickets Sold</span>

                <div className="h-60 min-w-150 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 20, right: 0, left: -30, bottom: 0 }}
                        >
                            <XAxis
                                dataKey="location"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: hasData ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", fontSize: 11 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: hasData ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", fontSize: 11 }}
                            />
                            {hasData && (
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.1)" }}
                                    contentStyle={{
                                        borderRadius:    "12px",
                                        border:          "none",
                                        backgroundColor: "#FFFFFF",
                                        fontSize:        "11px",
                                        boxShadow:       "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                    }}
                                    itemStyle={{ color: "#0F172A", fontWeight: 600, padding: 0, textTransform: "capitalize" }}
                                    labelStyle={{ color: "#64748B", marginBottom: "4px", textTransform: "capitalize" }}
                                />
                            )}
                            <Bar
                                dataKey="tickets"
                                fill={hasData ? "#FFFFFF" : "rgba(255,255,255,0.2)"}
                                radius={[10, 10, 10, 10]}
                                barSize={10}
                                isAnimationActive={hasData}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {!hasData && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-white/40 text-xs">No geographic data available</span>
                    </div>
                )}
            </div>

            {/* Stats bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                <div className="space-y-1">
                    <h3 className="text-brand-secondary-9 font-bold">Best Performing Location</h3>
                    <p className="text-brand-secondary-3 text-sm">{best?.label ?? "—"}</p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-secondary-3 font-bold">
                        <div className="p-2 bg-brand-primary-4 rounded-lg"><ShoppingCart size={16} className="text-white" /></div>
                        <span className="text-xs">Purchases</span>
                    </div>
                    <div className="space-y-2">
                        <span className="font-bold text-brand-secondary-9 mb-2">{bestTickets.toLocaleString()}</span>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary-4 rounded-full" style={{ width: `${ticketsPct}%` }} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-secondary-3 font-bold">
                        <div className="p-2 bg-brand-primary-4 rounded-lg"><Wallet size={16} className="text-white" /></div>
                        <span className="text-xs">Revenue</span>
                    </div>
                    <div className="space-y-2">
                        <span className="font-bold text-brand-secondary-9 mb-2">{formatPrice(bestRevenue, currency)}</span>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary-4 rounded-full" style={{ width: `${revenuePct}%` }} />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-brand-secondary-3 font-bold">
                        <div className="p-2 bg-brand-primary-4 rounded-lg"><Rocket size={16} className="text-white" /></div>
                        <span className="text-xs">Clicks</span>
                    </div>
                    <div className="space-y-2">
                        <span className="font-bold text-brand-secondary-9 mb-2">{bestClicks.toLocaleString()}</span>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary-4 rounded-full" style={{ width: `${clicksPct}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}