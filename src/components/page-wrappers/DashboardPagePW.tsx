"use client"

import { useState } from "react"
import OverviewSection from "@/components/dashboard/OverviewSection"
import RevenueGrowthChart from "@/components/charts/RevenueGrowthChart"
import { ChartFilterToggle } from "../dashboard/ChartFilterToggle"
import { exportData } from "@/helper-fns/exportData"
// import { useIsMounted } from "@/custom-hooks/UseIsMounted"

interface DashboardPagePWProps {
    initialData: DashboardOverviewData
}

export default function DashboardPagePW({ initialData }: DashboardPagePWProps) {
    const [chartFilter, setChartFilter] = useState<"revenue" | "tickets">("revenue")
    const [currentChart, setCurrentChart] = useState<DashboardChartPoint[]>(initialData.chart)
    // const isMounted = useIsMounted()

    return (
        <main>
            <OverviewSection cards={initialData.cards} />

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
                    initialChartData={initialData.chart}
                    chartFilter={chartFilter}
                    onChartDataChange={setCurrentChart}
                />
            </div>
        </main>
    )
}