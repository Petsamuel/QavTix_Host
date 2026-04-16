export type TableDataDisplayFilter = {
  label: string
  icon: string
  value: FilterKey
}

export type FilterKey =
  | 'categories'
  | 'status'
  | 'ticketType'
  | 'dateRange'
  | 'purchaseDate'
  | 'performance'
  | 'sortBy'
  | 'priceRange'
  | 'dateRangePreset'
  | 'event'


export const ALL_FILTERS = {
  categories: {
    value: 'categories',
    label: 'Category',
    icon: 'tabler:triangle-square-circle'
  },
  status: {
    value: 'status',
    label: 'Status',
    icon: 'ic:round-radio-button-checked'
  },
  ticketType: {
    value: 'ticketType',
    label: 'Ticket Type',
    icon: 'hugeicons:ticket-02'
  },
  priceRange: {
    value: 'priceRange',
    label: 'Price Range',
    icon: "hugeicons:dollar-square"
  },
  dateRange: {
    value: 'dateRange',
    label: 'Date Range',
    icon: 'solar:calendar-linear'
  },
  purchaseDate: {
    value: 'purchaseDate',
    label: 'Purchase Date',
    icon: 'solar:calendar-linear'
  },
  dateRangePreset: {
    value: 'dateRangePreset',
    label: 'Date Preset',
    icon: 'solar:calendar-linear'
  },
  performance: {
    value: 'performance',
    label: 'Performance',
    icon: 'hugeicons:chart-evaluation'
  },
  sortBy: {
    value: 'sortBy',
    label: 'Sort By',
    icon: 'hugeicons:sliders-horizontal'
  },
  event: {
    value: 'event',
    label: 'Event',
    icon: ''
  }
} as const satisfies Record<FilterKey, TableDataDisplayFilter>


export type TabListItem = {
  value: string
  label: string
}

export const DashboardUpcomingEventsFilters = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.performance,
    ALL_FILTERS.dateRange,
  ] as const,

  tabList: [
    { value: 'upcoming', label: 'Upcoming Events' }
  ] as const
}


export const DashboardConsumerListFilters = {
  filterOptions: [
    {...ALL_FILTERS.dateRange, label: "Purchase Date"}
  ] as const,
  tabList: [] as const
}


export const MarketingToolsFilter = {
  filterOptions: [] as const,
  tabList: [
    { value: "promo-codes", label: "Promo Codes"},
    { value: "affiliate-program", label: "Affiliate Program"},
    { value: "email-campaigns", label: "Email Campaigns"}
  ] as const
}


export const SystemCheckInDataTableFilters = {
  filterOptions: [
    ALL_FILTERS.ticketType,
    ALL_FILTERS.status
  ] as const,
  tabList: [
    { value: "scan-code", label: "Scan Code"},
    { value: "attendee-list", label: "Attendee List"},
  ] as const
}


export const SalesAnalyticsDataTableFilters = {
  filterOptions: [
    ALL_FILTERS.ticketType,
    ALL_FILTERS.purchaseDate
  ] as const,
  tabList: [] as const
}


export const DashboardEventsFilters = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.status,
    ALL_FILTERS.performance,
    ALL_FILTERS.sortBy,
    ALL_FILTERS.dateRange
  ] as const,

  tabList: [
    { value: 'all', label: 'All' },
    { value: 'live', label: 'Live' },
    { value: 'draft', label: 'Draft' },
    { value: 'ended', label: 'Ended' },
    { value: 'cancelled', label: 'Cancelled' }
  ] as const
}


export const MyEventsPageFilters = {
  filterOptions: [
    ALL_FILTERS.categories,
    ALL_FILTERS.dateRange,
    ALL_FILTERS.performance,
    ALL_FILTERS.sortBy,
  ] as const,

  tabList: [
    { value: 'all', label: 'All' },
    { value: 'live', label: 'Live' },
    { value: 'draft', label: 'Draft & More' },
    { value: 'ended', label: 'Ended' },
    { value: 'cancelled', label: 'Cancelled' }
  ] as const
}


export type DashboardFilterConfig =
  | typeof DashboardUpcomingEventsFilters
  | typeof DashboardConsumerListFilters
  | typeof DashboardEventsFilters