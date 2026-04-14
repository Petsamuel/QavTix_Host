"use client"

import { Dispatch, SetStateAction, useState } from "react"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import UpcomingEventsTable from "../custom-utils/TableDataDisplayAreas/tables/UpcomingEventsTable"
import { DashboardUpcomingEventsFilters } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { HOST_UPCOMING_EVENTS_ENDPOINT } from "@/endpoints"
import { Icon } from "@iconify/react"
import EmptyTicketsState from "../custom-utils/TableDataDisplayAreas/empty-state"
import TableLoader from "../loaders/TableLoader"

const PAGE_SIZE = 10

interface Props {
    initialData: TabSlice<UpcomingEvent>
}

export default function UpcomingEventsPW({ initialData }: Props) {

    const { tabList, filterOptions } = DashboardUpcomingEventsFilters

    const [activeTab, setActiveTab] = useState<string>("upcoming")
    const [filters,   setFilters]   = useState<Partial<FilterValues>>({
        categories: [],
        dateRange:  null,
        status:     null,
    })

    const { activeTabState } = useDataDisplay<UpcomingEvent>(
        {
            endpoint: HOST_UPCOMING_EVENTS_ENDPOINT,
            tabs: [{
                key:          "upcoming",
                initialData,
                staticParams: {},
            }],
            activeTab,
        },
        filters,
    )

    const {
        items, isLoading, isLoadingMore,
        hasNext, count, loadMore,
        handleSearch, search,
        isError, isEmpty,
        currentPage, totalPages, fetchPage,
    } = activeTabState

    const startIndex = (currentPage - 1) * PAGE_SIZE + 1
    const endIndex   = Math.min(currentPage * PAGE_SIZE, count)

    const renderContent = () => {

        if (isLoading) return <TableLoader />

        if (isError) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-red-50">
                    <Icon icon="nonicons:error-16" className="size-6 text-red-400" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">Something went wrong</p>
                <p className="text-xs text-brand-secondary-5">Could not load events. Please try again.</p>
            </div>
        )

        if (items.length === 0 && !isLoading) return (
            <div className="mt-10">
                <EmptyTicketsState
                    href={`${process.env.NEXT_PUBLIC_HOST_DOMAIN}/dashboard/events/create`}
                    text="Create your first event and it will appear here once published."
                    title="No Upcoming Events"
                    btnText="Create Event"
                    icon="hugeicons:calendar-add-02"
                />
            </div>
        )

        if (isEmpty && search) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">
                    No results for &ldquo;{search}&rdquo;
                </p>
                <p className="text-xs text-brand-secondary-5">
                    Try a different event name or clear the search
                </p>
            </div>
        )

        if (isEmpty) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:filter" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">No events match your filters</p>
                <p className="text-xs text-brand-secondary-5">Try adjusting or clearing your filters</p>
            </div>
        )

        return (
            <UpcomingEventsTable
                items={items}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                hasNext={hasNext}
                count={count}
                onLoadMore={loadMore}
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                endIndex={endIndex}
                onFetchPage={fetchPage}
            />
        )
    }

    return (
        <section>
            <DataDisplayTableWrapper
                tabs={tabList}
                activeTab={activeTab}
                setActiveTab={setActiveTab as Dispatch<SetStateAction<string>>}
                filterOptions={filterOptions}
                filters={filters}
                setFilters={setFilters}
                showSearch={true}
                searchPlaceholder="Search events..."
                onSearch={handleSearch}
                isLoading={isLoading}
            >
                {renderContent()}
            </DataDisplayTableWrapper>
        </section>
    )
}