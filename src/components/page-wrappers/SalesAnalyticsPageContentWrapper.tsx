"use client"

import { Dispatch, SetStateAction, useRef, useState, useTransition } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"

import {
    getSalesAnalyticsCardsClient,
    getSalesAnalyticsGraphsClient,
} from "@/actions/sales-n-analytics/client"

import { EventFilter } from "../custom-utils/TableDataDisplayAreas/filters/EventFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import {
    analyticsMetricStatCardsConfig2
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
import { deriveChartFilter } from "@/helper-fns/dateRangeToParams"
import { mapSalesAnalyticsCards } from "@/helper-fns/mapToStatCards"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import DateRangePresetFilter from "../custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import { SALES_ANALYTICS_TRANSACTIONS_ENDPOINT } from "@/endpoints"
import ChartPresetFilter from "../custom-utils/TableDataDisplayAreas/filters/ChartPresetFilter"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { exportSalesAnalyticsFull } from "@/helper-fns/exportData"
import GatedPageModal from "../modals/GatedPageModal"


interface Props {
    initialCards: SalesAnalyticsCardsData
    initialGraphs: SalesAnalyticsGraphsData
    initialTransactions: TabSlice<Transaction>
}


export default function SalesAnalyticsPageContentWrapper(props: Props) {
    const { user } = useAppSelector(store => store.authUser)

    if (user && user.plan_type !== "pro" && user.plan_type !== "enterprise") {
        return <GatedPageModal type="plan" featureName="Sales Analytics" requiredPlan="Pro" />
    }

    return <SalesAnalyticsPageClient {...props} />
}


function SalesAnalyticsPageClient({
    initialCards,
    initialGraphs,
    initialTransactions,
}: Props) {
    const { user } = useAppSelector(store => store.authUser)
    const currency = user?.currency || ""
    const isMounted = useIsMounted()

    // External filters (drive BOTH cards + graphs)
    const [date, setDate] = useState<DatePreset | null>(null)
    const [chartPreset, setChartPreset] = useState<ChartPreset | null>(null)
    const [eventId, setEventId] = useState<string | null>(null)

    // Cards state with rollback 
    const cardsRef = useRef<SalesAnalyticsCardsData>(initialCards)
    const [cards, _setCards] = useState<SalesAnalyticsCardsData>(initialCards)
    const [cardsError, setCardsError] = useState(false)

    const setCards = (next: SalesAnalyticsCardsData) => {
        cardsRef.current = next
        _setCards(next)
    }

    // Graphs state with rollback 
    const graphsRef = useRef<SalesAnalyticsGraphsData>(initialGraphs)
    const [graphs, _setGraphs] = useState<SalesAnalyticsGraphsData>(initialGraphs)
    const [graphsError, setGraphsError] = useState(false)

    const setGraphs = (next: SalesAnalyticsGraphsData) => {
        graphsRef.current = next
        _setGraphs(next)
    }

    // Loading states 
    const [isCardsLoading, startCardsTransition] = useTransition()
    const [isGraphsLoading, startGraphsTransition] = useTransition()

    // Table filters (scoped to the transaction table only) 
    const { filterOptions } = SalesAnalyticsDataTableFilters
    const [tableFilters, setTableFilters] = useState<Partial<FilterValues>>({
        purchaseDate: null
    })

    const mergedFilters: Partial<FilterValues> = {
        dateRangePreset: date ?? undefined,
        event: eventId ?? undefined,
        ...tableFilters,
    }

    // Fetch helpers 

    const fetchCards = (datePreset: DatePreset | null, nextEvent: string | null) => {
        startCardsTransition(async () => {
            // Map DateRange → date_range preset (crude mapping; adjust if needed)
            const params: Parameters<typeof getSalesAnalyticsCardsClient>[0] = {}
            if (nextEvent) params.event = nextEvent

            if (datePreset) {
                params.date_range = datePreset
            }

            const result = await getSalesAnalyticsCardsClient(params)
            if (result.success && result.data) {
                setCards(result.data)
                setCardsError(false)
            } else {
                _setCards(cardsRef.current)
                setCardsError(true)
            }
        })
    }

    const fetchGraphs = (chartPreset: ChartPreset | null, nextEvent: string | null) => {
        startGraphsTransition(async () => {
            const { chart, year } = deriveChartFilter(chartPreset)
            const params: Parameters<typeof getSalesAnalyticsGraphsClient>[0] = { chart }
            if (nextEvent) params.event = nextEvent
            if (year) params.year = year

            const result = await getSalesAnalyticsGraphsClient(params)
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
    const handleDatePresetChange = (datePreset: DatePreset | null) => {
        setDate(datePreset)
        fetchCards(datePreset, eventId)
    }

    const handleChartPresetChange = (chartPreset: ChartPreset | null) => {
        setChartPreset(chartPreset)
        fetchGraphs(chartPreset, eventId)
    }

    // Handler: event changes 
    const handleEventChange = (next: string | null) => {
        setEventId(next)
        fetchCards(date, next)
        fetchGraphs(chartPreset, next)
    }

    const { activeTabState } = useDataDisplay<Transaction>(
        {
            endpoint: SALES_ANALYTICS_TRANSACTIONS_ENDPOINT,
            tabs: [{
                key: "transactions",
                initialData: initialTransactions,
                staticParams: {},
            }],
            activeTab: "transactions"
        },
        mergedFilters,
    )

    // Derive metric card arrays 
    const row1And2Metrics = mapSalesAnalyticsCards(cards, currency, isMounted)
    const row1Metrics = row1And2Metrics.slice(0, 4)   // total_revenue, tickets_sold, conversion, aov
    const row2Cards = row1And2Metrics.slice(4)      // page_views, refunds, repeat_buyers

    // Row-2 cards piggyback on analyticsMetricStatCardsConfig2 shape:
    // we override the value field from live data
    const liveRow2Config = analyticsMetricStatCardsConfig2.map((cfg, i) => ({
        ...cfg,
        value: row2Cards[i]?.value ?? cfg.value,
    }))

    return (
        <main className="mt-6 pb-12">

            {/* Top filter bar  */}
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <div className="flex items-end gap-2 gap-y-4 flex-wrap">
                    <DateRangePresetFilter
                        value={date}
                        onChange={handleDatePresetChange}
                    />
                    <EventFilter
                        value={eventId}
                        onChange={handleEventChange}
                        icon="hugeicons:calendar-02"
                    />
                    <div>
                        <p className="text-[10px] text-brand-secondary-8">Chart Preset</p>
                        <ChartPresetFilter
                            value={chartPreset}
                            onChange={handleChartPresetChange}
                        />
                    </div>
                </div>
                <ExportButton1
                    showFormatSelector
                    label="Export"
                    onExport={(format) =>
                        exportSalesAnalyticsFull(
                            cards,
                            activeTabState.items,
                            graphs.geo_breakdown.data,
                            graphs.sales_breakdown.overall,
                            format,
                        )
                    }
                />
            </div>

            {/* Row 1 — 4 KPI cards */}
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

            {/* Main charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_23em] gap-6 py-10">

                {/* Left col */}
                <div className="min-w-0 space-y-6">
                    {/* Row 2 — 3 stat cards (page views, refunds, repeat buyers) */}
                    <div className="flex flex-wrap gap-x-2 gap-y-4 md:gap-4">
                        {liveRow2Config.map(config => (
                            <AnalyticsMetricStatCard2 key={config.id} config={config} />
                        ))}
                    </div>

                    {/* Revenue growth bar chart */}
                    <SalesRevenueGrowthChart
                        data={graphs.revenue_chart.data}
                        isPending={isGraphsLoading}
                        locked={graphs.revenue_chart.locked}
                    />
                </div>

                {/* Right col */}
                <div className="space-y-6 min-w-0">
                    <SalesBreakdownChart
                        overall={graphs.sales_breakdown.overall}
                        isPending={isGraphsLoading}
                    />
                    <WeekAnalysisChart
                        data={graphs.week_analysis.data}
                        isPending={isGraphsLoading}
                        locked={graphs.week_analysis.locked}
                    />
                </div>
            </div>

            {/* Geographic breakdown  */}
            <GeographicBreakdownChart
                data={graphs.geo_breakdown.data}
                isPending={isGraphsLoading}
                locked={graphs.geo_breakdown.locked}
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
                    filterOptions={filterOptions}
                    setFilters={setTableFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                    showSearch
                    searchPlaceholder="Search by transaction..."
                    onSearch={activeTabState.handleSearch}
                    isLoading={activeTabState.isLoading}
                >
                    <SalesPaymentsTable
                        transactions={activeTabState.items}
                        isLoading={activeTabState.isLoading}
                        isLoadingMore={activeTabState.isLoadingMore}
                        hasNext={activeTabState.hasNext}
                        count={activeTabState.count}
                        onLoadMore={activeTabState.loadMore}
                        isEmpty={activeTabState.isEmpty}
                        isError={activeTabState.isError}
                        search={activeTabState.search}
                        currentPage={activeTabState.currentPage}
                        totalPages={activeTabState.totalPages}
                        fetchPage={activeTabState.fetchPage}
                    />
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}