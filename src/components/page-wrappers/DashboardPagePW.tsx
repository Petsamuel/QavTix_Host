"use client"

import { useState } from "react"
import OverviewSection from "@/components/dashboard/OverviewSection"
import RevenueGrowthChart from "@/components/charts/RevenueGrowthChart"
import { ChartFilterToggle } from "../dashboard/ChartFilterToggle"

interface DashboardPagePWProps {
    initialData: DashboardOverviewData
}

export default function DashboardPagePW({ initialData }: DashboardPagePWProps) {
    const [chartFilter, setChartFilter] = useState<"revenue" | "tickets">("revenue")

    return (
        <main>
            <OverviewSection cards={initialData.cards} />

            <div className="mt-16">
                <ChartFilterToggle
                    chartFilter={chartFilter}
                    setChartFilter={setChartFilter}
                />
                <RevenueGrowthChart
                    initialChartData={initialData.chart}
                    chartFilter={chartFilter}
                />
            </div>
        </main>
    )
}