'use client'

import { Dispatch, SetStateAction } from 'react'
import { FilterKey, TableDataDisplayFilter } from '../resources/avaliable-filters'
import { filterRegistry } from './filter-registry'


interface FilterRendererProps {
    filterKey: FilterKey
    filter: TableDataDisplayFilter
    filters: Partial<FilterValues>
    setFilters: Dispatch<SetStateAction<Partial<FilterValues>>>
    categories?: Category[]
    statusOptions?: StatusOption[]
    className?: string
    label?:  string
}

export function FilterRenderer({
    filterKey,
    filter,
    filters,
    categories,
    statusOptions,
    setFilters,
    className
}: FilterRendererProps) {
    const entry = filterRegistry[filterKey]
    if (!entry) return null

    const { component: Component, stateKey } = entry

    const value = filters[stateKey]
    const onChange = (newValue: any) => {
        setFilters(prev => ({
            ...prev,
            [stateKey]: newValue
        }))
    }

    return (
        <Component
            value={value}
            onChange={onChange}
            statusOptions={statusOptions}
            className={className}
            icon={filter.icon}
            label={filter.label}
            categories={categories}
        />
    )
}