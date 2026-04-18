"use client"

import { Dispatch, SetStateAction, useRef, useState } from "react"
import { useAppSelector } from "@/lib/redux/hooks"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"
import { CUSTOMER_DETAILS_ENDPOINT } from "@/endpoints"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import { CustomerProfileDetailsCard } from "../cards/CustomerProfileDetailsCard"
import { UserRevenueChart } from "../charts/UserRevenueChart"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import OrderListTable from "../custom-utils/TableDataDisplayAreas/tables/OrderListTable"
import DateRangePresetFilter from "../custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import { Icon } from "@iconify/react"
import { DashboardConsumerListFilters } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import CustomersProfilePageMetricCardsContainer from "../cards/CustomerProfilePageMetricsCardContainer"

interface Props {
    userID:        number
    profile:       CustomerProfile
    cards:         CustomerProfileCards
    initialChart:  CustomerProfileChartPoint[]
    initialOrders: TabSlice<CustomerOrder>
}

export default function CustomerProfilePageCW({
    userID,
    profile,
    cards: initialCards,
    initialChart,
    initialOrders,
}: Props) {

    const { user } = useAppSelector(store => store.authUser)
    const currency = user?.currency || ""

    // External KPI filter (date_range)
    const [datePreset, setDatePreset] = useState<DatePreset | null>(null)

    // Cards state with rollback
    const cardsRef              = useRef<CustomerProfileCards>(initialCards)
    const [cards, _setCards]    = useState<CustomerProfileCards>(initialCards)
    const [cardsError, setCardsError] = useState(false)

    const setCards = (next: CustomerProfileCards) => {
        cardsRef.current = cards
        _setCards(next)
    }

    // Order history filters (inside the table wrapper)
    const { filterOptions } = DashboardConsumerListFilters
    const [filters, setFilters] = useState<Partial<FilterValues>>({
        purchaseDate: null,
        ticketType:   [],
    })

    const mergedFilters: Partial<FilterValues> = {
        ...filters,
        dateRangePreset: datePreset ?? undefined,
    }

    // useDataDisplay for order history
    // endpoint is scoped to this customer
    const endpoint = CUSTOMER_DETAILS_ENDPOINT.replace("[user_id]",userID.toString())

    const { activeTabState } = useDataDisplay<CustomerOrder>(
        {
            endpoint,
            tabs: [{
                key:          "orders",
                initialData:  initialOrders,
                staticParams: {},
                resultsKey:   "order_history",
                onCards: (incoming: CustomerProfileCards | null) => {
                    if (incoming) {
                        setCards(incoming)
                        setCardsError(false)
                    } else {
                        _setCards(cardsRef.current)
                        setCardsError(true)
                    }
                },
            }],
            activeTab: "orders",
        },
        mergedFilters,
    )

    return (
        <main className="pb-10">
            {/* Top filter bar */}
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <DateRangePresetFilter
                        value={datePreset}
                        onChange={setDatePreset}
                        label="KPI Range"
                    />
                </div>
                <ExportButton1 showFormatSelector />
            </div>

            {/*  KPI cards  */}
            <div className="mb-8">
                {activeTabState.isLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <div>
                        <CustomersProfilePageMetricCardsContainer
                            cards={cards}
                            currency={currency}
                        />
                        {cardsError && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                                <span>Could not refresh stats — showing last available data</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Profile card & Revenue chart */}
            <div className="grid grid-cols-1 md:grid-cols-[20em_1fr] gap-4 gap-y-7 my-10">
                <CustomerProfileDetailsCard customer={profile} />
                <div className="min-w-0">
                    {/* Chart fetches independently when its internal filter changes */}
                    <UserRevenueChart
                        userID={userID}
                        initialData={initialChart}
                    />
                </div>
            </div>

            {/* Order history */}
            <div>
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                    Order History
                </h3>
                <DataDisplayTableWrapper
                    filters={filters}
                    filterOptions={filterOptions}
                    setFilters={setFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                    showSearch
                    searchPlaceholder="Search by event name..."
                    onSearch={activeTabState.handleSearch}
                    isLoading={activeTabState.isLoading}
                >
                    <OrderListTable
                        items={activeTabState.items}
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
            </div>
        </main>
    )
}