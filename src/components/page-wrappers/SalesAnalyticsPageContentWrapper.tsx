"use client"



import { useState } from "react"
import { DateRange } from "react-day-picker"
import DateFilter from "../custom-utils/TableDataDisplayAreas/filters/DateFilter"
import { EventTypeFilter } from "../custom-utils/TableDataDisplayAreas/filters/EventFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import { buildMetricsFromConfig } from "@/helper-fns/buildMetricsConfig"
import { analyticsMetricStatCardsConfig2, salesAnalyticsMetricsConfig } from "../cards/resources/metrics-config"
import SalesBreakdownChart from "../charts/SalesBreakdownChart"
import WeekAnalysisChart from "../charts/WeekAnalysisChart"
import SalesRevenueGrowthChart from "../charts/SalesRevenueChart"
import GeographicBreakdownChart from "../charts/GeographicBreakdownChart"
import { SalesAnalyticsDataTableFilters } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import SalesPaymentsTable from "../custom-utils/TableDataDisplayAreas/tables/SalesPaymentTable"
import AnalyticsMetricsCardsContainer from "../cards/AnalyticsMetricsCardsContainer"
import AnalyticsMetricStatCard2 from "../cards/AnalyticsMetricsCard2"


interface IMetricsDataFilter {
    date: DateRange | null,
    eventType: string[]
}

export default function SalesAnalyticsPageContentWrapper(){


    const { filterOptions } = SalesAnalyticsDataTableFilters;
    const [metricsDataFilter, setMetricsDataFilter] =  useState<IMetricsDataFilter>({
        date: null,
        eventType: []
    })

    const [filters, setFilters] = useState<Partial<FilterValues>>({})

    const apiData = {
        'total-revenue': 612,
        'tickets-sold': 547,
        'conversion-rate': 17,
        'average-order-value': 5500
    }

    const analyticsMetrics = buildMetricsFromConfig(salesAnalyticsMetricsConfig, apiData)
    const [selectedPayments, setSelectedPayment] = useState<string[]>([])

    return (
        <main className="mt-6 pb-12">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <DateFilter value={metricsDataFilter.date} onChange={(v) => setMetricsDataFilter(prev => ({...prev, date: v}))} />
                    <EventTypeFilter onChange={(v) => setMetricsDataFilter(prev => ({...prev, eventType: v}))} />
                </div>

                <ExportButton1 showFormatSelector />
            </div>

            <div>
                <AnalyticsMetricsCardsContainer metrics={analyticsMetrics} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_23em] gap-6 py-10">
                <div className="min-w-0 space-y-6">
                    <div className="flex flex-wrap gap-x-2 gap-y-4 md:gap-4">
                        {analyticsMetricStatCardsConfig2.map(config => (
                            <AnalyticsMetricStatCard2 key={config.id} config={config} />
                        ))}
                    </div>
                    <SalesRevenueGrowthChart />
                </div>

                <div className="space-y-6 min-w-0">
                    <SalesBreakdownChart />
                    <WeekAnalysisChart />
                </div>
            </div>


            <GeographicBreakdownChart />


            <section className="mt-10">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>Transaction History</h3>
                <DataDisplayTableWrapper 
                    filters={filters}
                    setFilters={setFilters}
                    filterOptions={filterOptions}
                    showSearch={true}
                    searchPlaceholder="Search transactions..."
                >
                    <SalesPaymentsTable selectedPayments={selectedPayments} setSelectedPayments={setSelectedPayment}  />
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}