"use client"

import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
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
    bulkDownloadAttendees,
    bulkUnpublishEvents,
    deleteEvent,
    updateEventStatus,
} from "@/actions/event/client"

import { mapEventsCards } from "@/helper-fns/mapToStatCards"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import MyLiveEventsTable from "../custom-utils/TableDataDisplayAreas/tables/MyLiveEventsTable"
import AllEventsTable from "../custom-utils/TableDataDisplayAreas/tables/AllEventsTable"
import DraftedEventsTable from "../custom-utils/TableDataDisplayAreas/tables/DraftedEventsTable"
import EventsBulkActionsBar from "../custom-utils/dropdown/EventBulkActionBar"
import { CancelledEventsTable, EndedEventsTable } from "../custom-utils/TableDataDisplayAreas/tables/EndedEventsTable"
import { ApiCategory } from "@/actions/filters"
import { deriveCategories } from "@/helper-fns/deriveCategories"

import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import {
    openConfirmation,
    finishConfirmAction,
    resetConfirmationStatus,
} from "@/lib/redux/slices/confirmationSlice"
import { useAppSelector } from "@/lib/redux/hooks"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { downloadBlob } from "@/helper-fns/downloadBlob"


interface Props {
    initialEvents: {
        all: TabSlice<OrganizerEvent>
        live: TabSlice<OrganizerEvent>
        draft: TabSlice<OrganizerEvent>
        ended: TabSlice<OrganizerEvent>
        cancelled: TabSlice<OrganizerEvent>
        cards: EventCards
    }
    categories: ApiCategory[]
}

// Component 

export default function EventsPageContentWrapper({ initialEvents, categories }: Props) {

    const dispatch = useAppDispatch()
    const { trigger: triggerRevalidation } = useRevalidate("events")

    const { filterOptions, tabList } = MyEventsPageFilters

    const [activeTab, setActiveTab] = useState<typeof MyEventsPageFilters.tabList[number]["value"]>("all")
    const [filters, setFilters] = useState<Partial<FilterValues>>({})
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [cards, setCards] = useState<EventCards>(initialEvents.cards)

    const {
        isConfirmed,
        isPerforming,
        sessionId,
    } = useAppSelector((s) => s.confirmation)

    // Keep a stable ref to the pending action so we can execute it after the
    // user clicks "confirm" without a stale-closure problem.
    const pendingAction = useRef<(() => Promise<void>) | null>(null)

    // Data display hook

    const { tabStates } = useDataDisplay<OrganizerEvent>(
        {
            endpoint: EVENTS_ENDPOINT,
            tabs: [
                { key: "all", initialData: initialEvents.all, staticParams: {}, onCards: (c) => { if (c) setCards(c) } },
                { key: "live", initialData: initialEvents.live, staticParams: { status: "active" }, onCards: (c) => { if (c) setCards(c) } },
                { key: "draft", initialData: initialEvents.draft, staticParams: { status: "draft" } },
                { key: "ended", initialData: initialEvents.ended, staticParams: { status: "ended" } },
                { key: "cancelled", initialData: initialEvents.cancelled, staticParams: { status: "cancelled" } },
            ],
            activeTab,
            revalidateTarget: "events",
        },
        filters,
    )

    const state = tabStates[activeTab]

    const availableCategories = useMemo(
        () => deriveCategories(categories, state.cachedItems),
        [categories?.length, state.cachedItems]
    )

    useEffect(() => { setSelectedEvents([]) }, [activeTab])

    // Confirmation effect
    //
    // When the user clicks "Confirm" in the modal, isConfirmed flips to true.
    // We execute the stored pendingAction then clean up.

    useEffect(() => {
        if (!isConfirmed || !pendingAction.current) return

        const run = async () => {
            try {
                await pendingAction.current!()
            } finally {
                pendingAction.current = null
                dispatch(finishConfirmAction())
                dispatch(resetConfirmationStatus())
            }
        }

        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfirmed])

    // Confirmation helper

    const askConfirmation = useCallback((
        opts: {
            title: string
            description: string
            confirmText: string
            actionType: import("@/components/modals/resources/confirmationActions").ConfirmationActionType
            targetId?: string
        },
        action: () => Promise<void>
    ) => {
        pendingAction.current = action
        dispatch(openConfirmation(opts))
    }, [dispatch])

    // Single delet

    const [deletingId, setDeletingId] = useState<string | null>(null)

    const handleSingleDelete = useCallback((eventId: string, eventName?: string) => {
        askConfirmation(
            {
                title: "Delete Event",
                description: `Are you sure you want to delete "${eventName ?? "this event"}"? This action cannot be undone.`,
                confirmText: "Yes, delete it",
                actionType: "DELETE_EVENT",
                targetId: eventId,
            },
            async () => {
                setDeletingId(eventId)
                try {
                    const result = await deleteEvent({ eventId })
                    if (result.success) {
                        dispatch(showAlert({ title: "Deleted", description: result.message, variant: "success" }))
                        tabStates["draft"].refresh()
                        tabStates["all"].refresh()
                        triggerRevalidation()
                    } else {
                        dispatch(showAlert({ title: "Delete Failed", description: result.message, variant: "destructive" }))
                    }
                } finally {
                    setDeletingId(null)
                }
            }
        )
    }, [askConfirmation, dispatch, tabStates, triggerRevalidation])

    // Publish / Unpublish (single)

    const handlePublish = useCallback((eventId: string, eventName?: string) => {
        askConfirmation(
            {
                title: "Publish Event",
                description: `Publish "${eventName ?? "this event"}"? It will become visible to attendees.`,
                confirmText: "Yes, publish",
                actionType: "PUBLISH_EVENT",
                targetId: eventId,
            },
            async () => {
                const result = await updateEventStatus({ eventId, status: "active" })
                if (result.success) {
                    dispatch(showAlert({ title: "Published", description: result.message, variant: "success" }))
                    tabStates["draft"].refresh()
                    tabStates["live"].refresh()
                    tabStates["all"].refresh()
                    triggerRevalidation()
                } else {
                    dispatch(showAlert({ title: "Publish Failed", description: result.message, variant: "destructive" }))
                }
            }
        )
    }, [askConfirmation, dispatch, tabStates, triggerRevalidation])

    const handleUnpublish = useCallback((eventId: string, eventName?: string) => {
        askConfirmation(
            {
                title: "Unpublish Event",
                description: `Move "${eventName ?? "this event"}" back to draft? It will be hidden from attendees.`,
                confirmText: "Yes, unpublish",
                actionType: "UNPUBLISH_EVENT",
                targetId: eventId,
            },
            async () => {
                const result = await updateEventStatus({ eventId, status: "draft" })
                if (result.success) {
                    dispatch(showAlert({ title: "Unpublished", description: result.message, variant: "success" }))
                    tabStates["live"].refresh()
                    tabStates["draft"].refresh()
                    tabStates["all"].refresh()
                    triggerRevalidation()
                } else {
                    dispatch(showAlert({ title: "Unpublish Failed", description: result.message, variant: "destructive" }))
                }
            }
        )
    }, [askConfirmation, dispatch, tabStates, triggerRevalidation])

    // Bulk action

    const getEventById = useCallback((id: string): OrganizerEvent | undefined => {
        // Search across all cached tab items
        for (const key of ["all", "live", "draft", "ended", "cancelled"] as const) {
            const found = tabStates[key].items.find(e => e.id === id)
            if (found) return found
        }
        return undefined
    }, [tabStates])

    const handleBulkAction = useCallback(async (actionId: BulkEventActionId) => {
        if (!selectedEvents.length) return

        // Resolve full event objects for selected IDs
        const selectedEventObjects = selectedEvents
            .map(getEventById)
            .filter(Boolean) as OrganizerEvent[]

        switch (actionId) {

            case "bulk-cancel": {
                // Exclude already cancelled, ended, banned events
                const eligibleIds = selectedEventObjects
                    .filter(e => e.status !== "cancelled" && e.status !== "ended" && e.status !== "banned")
                    .map(e => e.id)

                if (!eligibleIds.length) {
                    dispatch(showAlert({
                        title: "Nothing to Cancel",
                        description: "All selected events are already cancelled or ended.",
                        variant: "destructive",
                    }))
                    return
                }

                const skipped = selectedEvents.length - eligibleIds.length
                askConfirmation(
                    {
                        title: "Cancel Events",
                        description: `Cancel ${eligibleIds.length} event${eligibleIds.length > 1 ? "s" : ""}?${skipped > 0 ? ` (${skipped} already cancelled/ended will be skipped)` : ""} Attendees will be notified.`,
                        confirmText: "Yes, cancel all",
                        actionType: "BULK_CANCEL_EVENTS",
                    },
                    async () => {
                        const result = await bulkCancelEvents({ eventIds: eligibleIds })
                        if (result.success) {
                            dispatch(showAlert({ title: "Events Cancelled", description: result.message, variant: "success" }))
                            setSelectedEvents([])
                            state.refresh()
                            tabStates["cancelled"].refresh()
                            triggerRevalidation()
                        } else {
                            dispatch(showAlert({ title: "Cancel Failed", description: result.message, variant: "destructive" }))
                        }
                    }
                )
                break
            }

            case "bulk-unpublish": {
                // Only unpublish active/live events
                const eligibleIds = selectedEventObjects
                    .filter(e => e.status === "active")
                    .map(e => e.id)

                if (!eligibleIds.length) {
                    dispatch(showAlert({
                        title: "Nothing to Unpublish",
                        description: "None of the selected events are currently live.",
                        variant: "destructive",
                    }))
                    return
                }

                const skipped = selectedEvents.length - eligibleIds.length
                askConfirmation(
                    {
                        title: "Unpublish Events",
                        description: `Move ${eligibleIds.length} event${eligibleIds.length > 1 ? "s" : ""} back to draft?${skipped > 0 ? ` (${skipped} non-live events will be skipped)` : ""}`,
                        confirmText: "Yes, unpublish all",
                        actionType: "BULK_UNPUBLISH_EVENTS",
                    },
                    async () => {
                        const result = await bulkUnpublishEvents({ eventIds: eligibleIds })
                        if (result.success) {
                            dispatch(showAlert({ title: "Events Unpublished", description: result.message, variant: "success" }))
                            setSelectedEvents([])
                            state.refresh()
                            tabStates["draft"].refresh()
                            triggerRevalidation()
                        } else {
                            dispatch(showAlert({ title: "Unpublish Failed", description: result.message, variant: "destructive" }))
                        }
                    }
                )
                break
            }

            case "bulk-delete": {
                // Only draft, ended, and cancelled events can be deleted
                const eligibleIds = selectedEventObjects
                    .filter(e => e.status === "draft" || e.status === "ended" || e.status === "cancelled")
                    .map(e => e.id)

                if (!eligibleIds.length) {
                    dispatch(showAlert({
                        title: "Nothing to Delete",
                        description: "Only draft, ended, or cancelled events can be deleted. None of your selected events qualify.",
                        variant: "destructive",
                    }))
                    return
                }

                const skipped = selectedEvents.length - eligibleIds.length
                askConfirmation(
                    {
                        title: "Delete Events",
                        description: `Delete ${eligibleIds.length} event${eligibleIds.length > 1 ? "s" : ""}?${skipped > 0 ? ` (${skipped} active/sold-out events cannot be deleted and will be skipped)` : ""} This cannot be undone.`,
                        confirmText: "Yes, delete all",
                        actionType: "BULK_DELETE_EVENTS",
                    },
                    async () => {
                        const result = await bulkDeleteEvents({ eventIds: eligibleIds })
                        if (result.success) {
                            dispatch(showAlert({ title: "Events Deleted", description: result.message, variant: "success" }))
                            setSelectedEvents([])
                            state.refresh()
                            triggerRevalidation()
                        } else {
                            dispatch(showAlert({ title: "Delete Failed", description: result.message, variant: "destructive" }))
                        }
                    }
                )
                break
            }

            case "bulk-download": {
                const result = await bulkDownloadAttendees({ eventIds: selectedEvents })

                if (result.success && result.files?.length) {
                    result.files.forEach(({ eventId, buffer }) => {
                        const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' })
                        downloadBlob(blob, `attendees-${eventId}.csv`)
                    })
                    dispatch(showAlert({
                        title: "Download Complete",
                        description: result.message,
                        variant: "success",
                    }))
                } else {
                    dispatch(showAlert({
                        title: "Download Failed",
                        description: result.message,
                        variant: "destructive",
                    }))
                }
                break
            }
        }
    }, [selectedEvents, getEventById, state, tabStates, askConfirmation, dispatch, triggerRevalidation])

    // Derived / shared

    const metrics = mapEventsCards(cards)

    const tabCounts: Record<string, number> = {
        all: (cards.live ?? 0) + (cards.draft ?? 0) + (cards.ended ?? 0) + (cards.cancelled ?? 0) + (cards.sold_out ?? 0),
        live: cards.live ?? 0,
        draft: cards.draft ?? 0,
        ended: cards.ended ?? 0,
        cancelled: cards.cancelled ?? 0,
    }

    const sharedProps = {
        isLoading: state.isLoading,
        isLoadingMore: state.isLoadingMore,
        isEmpty: state.isEmpty,
        isError: state.isError,
        search: state.search,
        count: state.count,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        fetchPage: state.fetchPage,
    }

    const selectProps = { selectedEvents, setSelectedEvents }

    const handleTabChange = (tab: string) => {
        tabStates["all"].resetSearch()
        tabStates["draft"].resetSearch()
        tabStates["cancelled"].resetSearch()
        tabStates["ended"].resetSearch()
        setActiveTab(tab as typeof activeTab)
    }

    // Render 

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
                selectedEvents={selectedEvents.map(getEventById).filter(Boolean) as OrganizerEvent[]}
                tab={activeTab}
                onAction={handleBulkAction}
                onClearSelection={() => setSelectedEvents([])}
            />

            {/* Table wrapper */}
            <DataDisplayTableWrapper
                tabs={tabList}
                activeTab={activeTab}
                setActiveTab={handleTabChange as Dispatch<SetStateAction<string>>}
                filters={filters}
                categories={availableCategories}
                setFilters={setFilters}
                filterOptions={filterOptions}
                showSearch
                searchPlaceholder="Search events by name..."
                onSearch={state.handleSearch}
                currentSearch={state.search}
                isLoading={state.isLoading}
                tabCounts={tabCounts}
            >
                {activeTab === "all" && (
                    <AllEventsTable
                        items={tabStates["all"].items}
                        {...sharedProps}
                        {...selectProps}
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
                    <MyLiveEventsTable
                        items={tabStates["live"].items}
                        {...selectProps}
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
                    <DraftedEventsTable
                        items={tabStates["draft"].items}
                        isLoading={tabStates["draft"].isLoading}
                        isLoadingMore={tabStates["draft"].isLoadingMore}
                        isEmpty={tabStates["draft"].isEmpty}
                        isError={tabStates["draft"].isError}
                        search={tabStates["draft"].search}
                        count={tabStates["draft"].count}
                        currentPage={tabStates["draft"].currentPage}
                        totalPages={tabStates["draft"].totalPages}
                        fetchPage={tabStates["draft"].fetchPage}
                        onDelete={handleSingleDelete}
                        deletingId={deletingId}
                    />
                )}
                {activeTab === "ended" && (
                    <EndedEventsTable
                        items={tabStates["ended"].items}
                        {...selectProps}
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
                        items={tabStates["cancelled"].items}
                        {...selectProps}
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