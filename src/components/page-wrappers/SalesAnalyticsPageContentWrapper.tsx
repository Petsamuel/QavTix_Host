"use client"

import { Dispatch, SetStateAction, useRef, useState, useTransition } from "react"
import { DateRange } from "react-day-picker"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"

import {
    getSalesAnalyticsCards,
    getSalesAnalyticsGraphs,
} from "@/actions/sales-n-analytics"

import DateFilter from "../custom-utils/TableDataDisplayAreas/filters/DateFilter"
import { EventFilter } from "../custom-utils/TableDataDisplayAreas/filters/EventFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import {
    analyticsMetricStatCardsConfig2,
} from "../cards/resources/metrics-config"
import AnalyticsMetricsCardsContainer from "../cards/AnalyticsMetricsCardsContainer"
import AnalyticsMetricStatCard2 from "../cards/AnalyticsMetricsCard2"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import { useAppSelector } from "@/lib/redux/hooks"

import SalesRevenueGrowthChart from "../charts/SalesRevenueChart"
import SalesBreakdownChart from "../charts/SalesBreakdownChart"
import WeekAnalysisChart from "../charts/WeekAnalysisChart"
import GeographicBreakdownChart from "../charts/GeographicBreakdownChart"

import { SalesAnalyticsDataTableFilters } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import SalesPaymentsTable from "../custom-utils/TableDataDisplayAreas/tables/SalesPaymentTable"

import { format } from "date-fns"
import { mapSalesAnalyticsCards } from "@/helper-fns/mapToStatCards"

interface Props {
    initialCards:  SalesAnalyticsCardsData
    initialGraphs: SalesAnalyticsGraphsData
}

// If user picks a date range we default to "month"; if no date is selected we
// stay on "month".  The year param is derived from the selected date if present.
function deriveChartFilter(date: DateRange | null): { chart: ChartFilter; year?: number } {
    if (!date?.from) return { chart: "month" }
    return {
        chart: "month",
        year:  new Date(date.from).getFullYear(),
    }
}

export default function SalesAnalyticsPageContentWrapper({
    initialCards,
    initialGraphs,
}: Props) {
    const { user }   = useAppSelector(store => store.authUser)
    const currency   = user?.currency || ""

    // External filters (drive BOTH cards + graphs) 
    const [date,       setDate]       = useState<DateRange | null>(null)
    const [eventId,    setEventId]    = useState<string | null>(null)

    // Cards state with rollback 
    const cardsRef           = useRef<SalesAnalyticsCardsData>(initialCards)
    const [cards, _setCards] = useState<SalesAnalyticsCardsData>(initialCards)
    const [cardsError,  setCardsError]  = useState(false)

    const setCards = (next: SalesAnalyticsCardsData) => {
        cardsRef.current = next
        _setCards(next)
    }

    // Graphs state with rollback
    const graphsRef            = useRef<SalesAnalyticsGraphsData>(initialGraphs)
    const [graphs, _setGraphs] = useState<SalesAnalyticsGraphsData>(initialGraphs)
    const [graphsError, setGraphsError] = useState(false)

    const setGraphs = (next: SalesAnalyticsGraphsData) => {
        graphsRef.current = next
        _setGraphs(next)
    }

    // Loading states 
    const [isCardsLoading,  startCardsTransition]  = useTransition()
    const [isGraphsLoading, startGraphsTransition] = useTransition()

    // Table filters (scoped to the transaction table only) 
    const { filterOptions } = SalesAnalyticsDataTableFilters
    const [tableFilters,    setTableFilters]    = useState<Partial<FilterValues>>({})
    const [selectedPayments, setSelectedPayments] = useState<string[]>([])

    // Fetch helpers

    const fetchCards = (nextDate: DateRange | null, nextEvent: string | null) => {
        startCardsTransition(async () => {
            // Map DateRange → date_range preset (crude mapping; adjust if needed)
            const params: Parameters<typeof getSalesAnalyticsCards>[0] = {}
            if (nextEvent) params.event = nextEvent
            // If the range looks like a single day pick "day", else "month"
            if (nextDate?.from && nextDate?.to) {
                const diffMs   = new Date(nextDate.to).getTime() - new Date(nextDate.from).getTime()
                const diffDays = diffMs / (1000 * 60 * 60 * 24)
                params.date_range = diffDays <= 1 ? "day" : diffDays <= 7 ? "week" : "month"
            }

            const result = await getSalesAnalyticsCards(params)
            if (result.success && result.data) {
                setCards(result.data)
                setCardsError(false)
            } else {
                _setCards(cardsRef.current)
                setCardsError(true)
            }
        })
    }

    const fetchGraphs = (nextDate: DateRange | null, nextEvent: string | null) => {
        startGraphsTransition(async () => {
            const { chart, year } = deriveChartFilter(nextDate)
            const params: Parameters<typeof getSalesAnalyticsGraphs>[0] = { chart }
            if (nextEvent) params.event = nextEvent
            if (year)      params.year  = year

            const result = await getSalesAnalyticsGraphs(params)
            if (result.success && result.data) {
                setGraphs(result.data)
                setGraphsError(false)
            } else {
                _setGraphs(graphsRef.current)
                setGraphsError(true)
            }
        })
    }

    // Handler: date changes
    const handleDateChange = (next: DateRange | null) => {
        setDate(next)
        fetchCards(next, eventId)
        fetchGraphs(next, eventId)
    }

    // Handler: event changes─
    const handleEventChange = (next: string | null) => {
        setEventId(next)
        fetchCards(date, next)
        fetchGraphs(date, next)
    }

    // Derive metric card arrays 
    const row1And2Metrics = mapSalesAnalyticsCards(cards, currency)
    const row1Metrics     = row1And2Metrics.slice(0, 4)   // total_revenue, tickets_sold, conversion, aov
    const row2Cards       = row1And2Metrics.slice(4)      // page_views, refunds, repeat_buyers

    // Row-2 cards piggyback on analyticsMetricStatCardsConfig2 shape:
    // we override the value field from live data
    const liveRow2Config = analyticsMetricStatCardsConfig2.map((cfg, i) => ({
        ...cfg,
        value: row2Cards[i]?.value ?? cfg.value,
    }))

    return (
        <main className="mt-6 pb-12">

            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <DateFilter
                        value={date}
                        onChange={handleDateChange}
                    />
                    <EventFilter
                        value={eventId}
                        onChange={handleEventChange}
                        icon="hugeicons:calendar-02"
                    />
                </div>
                <ExportButton1 showFormatSelector />
            </div>

            <div className="mb-4">
                {isCardsLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <div>
                        <AnalyticsMetricsCardsContainer metrics={row1Metrics} />
                        {cardsError && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                                <span>Could not refresh stats — showing last available data</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_23em] gap-6 py-10">

                <div className="min-w-0 space-y-6">
                    <div className="flex flex-wrap gap-x-2 gap-y-4 md:gap-4">
                        {liveRow2Config.map(config => (
                            <AnalyticsMetricStatCard2 key={config.id} config={config} />
                        ))}
                    </div>

                    <SalesRevenueGrowthChart
                        data={graphs.revenue_chart.data}
                        isPending={isGraphsLoading}
                    />
                </div>

                <div className="space-y-6 min-w-0">
                    <SalesBreakdownChart
                        overall={graphs.sales_breakdown.overall}
                        isPending={isGraphsLoading}
                    />
                    <WeekAnalysisChart
                        data={graphs.week_analysis.locked ? null : graphs.week_analysis.data}
                        isPending={isGraphsLoading}
                    />
                </div>
            </div>

            <GeographicBreakdownChart
                data={graphs.geo_breakdown.locked ? null : graphs.geo_breakdown.data}
                isPending={isGraphsLoading}
            />

            {graphsError && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                    <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                    <span>Could not refresh charts — showing last available data</span>
                </div>
            )}

            <section className="mt-10">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                    Transaction History
                </h3>
                <DataDisplayTableWrapper
                    filters={tableFilters}
                    setFilters={setTableFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                    filterOptions={filterOptions}
                    showSearch
                    searchPlaceholder="Search transactions..."
                >
                    <SalesPaymentsTable
                        selectedPayments={selectedPayments}
                        setSelectedPayments={setSelectedPayments}
                    />
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}