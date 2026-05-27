"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import OverviewSection from "@/components/dashboard/OverviewSection"
import RevenueGrowthChart from "@/components/charts/RevenueGrowthChart"
import { ChartFilterToggle } from "../dashboard/ChartFilterToggle"
import { exportData } from "@/helper-fns/exportData"
import { getDashboardOverview } from "@/actions/dashboard/client"
import { DASHBOARD_OVERVIEW_ENDPOINT } from "@/endpoints"

interface DashboardPagePWProps {
    initialData: DashboardOverviewData
}

export default function DashboardPagePW({ initialData }: DashboardPagePWProps) {
    const [chartFilter, setChartFilter] = useState<"revenue" | "tickets">("revenue")

    const { data: overviewData } = useQuery({
        queryKey: [DASHBOARD_OVERVIEW_ENDPOINT],
        queryFn: async () => {
            const res = await getDashboardOverview()
            if (!res.success || !res.data) {
                throw new Error(res.message ?? "Failed to load dashboard overview")
            }
            return res.data
        },
        initialData,
    })

    const [currentChart, setCurrentChart] = useState<DashboardChartPoint[]>(overviewData.chart)

    return (
        <main>
            <OverviewSection cards={overviewData.cards} />

            <div className="mt-16">
                <ChartFilterToggle
                    chartFilter={chartFilter}
                    setChartFilter={setChartFilter}
                    onExport={(format) =>
                        exportData({
                            data: currentChart as unknown as Record<string, unknown>[],
                            format,
                            filename: `${chartFilter}_chart`,
                            title: chartFilter === "revenue" ? "Revenue Growth" : "Tickets Sold",
                        })
                    }
                />
                <RevenueGrowthChart
                    initialChartData={overviewData.chart}
                    chartFilter={chartFilter}
                    onChartDataChange={setCurrentChart}
                />
            </div>
        </main>
    )
}