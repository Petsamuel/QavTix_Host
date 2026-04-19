"use client"

import { DashboardConsumerListFilters } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import CustomersTable from "../custom-utils/TableDataDisplayAreas/tables/CustomersTable"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import { useDataDisplay, TabSlice } from "@/custom-hooks/UseDataDisplay"
import { CUSTOMERS_ENDPOINT } from "@/endpoints"
import { mapCustomerCardsToMetrics } from "@/helper-fns/mapToStatCards"
import { useAppSelector } from "@/lib/redux/hooks"
import { customerListStatusConfig } from "../custom-utils/TableDataDisplayAreas/resources/status-config"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import { Icon } from "@iconify/react"

interface ExternalFilters {
    dateRangePreset: DatePreset | null
}

interface CustomerListProps {
    externalFilters:  ExternalFilters
    initialData:      TabSlice<Customer>
    cards:            CustomersCards
    onItemsChange?:   (items: Customer[]) => void  // ← new
}

export default function CustomersList({
    externalFilters,
    initialData,
    cards: initialCards,
    onItemsChange,
}: CustomerListProps) {
    const { filterOptions } = DashboardConsumerListFilters
    const { user } = useAppSelector(store => store.authUser)

    const [filters, setFilters] = useState<Partial<FilterValues>>({
        purchaseDate: null,
    })

    const cardsRef = useRef<CustomersCards>(initialCards)
    const [cards, _setCards]     = useState<CustomersCards>(initialCards)
    const [cardsError, setCardsError] = useState(false)

    const setCards = (newCards: CustomersCards) => {
        cardsRef.current = cards
        _setCards(newCards)
    }

    const mergedFilters: Partial<FilterValues> = {
        ...filters,
        dateRangePreset: externalFilters.dateRangePreset ?? undefined,
    }

    const { activeTabState } = useDataDisplay<Customer>(
        {
            endpoint: CUSTOMERS_ENDPOINT,
            tabs: [{
                key:          "customers",
                initialData,
                staticParams: {},
                onCards: (incoming: CustomersCards | null) => {
                    if (incoming) {
                        setCards(incoming)
                        setCardsError(false)
                    } else {
                        setCardsError(true)
                        _setCards(cardsRef.current)
                    }
                },
            }],
            activeTab: "customers",
        },
        mergedFilters,
    )

    // Notify parent whenever the visible items change
    useEffect(() => {
        onItemsChange?.(activeTabState.items)
    }, [activeTabState.items, onItemsChange])

    const customerStatusOptions = Array.from(
        new Set(activeTabState.items.map(c => c.status))
    ).map(status => {
        const config = customerListStatusConfig[status as CustomerListStatus]
        return {
            value: status,
            label: config?.label ?? status,
            color: config?.color ?? 'text-brand-neutral-6',
        }
    })

    const metrics = mapCustomerCardsToMetrics(cards, user?.currency || "")

    return (
        <section>
            <div className="mb-8">
                {activeTabState.isLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <div className="relative">
                        <MetricCardsContainer1 metrics={metrics} />
                        {cardsError && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                                <span>Could not refresh stats — showing last available data</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                Customer List
            </h3>

            <DataDisplayTableWrapper
                filters={filters}
                filterOptions={filterOptions}
                setFilters={setFilters as Dispatch<SetStateAction<Partial<FilterValues>>>}
                showSearch
                statusOptions={customerStatusOptions}
                searchPlaceholder="Search customers..."
                onSearch={activeTabState.handleSearch}
                isLoading={activeTabState.isLoading}
            >
                <CustomersTable
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
        </section>
    )
}