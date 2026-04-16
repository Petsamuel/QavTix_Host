type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json'

interface FilterValues {
    dateRange?: DateRange
    status: EventStatus | null
    categories: Category["value"][]
    ticketType: string[],
    performance: EventPerformance | null
    purchaseDate?: Date | null
    dateRangePreset?: "day" | "week" | "month" | null
    priceRange?: PriceRange | null
    event?: string | null
    sortBy?: string | null
}

type RevalidateTarget = "financials" | "marketing" | "upcoming-events" | "customers" | "checkin" | "events"