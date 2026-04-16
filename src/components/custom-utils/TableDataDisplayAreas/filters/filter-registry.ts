import { ComponentType } from "react"
import { FilterKey } from "../resources/avaliable-filters"
import CategoryFilter from "./CategoryFilter"
import DateFilter from "./DateFilter"
import { StatusFilter } from "./StatusFilter"
import PriceFilter from "./PriceFilter"
import { PerformanceFilter } from "./PerformanceFilter"
import DateRangePresetFilter from "./DateRangePresetFilter"
import { PurchaseDateFilter } from "./PurchaseDateFilter"
import { EventFilter } from "./EventFilter"
import { SortByFilter } from "./SortByFilter"

type FilterComponentProps<T> = {
  value: T
  onChange: (value: T) => void
  className?: string
  icon: string
  categories?: Category[]
  event?: string | null
  label?: string
  sortBy?: string
  statusOptions?: StatusOption[]
}

type FilterRegistryEntry<T> = {
  component: ComponentType<FilterComponentProps<T>>
  stateKey: keyof FilterValues
}

export const filterRegistry: Partial<Record<FilterKey, FilterRegistryEntry<any>>> = {
  categories: {
    component: CategoryFilter,
    stateKey: 'categories'
  },
  status: {
    component: StatusFilter,
    stateKey: 'status'
  },
  dateRange: {
    component: DateFilter,
    stateKey: 'dateRange'
  },
  dateRangePreset: {
    component: DateRangePresetFilter,
    stateKey: 'dateRangePreset'
  },
  priceRange: {
    component: PriceFilter,
    stateKey: 'priceRange'
  },
  performance: {
    component: PerformanceFilter,
    stateKey: 'performance'
  },
  sortBy: {
    component: SortByFilter,
    stateKey: "sortBy"
  },
  purchaseDate: {
    component: PurchaseDateFilter,
    stateKey: 'purchaseDate'
  },
  event: {
    component: EventFilter,
    stateKey: 'event'
  },
}