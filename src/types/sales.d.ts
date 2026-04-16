interface SalesAnalyticsCardsParams {
    date_range?: "day" | "week" | "month"
    event?:      string // event UUID
}

interface SalesAnalyticsCardsData {
    total_revenue:        string
    total_revenue_change: string
    tickets_sold:         number
    conversion_rate:      number
    conversion_change:    number
    average_order_value:  string
    aov_change:           number
    page_views:           number
    refunds:              number
    repeat_buyers:        number
}

interface SalesAnalyticsCardsResult {
    success:  boolean
    data?:    SalesAnalyticsCardsData
    message?: string
}

// Graphs types 

type ChartFilter = "week" | "month" | "year"

interface SalesAnalyticsGraphsParams {
    chart?: ChartFilter
    event?: string
    year?:  number
}

interface SalesBreakdownItem {
    ticket_type: string
    count:       number
    percentage:  number
}

interface SalesByPeriodItem {
    period_label:  string
    total:         number
    by_ticket_type: SalesBreakdownItem[]
}

interface RevenueChartPoint {
    label:  string
    amount: string
}

interface WeekDay {
    day:       string
    date:      string
    morning:   number
    afternoon: number
    evening:   number
    total:     number
}

interface WeekAnalysisData {
    change_vs_last_week: number
    label:               string
    days:                WeekDay[]
}

interface GeoLocation {
    city:    string
    state:   string
    tickets: number
    revenue: string
    clicks:  number
}

interface GeoBreakdownData {
    locations:     GeoLocation[]
    best_location: {
        label:   string
        tickets: number
        revenue: string
        clicks:  number
    }
}

interface SalesAnalyticsGraphsData {
    sales_breakdown: {
        overall:   SalesBreakdownItem[]
        by_period: SalesByPeriodItem[]
    }
    revenue_chart: {
        locked: boolean
        data:   RevenueChartPoint[]
    }
    week_analysis: {
        locked: boolean
        data:   WeekAnalysisData
    }
    geo_breakdown: {
        locked: boolean
        data:   GeoBreakdownData
    }
}

interface SalesAnalyticsGraphsResult {
    success:  boolean
    data?:    SalesAnalyticsGraphsData
    message?: string
}
