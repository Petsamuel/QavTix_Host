interface PriceRange {
    min: number
    max: number
}

interface Category {
    value: string
    label: string
    count: number
}

interface Location {
    country: string
    state: string
}

interface EventImage {
    image_url: string | null
    video_url: string | null
}

type EventStatus      = "active" | "draft" | "ended" | "sold-out" | "cancelled" | "banned"
type EventPerformance = "fully_booked" | "almost_full" | "moderate_sales" | "low_sales" | "no_sales"

interface OrganizerEvent {
    id:                      string
    status:                  EventStatus
    title:                   string
    category:                string
    event_image:             EventImage
    start_datetime:          string
    event_location:          string
    tickets_sold_percentage: number
    tickets_total_revenue:   number
    tickets_listed:          number
    tickets_sold:            number
    views_count:             number
    saves_count:             number
    performance:             EventPerformance
}

interface EventCards {
    live:     number
    draft:    number
    ended:    number
    sold_out: number
}

// Paginated response shape (data envelope)
interface EventsData {
    count:       number
    total_pages: number
    page:        number
    next:        number | null
    previous:    number | null
    cards:       EventCards
    results:     OrganizerEvent[]
}

interface GetEventsParams {
    category?:    number
    end_date?:    string
    ordering?:    string
    page?:        number
    performance?: EventPerformance
    search?:      string
    start_date?:  string
    status?:      EventStatus
}

interface GetEventsResult {
    success:  boolean
    data?:    EventsData
    message?: string
}


type BulkEventActionId =
    | "bulk-delete"
    | "bulk-cancel"
    | "bulk-unpublish"
    | "bulk-send-update"
    | "bulk-download"

interface BulkEventAction {
    id:       BulkEventActionId
    label:    string
    icon:     string
    variant?: "default" | "danger"
}



///
interface EventTicket {
    sn:             number
    id:             string
    qrcode_token:   string
    event_name:     string
    event_image:    string
    category:       string
    payment:        "Completed" | "Pending" | "Failed" | "Refunded"
    event_status:   "active" | "cancelled" | "postponed" | "completed"
    ticket_status:  "Active" | "Used" | "Cancelled" | "Expired"
    ticket_type:    string
    event_datetime: string
    original_price: string
    currency:       string
    host:           string
    event_location: EventLocation
}

type DatePreset = 'day' | 'week' | 'month'

interface StatusOption {
    value:  string
    label:  string
    color:  string
}

interface TrendingTicket {
    ticket_id:       number
    ticket_type:     string
    event_name:      string
    event_category:  string
    event_image:     string
    tickets_sold:    number
    conversion_rate: number
    quantity:        number
    revenue:         string
}


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
    performance?:            EventPerformance
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

type EventPerformance = "fully_booked" | "almost_full" | "moderate_sales" | "low_sales" | "no_sales"
type EventStatus      = "active" | "draft" | "ended" | "sold-out" | "cancelled" | "banned"

interface UpcomingEventsParams {
    page?:        number
    search?:      string
    ordering?:    string
    status?:      EventStatus
    category?:    number
    performance?: EventPerformance
    start_date?:  string
    end_date?:    string
}

interface GetUpcomingEventsResult {
    success:  boolean
    data?:    UpcomingEventsData
    message?: string
}