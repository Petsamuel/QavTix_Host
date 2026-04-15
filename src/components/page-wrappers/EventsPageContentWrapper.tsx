"use client"

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import CreateEventBtn from "@/lib/features/create-event/CreateEventBtn"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import { MyEventsPageFilters } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { EVENTS_ENDPOINT } from "@/endpoints"
import {
    bulkCancelEvents,
    bulkDeleteEvents,
    bulkUnpublishEvents,
} from "@/actions/event"
import { mapEventsCards }  from "@/helper-fns/mapToStatCards"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import MyLiveEventsTable   from "../custom-utils/TableDataDisplayAreas/tables/MyLiveEventsTable"
import AllEventsTable from "../custom-utils/TableDataDisplayAreas/tables/AllEventsTable"
import DraftedEventsTable  from "../custom-utils/TableDataDisplayAreas/tables/DraftedEventsTable"
import EventsBulkActionsBar from "../custom-utils/dropdown/EventBulkActionBar"
import { CancelledEventsTable, EndedEventsTable } from "../custom-utils/TableDataDisplayAreas/tables/EndedEventsTable"



interface Props {
    initialEvents: TabSlice<OrganizerEvent> & { cards: EventCards }
}



export default function EventsPageContentWrapper({ initialEvents }: Props) {

    const { filterOptions, tabList } = MyEventsPageFilters

    const [activeTab, setActiveTab] = useState<typeof MyEventsPageFilters.tabList[number]["value"]>("live")
    const [filters,   setFilters]   = useState<Partial<FilterValues>>({})
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])

    // Cards start from SSR data; the useDataDisplay hook updates them via onCards
    const [cards, setCards] = useState<EventCards>(initialEvents.cards)

    // Build initial slices per tab — server gave us the "live" page, others start empty
    const emptySlice: TabSlice<OrganizerEvent> = { results: [], count: 0, next: null, previous: null, total_pages: 1 }

    // We run a single endpoint, filtering by status on each tab separately.
    // Each tab has its own independent useTabState inside useDataDisplay.
    const { tabStates } = useDataDisplay<OrganizerEvent>(
        {
            endpoint: EVENTS_ENDPOINT,
            tabs: [
                {
                    key:          "all",
                    initialData:  activeTab === "all" ? initialEvents : emptySlice,
                    staticParams: {},
                    onCards:      (c) => { if (c) setCards(c) },
                },
                {
                    key:          "live",
                    initialData:  activeTab === "live" ? initialEvents : emptySlice,
                    staticParams: { status: "active" },
                    onCards:      (c) => { if (c) setCards(c) },
                },
                {
                    key:          "draft",
                    initialData:  activeTab === "draft" ? initialEvents : emptySlice,
                    staticParams: { status: "draft" },
                },
                {
                    key:          "ended",
                    initialData:  activeTab === "ended" ? initialEvents : emptySlice,
                    staticParams: { status: "ended" },
                },
                {
                    key:          "cancelled",
                    initialData:  activeTab === "cancelled" ? initialEvents : emptySlice,
                    staticParams: { status: "cancelled" },
                },
            ],
            activeTab,
            revalidateTarget: "events",
        },
        filters,
    )

    // Active tab's state
    const state = tabStates[activeTab]

    // Clear selection whenever tab changes
    useEffect(() => { setSelectedEvents([]) }, [activeTab])

    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleDraftDelete = useCallback(async (id: string) => {
        setDeletingId(id)
        try {
            // Call your delete endpoint here — adapt to your actual action
            // await deleteDraftEvent({ eventId: id })
            tabStates["draft"].refresh()
        } finally {
            setDeletingId(null)
        }
    }, [tabStates])


    // Bulk actions 
    const handleBulkAction = useCallback(async (actionId: BulkEventActionId) => {
        if (!selectedEvents.length) return

        switch (actionId) {
            case "bulk-delete": {
                const result = await bulkDeleteEvents({ eventIds: selectedEvents })
                if (result.success) {
                    setSelectedEvents([])
                    state.refresh()
                }
                break
            }
            case "bulk-cancel": {
                const result = await bulkCancelEvents({ eventIds: selectedEvents })
                if (result.success) {
                    setSelectedEvents([])
                    state.refresh()
                    tabStates["cancelled"].refresh()
                }
                break
            }
            case "bulk-unpublish": {
                const result = await bulkUnpublishEvents({ eventIds: selectedEvents })
                if (result.success) {
                    setSelectedEvents([])
                    state.refresh()
                    tabStates["draft"].refresh()
                }
                break
            }
            case "bulk-send-update": {
                // Navigate or open a modal — adapt to your flow
                console.log("Send update to:", selectedEvents)
                break
            }
            case "bulk-download": {
                // Trigger download — adapt to your flow
                console.log("Download attendees for:", selectedEvents)
                break
            }
        }
    }, [selectedEvents, state, tabStates])

    const metrics = mapEventsCards(cards)

    const sharedProps = {
        isLoading:     state.isLoading,
        isLoadingMore: state.isLoadingMore,
        isEmpty:       state.isEmpty,
        isError:       state.isError,
        search:        state.search,
        count:         state.count,
        currentPage:   state.currentPage,
        totalPages:    state.totalPages,
        fetchPage:     state.fetchPage,
    }

    const selectProps = {
        selectedEvents,
        setSelectedEvents,
    }

    return (
        <main className="pb-12">
            <div className="flex justify-between items-center my-5">
                <h2 className={cn(space_grotesk.className, "capitalize text-lg text-brand-secondary-8 font-bold")}>
                    Overview
                </h2>
                <CreateEventBtn />
            </div>

            {/* KPI cards */}
            <div className="mb-8">
                {state.isLoading && !metrics ? (
                    <MetricsContainerLoader />
                ) : (
                    <MetricCardsContainer1 metrics={metrics} />
                )}
            </div>

            <EventsBulkActionsBar
                selectedCount={selectedEvents.length}
                tab={activeTab}
                onAction={handleBulkAction}
                onClearSelection={() => setSelectedEvents([])}
            />

            {/* Table wrapper */}
            <DataDisplayTableWrapper
                tabs={tabList}
                activeTab={activeTab}
                setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                filters={filters}
                setFilters={setFilters}
                filterOptions={filterOptions}
                showSearch
                searchPlaceholder="Search events by name..."
                onSearch={state.handleSearch}
                currentSearch={state.search}
                isLoading={state.isLoading}
            >
                {activeTab === "all" && (
                    <AllEventsTable items={tabStates["all"].items} {...sharedProps} {...selectProps}
                        isLoading={tabStates["all"].isLoading}
                        isLoadingMore={tabStates["all"].isLoadingMore}
                        isEmpty={tabStates["all"].isEmpty}
                        isError={tabStates["all"].isError}
                        search={tabStates["all"].search}
                        count={tabStates["all"].count}
                        currentPage={tabStates["all"].currentPage}
                        totalPages={tabStates["all"].totalPages}
                        fetchPage={tabStates["all"].fetchPage}
                    />
                )}
                {activeTab === "live" && (
                    <MyLiveEventsTable items={tabStates["live"].items} {...selectProps}
                        isLoading={tabStates["live"].isLoading}
                        isLoadingMore={tabStates["live"].isLoadingMore}
                        isEmpty={tabStates["live"].isEmpty}
                        isError={tabStates["live"].isError}
                        search={tabStates["live"].search}
                        count={tabStates["live"].count}
                        currentPage={tabStates["live"].currentPage}
                        totalPages={tabStates["live"].totalPages}
                        fetchPage={tabStates["live"].fetchPage}
                    />
                )}
                {activeTab === "draft" && (
                    <DraftedEventsTable items={tabStates["draft"].items}
                        isLoading={tabStates["draft"].isLoading}
                        isLoadingMore={tabStates["draft"].isLoadingMore}
                        isEmpty={tabStates["draft"].isEmpty}
                        isError={tabStates["draft"].isError}
                        search={tabStates["draft"].search}
                        count={tabStates["draft"].count}
                        currentPage={tabStates["draft"].currentPage}
                        totalPages={tabStates["draft"].totalPages}
                        fetchPage={tabStates["draft"].fetchPage}
                        onDelete={handleDraftDelete}
                        deletingId={deletingId}
                    />
                )}
                {activeTab === "ended" && (
                    <EndedEventsTable 
                        items={tabStates["ended"].items} {...selectProps}
                        isLoading={tabStates["ended"].isLoading}
                        isLoadingMore={tabStates["ended"].isLoadingMore}
                        isEmpty={tabStates["ended"].isEmpty}
                        isError={tabStates["ended"].isError}
                        search={tabStates["ended"].search}
                        count={tabStates["ended"].count}
                        currentPage={tabStates["ended"].currentPage}
                        totalPages={tabStates["ended"].totalPages}
                        fetchPage={tabStates["ended"].fetchPage}
                    />
                )}
                {activeTab === "cancelled" && (
                    <CancelledEventsTable 
                        items={tabStates["cancelled"].items} {...selectProps}
                        isLoading={tabStates["cancelled"].isLoading}
                        isLoadingMore={tabStates["cancelled"].isLoadingMore}
                        isEmpty={tabStates["cancelled"].isEmpty}
                        isError={tabStates["cancelled"].isError}
                        search={tabStates["cancelled"].search}
                        count={tabStates["cancelled"].count}
                        currentPage={tabStates["cancelled"].currentPage}
                        totalPages={tabStates["cancelled"].totalPages}
                        fetchPage={tabStates["cancelled"].fetchPage}
                    />
                )}
            </DataDisplayTableWrapper>
        </main>
    )
}