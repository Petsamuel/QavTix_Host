"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { fetchPaginatedData } from "@/actions/paginated-data/index"
import { useOnRevalidate } from "./UseRevalidate"
import { useQuery } from "@tanstack/react-query"
import { TabSlice, TabConfig, TabState, UseDataDisplayConfig } from "./UseDataDisplay"

type FetchStatus = "idle" | "loading" | "loadingMore" | "error" | "empty"

const buildFilterParams = (filters: Partial<FilterValues>): Record<string, string | string[]> => {
    const params: Record<string, string | string[]> = {}
    if (filters.categories?.length) params.category = filters.categories
    if (filters.dateRange?.from) params.start_date = format(new Date(filters.dateRange.from), 'yyyy-MM-dd')
    if (filters.dateRange?.to) params.end_date = format(new Date(filters.dateRange.to), 'yyyy-MM-dd')
    if (filters.purchaseDate) params.start_date = format(filters.purchaseDate, 'yyyy-MM-dd')
    if (filters.purchaseDate) params.end_date = format(filters.purchaseDate, 'yyyy-MM-dd')
    if (filters.priceRange?.min != null && filters.priceRange.min > 0) params.min_price = String(filters.priceRange.min)
    if (filters.priceRange?.max != null) params.max_price = String(filters.priceRange.max)
    if (filters.status) params.status = filters.status
    if (filters.ticketType?.length) params.ticket_type = filters.ticketType
    if (filters.performance != null) params.performance = String(filters.performance)
    if (filters.sortBy) params.ordering = filters.sortBy
    if (filters.dateRangePreset) params.date_range = filters.dateRangePreset
    if (filters.event) params.event = filters.event
    return params
}

const hasActiveFilters = (filters: Partial<FilterValues>): boolean =>
    !!(
        filters.categories?.length ||
        filters.dateRange?.from ||
        filters.dateRange?.to ||
        filters.priceRange?.min ||
        filters.priceRange?.max ||
        filters.status ||
        filters.ticketType?.length ||
        filters.performance != null ||
        filters.dateRangePreset ||
        filters.sortBy ||
        filters.purchaseDate ||
        filters.event
    )

const serializeFilters = (filters: Partial<FilterValues>): string => [
    filters.categories?.join(',') ?? '',
    filters.dateRange?.from?.toString() ?? '',
    filters.dateRange?.to?.toString() ?? '',
    filters.status ?? '',
    filters.ticketType?.join(',') ?? '',
    String(filters.priceRange?.min ?? ''),
    String(filters.priceRange?.max ?? ''),
    String(filters.performance ?? ''),
    filters.dateRangePreset ?? '',
    filters.sortBy ?? '',
    filters.purchaseDate?.toString() ?? '',
    filters.event ?? '',
].join('|')

const useEventsTabState = <T>(
    config: TabConfig<T>,
    filters: Partial<FilterValues>,
    endpoint: string,
    refetchInterval?: number
): TabState<T> => {
    const [items, setItems] = useState<T[]>(config.initialData.results)
    const [cachedItems, setCachedItems] = useState<T[]>(config.initialData.results)
    const [count, setCount] = useState(config.initialData.count)
    const [totalPages, setTotalPages] = useState(config.initialData.total_pages ?? 1)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasNext, setHasNext] = useState(!!config.initialData.next)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [status, setStatus] = useState<FetchStatus>("idle")

    const isAppending = useRef(false)
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Caching objects to stable references to fully resolve any React Maximum render loops
    const configRef = useRef(config)
    configRef.current = config
    const filtersRef = useRef(filters)
    filtersRef.current = filters

    const filterKey = serializeFilters(filters)

    const { data: queryResult, isFetching: isQueryFetching, error: queryError, refetch } = useQuery({
        queryKey: [endpoint, config.key, filterKey, currentPage, debouncedSearch],
        queryFn: async () => {
            const result = await fetchPaginatedData<T>({
                endpoint,
                staticParams: configRef.current.staticParams,
                filterParams: buildFilterParams(filtersRef.current),
                page: currentPage,
                search: debouncedSearch,
                resultsKey: configRef.current.resultsKey,
            })
            return result
        },
        refetchInterval,
        initialData: currentPage === 1 && !debouncedSearch && !hasActiveFilters(filters) ? {
            success: true,
            results: config.initialData.results,
            count: config.initialData.count,
            next: config.initialData.next,
            total_pages: config.initialData.total_pages,
            cards: undefined,
        } : undefined,
    })

    useEffect(() => {
        if (!queryResult) return

        if (!queryResult.success) {
            setItems([])
            setStatus("error")
            configRef.current.onCards?.(null)
            return
        }

        if (queryResult.cards !== undefined) {
            configRef.current.onCards?.(queryResult.cards)
        }

        const newItems = queryResult.results as T[]
        const append = isAppending.current

        if (newItems.length === 0 && !append) {
            setItems([])
            setCount(0)
            setHasNext(false)
            setTotalPages(0)
            setStatus("empty")
            return
        }

        setItems(prev => append ? [...prev, ...newItems] : newItems)
        setCount(queryResult.count)
        setHasNext(!!queryResult.next)
        setTotalPages(queryResult.total_pages ?? 1)
        setStatus("idle")

        if (!debouncedSearch && !hasActiveFilters(filtersRef.current)) {
            if (append) {
                setCachedItems(prev => [...prev, ...newItems])
            } else if (currentPage === 1) {
                setCachedItems(newItems)
            }
        }

        isAppending.current = false
    }, [queryResult, debouncedSearch, currentPage])

    useEffect(() => {
        if (isQueryFetching) {
            if (isAppending.current) {
                setStatus("loadingMore")
            } else if (items.length === 0) {
                setStatus("loading")
            }
        } else if (queryError) {
            setStatus("error")
        } else if (items.length === 0) {
            setStatus("empty")
        } else {
            setStatus("idle")
        }
    }, [isQueryFetching, queryError, items.length])

    const prevFilterKey = useRef(filterKey)
    useEffect(() => {
        if (prevFilterKey.current !== filterKey) {
            prevFilterKey.current = filterKey
            setSearch("")
            setDebouncedSearch("")
            setCurrentPage(1)
            isAppending.current = false
        }
    }, [filterKey])

    const handleSearch = useCallback((query: string) => {
        const trimmed = query.trim()
        setSearch(trimmed)

        if (debounceTimer.current) clearTimeout(debounceTimer.current)

        debounceTimer.current = setTimeout(() => {
            setDebouncedSearch(trimmed)
            setCurrentPage(1)
            isAppending.current = false
        }, 400)
    }, [])

    const loadMore = useCallback(() => {
        if (!hasNext || isQueryFetching) return
        isAppending.current = true
        setCurrentPage(prev => prev + 1)
    }, [hasNext, isQueryFetching])

    const fetchPage = useCallback((page: number) => {
        if (isQueryFetching) return
        if (page < 1 || (totalPages > 0 && page > totalPages)) return
        isAppending.current = false
        setCurrentPage(page)
    }, [totalPages, isQueryFetching])

    const resetSearch = useCallback(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        setSearch("")
        setDebouncedSearch("")
        setCurrentPage(1)
        isAppending.current = false
    }, [])

    const refresh = useCallback(() => {
        refetch()
    }, [refetch])

    return {
        items,
        cachedItems,
        count,
        totalPages,
        currentPage,
        hasNext,
        status,
        isLoading: status === "loading",
        isLoadingMore: status === "loadingMore",
        isError: status === "error",
        isEmpty: status === "empty",
        search,
        handleSearch,
        loadMore,
        fetchPage,
        resetSearch,
        refresh,
    }
}

export interface UseEventsDataDisplayConfig<T> extends UseDataDisplayConfig<T> {
    refetchInterval?: number
}

export function useEventsDataDisplay<T>(
    config: UseEventsDataDisplayConfig<T>,
    filters: Partial<FilterValues>
): {
    tabStates: Record<string, TabState<T>>
    activeTabState: TabState<T>
} {
    const activeTab = config.activeTab ?? config.tabs[0].key

    const prevFiltersRef = useRef(filters)
    if (prevFiltersRef.current !== filters) {
        const prevKey = serializeFilters(prevFiltersRef.current)
        const nextKey = serializeFilters(filters)
        if (prevKey === nextKey) {
            console.warn(
                "[useEventsDataDisplay] ⚠️  filters object reference changed but VALUES are the same.",
                { prevKey, nextKey }
            )
        }
        prevFiltersRef.current = filters
    }

    const stateEntries = config.tabs.map(tab =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        [tab.key, useEventsTabState(tab, filters, config.endpoint, config.refetchInterval)] as const
    )

    const tabStates = Object.fromEntries(stateEntries) as Record<string, TabState<T>>

    useOnRevalidate(config.revalidateTarget ?? "" as RevalidateTarget, () => {
        if (!config.revalidateTarget) return
        Object.values(tabStates).forEach(state => state.refresh())
    })

    return {
        tabStates,
        activeTabState: tabStates[activeTab] ?? tabStates[config.tabs[0].key],
    }
}
