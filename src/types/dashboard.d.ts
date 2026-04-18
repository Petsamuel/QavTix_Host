// Overview

interface DashboardCardData {
    total_revenue:          string
    tickets_sold:           number
    active_events:          number
    pending_payouts:        string
    revenue_change:         number
    tickets_sold_change:    number
    active_events_change:   number
    pending_payouts_change: number
}

interface DashboardChartPoint {
    label:  string
    month:  number
    amount: string
}

interface DashboardOverviewData {
    cards: DashboardCardData
    chart: DashboardChartPoint[]
}

interface DashboardOverviewParams {
    year?:       number
    month?:      number
    week?:       boolean
    chart_type?: "revenue" | "tickets"
}

interface GetDashboardOverviewResult {
    success:  boolean
    data?:    DashboardOverviewData
    message?: string
}

// Stat Card UI

interface IDashboardStat {
    label:    string
    number:   string | number
    icon:     string
    iconBg:   string
    buttonLabel: string 
    cardBg:   string
    linkHref: string
    change: {
        value:  string | number
        period: string
    }
}

// Activity

type ActivityType = "sale" | "checkin" | "refund" | "withdrawal" | "ticket_transfer" | string

interface ActivityMetadata {
    amount:     string
    event_id:   string
    order_id:   string
    quantity:   number
    buyer_name: string
}

interface DashboardActivity {
    id:            string
    activity_type: ActivityType
    message:       string
    metadata:      ActivityMetadata
    created_at:    string
}

// Notification

interface DashboardNotification {
    id:                string
    notification_type: ActivityType
    title:             string
    message:           string
    is_read:           boolean
    created_at:        string
}


// Feed

interface DashboardFeedData {
    activities:     DashboardActivity[]
    notifications:  DashboardNotification[]
    trending:       TrendingTicket[]
    follower_count: number
}

interface DashboardFeedParams {
    mark_read?: boolean
    page?:      number
    search?:    string
    ordering?:  string
}

interface GetDashboardFeedResult {
    success:  boolean
    data?:    DashboardFeedData
    message?: string
}

// Upcoming Events

interface UpcomingEventImage {
    image_url: string
    video_url: string
}

interface UpcomingEventCards {
    live:     number
    draft:    number
    ended:    number
    sold_out: number
}

interface UpcomingEvent {
    id:                      string
    status:                  EventStatus
    title:                   string
    category:                string
    event_image:             UpcomingEventImage
    start_datetime:          string
    event_location:          string
    tickets_sold_percentage: number
    tickets_total_revenue:   number
    tickets_listed:          number
    tickets_sold:            number
    views_count:             number
    saves_count:             number
}

interface UpcomingEventsData {
    count:       number
    total_pages: number
    page:        number
    next:        number | null
    previous:    number | null
    cards:       UpcomingEventCards
    results:     UpcomingEvent[]
}

interface UpcomingEventsParams {
    page?:     number
    search?:   string
    ordering?: string
}

interface GetUpcomingEventsResult {
    success:  boolean
    data?:    UpcomingEventsData
    message?: string
}