import { cn } from "@/lib/utils"
import SearchTableInput1 from "./tools/SearchTableInput"
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import DataCountIndicator from "./tools/DataCountIndicator";
import { DashboardUpcomingEventsFilters, MarketingToolsFilter, MyEventsPageFilters, SystemCheckInDataTableFilters, TableDataDisplayFilter } from "./resources/avaliable-filters";
import ActiveFilterChips from "./filters/ActiveFilterChip";
import { FilterRenderer } from "./filters/FilterRenderer";


interface DataDisplayTableWrapperProps {
    tabs?: typeof DashboardUpcomingEventsFilters.tabList | 
    typeof MarketingToolsFilter.tabList |
    typeof SystemCheckInDataTableFilters.tabList |
    typeof MyEventsPageFilters.tabList 

    activeTab?:         string
    setActiveTab?:      Dispatch<SetStateAction<string>>
    filters?:           Partial<FilterValues>
    categories?:        Category[]
    setFilters?:        Dispatch<SetStateAction<Partial<FilterValues>>>
    filterOptions?:     readonly TableDataDisplayFilter[]
    showSearch?:        boolean
    searchPlaceholder?: string
    onTabChange?:       (tab: string) => void
    onSearch?:          (query: string) => void
    onFilterChange?:    (filters: FilterValues) => void
    children:           ReactNode
    isLoading?:         boolean
    className?:         string
    currentSearch?:      string
    statusOptions?:      StatusOption[]
    viewMode?:          "grid" | "list"
    setViewMode?:       Dispatch<SetStateAction<"grid" | "list">>
}

export default function DataDisplayTableWrapper({
    tabs,
    filterOptions,
    showSearch = true,
    searchPlaceholder = 'Search...',
    filters,
    activeTab,
    setActiveTab,
    statusOptions,
    onSearch,
    currentSearch,
    setFilters,
    categories = [],
    children,
    className,
}: DataDisplayTableWrapperProps) {

    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!activeTab) return
        wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, [activeTab])
    
    return (
        <div ref={wrapperRef} className={cn(
            'pt-8 pb-16 bg-white rounded-3xl shadow-[0px_5.8px_23.17px_0px_#3326AE14] overflow-hidden',
            className
        )}>


            {/* Tabs */}
            {tabs && activeTab && setActiveTab && (
                <div className="px-4 md:px-5 w-full border-b border-brand-neutral-5 mb-4 flex justify-between items-center">
                    <div className="flex items-center gap-8 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setActiveTab(tab.value)}
                                className={cn(
                                    'relative pb-3 px-1 text-sm transition-colors whitespace-nowrap',
                                    activeTab === tab.value
                                        ? 'text-brand-primary-6 font-bold'
                                        : 'font-medium text-brand-neutral-7 hover:text-brand-neutral-8'
                                )}
                            >
                                <DataCountIndicator label={tab.label} />
                                {activeTab === tab.value && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-6" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Search & Filters */}
            <div className="px-4 md:px-5 shrink-0">
                {showSearch && (
                    <SearchTableInput1
                        placeholder={searchPlaceholder}
                        onSearch={onSearch}
                        currentSearch={currentSearch}
                    />
                )}

                {setFilters && filters && filterOptions && filterOptions.length > 0 && (
                    <div className="flex flex-wrap gap-4 my-4">
                        {filterOptions.map((filter) => (
                            <FilterRenderer
                                key={filter.value}
                                filterKey={filter.value}
                                filter={filter}
                                filters={filters}
                                statusOptions={statusOptions}
                                categories={categories}
                                setFilters={setFilters}
                            />
                        ))}
                    </div>
                )}

                {/* Active filter chips — only renders when a filter has a value */}
                {filters && setFilters && filterOptions && (
                    <ActiveFilterChips filters={filters} categories={categories} setFilters={setFilters} />
                )}
            </div>

            {/* Table content */}
            <div className="w-full overflow-x-auto px-4 md:px-5 mt-8">
                {children}
            </div>
        </div>
    )
}