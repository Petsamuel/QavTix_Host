"use client"

import { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import AttendeeCheckInTable from "../custom-utils/TableDataDisplayAreas/tables/AttendeesCheckInTable"
import { SystemCheckInDataTableFilters } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import SystemCheckInScanCodeInputArea from "../custom-utils/scan-code/SystemCheckInScanCodeInputArea"
import { mapCheckInMetricsCards } from "@/helper-fns/mapToStatCards"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { CHECKIN_ATTENDEES_ENDPOINT } from "@/endpoints"
import { getCheckInMetricsClient } from "@/actions/checkin/client"
import { Icon } from "@iconify/react"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import { EventFilter } from "../custom-utils/TableDataDisplayAreas/filters/EventFilter"
import { useRouter } from "next/navigation"


interface Props {
    initialMetrics: CheckInCards
    initialAttendees: TabSlice<CheckInAttendee>
}

export default function CheckInSystemPageContentWrapper({ initialMetrics, initialAttendees }: Props) {

    const { user } = useAppSelector(store => store.authUser)
    const currency = user?.currency || ""

    const { tabList: tabListData, filterOptions } = SystemCheckInDataTableFilters

    const [activeTab, setActiveTab] = useState<typeof SystemCheckInDataTableFilters.tabList[number]["value"]>("scan-code")

    // External event filter — drives both metrics + attendees
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null)

    // Internal attendee-list filters (ticket type, status)
    const [filters, setFilters] = useState<Partial<FilterValues>>({
        ticketType: [],
        status: undefined,
    })

    // Metrics with rollback
    const metricsRef = useRef<CheckInCards>(initialMetrics)
    const [metrics, _setMetrics] = useState<CheckInCards>(initialMetrics)
    const [metricsLoading, setMetricsLoading] = useState(false)
    const [metricsError, setMetricsError] = useState(false)
    const router = useRouter()

    const setMetrics = (next: CheckInCards) => {
        metricsRef.current = metrics
        _setMetrics(next)
    }

    // Merge external event filter into FilterValues for useDataDisplay
    const mergedFilters = useMemo(() => ({
        ...filters,
        event: selectedEvent ?? undefined,
    }), [filters, selectedEvent])

    const { activeTabState } = useDataDisplay<CheckInAttendee>(
        {
            endpoint: CHECKIN_ATTENDEES_ENDPOINT,
            tabs: [{
                key: "attendees",
                initialData: initialAttendees,
                staticParams: {},
            }],
            activeTab: "attendees",
            revalidateTarget: "checkin"
        },
        mergedFilters,
    )

    // Re-fetch metrics when event filter changes
    useEffect(() => {
        // Skip on first render — SSR data is already correct
        const isFirstRender = !selectedEvent && metricsRef.current === initialMetrics
        if (isFirstRender) return

        let cancelled = false
        setMetricsLoading(true)

        getCheckInMetricsClient({ event: selectedEvent ?? undefined }).then(result => {
            if (cancelled || !result) return
            setMetricsLoading(false)

            if (result.success && result.data) {
                setMetrics(result.data)
                setMetricsError(false)
            } else {
                _setMetrics(metricsRef.current)
                setMetricsError(true)
            }
        })

        return () => { cancelled = true }
    }, [selectedEvent])

    const checkInMetrics = mapCheckInMetricsCards(metrics, currency)

    // Derive status options from attendee statuses for the status filter
    const statusOptions = Array.from(
        new Set(activeTabState.items.map(a => a.checkin_status))
    ).map(s => ({
        value: s,
        label: s.replace("_", " "),
        color: s === "checked_in" ? "text-green-600" : "text-amber-500",
    }))

    return (
        <main className="pb-10">

            {/* Event filter — external, drives both metrics + table */}
            <div className="flex items-center gap-3 mb-6 mt-10 lg:mt-0">
                <EventFilter
                    value={selectedEvent}
                    onChange={setSelectedEvent}
                    icon="solar:calendar-linear"
                />
            </div>

            {/* KPI cards */}
            <div className="mb-10">
                {metricsLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <div>
                        <MetricCardsContainer1 metrics={checkInMetrics} />
                        {metricsError && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                                <span>Could not refresh stats — showing last available data</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-10">
                <DataDisplayTableWrapper
                    tabs={tabListData}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                    filters={filters}
                    filterOptions={activeTab === "attendee-list" ? filterOptions : undefined}
                    statusOptions={statusOptions}
                    setFilters={setFilters}
                    showSearch={activeTab === "attendee-list"}
                    searchPlaceholder="Search attendees..."
                    onSearch={activeTab === "attendee-list" ? activeTabState.handleSearch : undefined}
                    isLoading={activeTab === "attendee-list" ? activeTabState.isLoading : false}
                >
                    {activeTab === "scan-code" && (
                        <SystemCheckInScanCodeInputArea />
                    )}
                    {activeTab === "attendee-list" && (
                        <AttendeeCheckInTable
                            items={activeTabState.items}
                            isLoading={activeTabState.isLoading}
                            isLoadingMore={activeTabState.isLoadingMore}
                            isEmpty={activeTabState.isEmpty}
                            isError={activeTabState.isError}
                            search={activeTabState.search}
                            count={activeTabState.count}
                            currentPage={activeTabState.currentPage}
                            totalPages={activeTabState.totalPages}
                            fetchPage={activeTabState.fetchPage}
                        />
                    )}
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}