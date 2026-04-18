type CustomerListStatus = "top_spender" | "repeat_buyer" | "first_timer" | "new_customer"

interface Customer {
    user_id: number | null
    name: string
    profile_picture: string | null
    address: string
    email: string
    status: CustomerListStatus
    events_attended: number
    total_spent: string
    last_purchase_date: string
}

interface CustomersCards {
    total_customers: number
    new_this_month: number
    repeat_buyers: number
    average_spend: number
}

interface CustomersData {
    cards: CustomersCards
    results: Customer[]
    count: number
    total_pages: number
    page: number
    next: string | null
    previous: string | null
}

interface CustomersParams {
    date_range?: "day" | "week" | "month"
    start_date?: string
    end_date?: string
    event?: string
    ordering?: string
    page?: number
    search?: string
    ticket_type?: number
}


// CUSTOMER PROFILE
interface CustomerProfileCards {
    total_spent:             string
    total_spent_change:      number
    tickets_bought:          number
    tickets_bought_change:   number
    refund_count:            number
    refund_count_change:     number
    last_order_value:        string
    last_order_value_change: number
}

interface CustomerProfile {
    user_id:             number
    full_name:           string
    email:               string
    phone_number:        string
    country:             string
    state:               string
    city:                string
    gender:              string
    dob:                 string
    profile_picture:     string | null
    registration_date:   string
    first_purchase_date: string
    last_purchase_date:  string
}

interface CustomerProfileChartPoint {
    label:  string
    amount: string
}

interface CustomerOrder {
    order_id:       string
    event_id:       string
    event_name:     string
    event_image:    string
    event_category: string
    purchase_date:  string
    quantity:       number
    amount:         string
    status:         string
}

interface CustomerOrderHistory {
    results:     CustomerOrder[]
    count:       number
    next:        string | null
    previous:    string | null
    total_pages?: number
}

interface CustomerProfileData {
    cards:         CustomerProfileCards
    profile:       CustomerProfile
    revenue_chart: CustomerProfileChartPoint[]
    order_history: CustomerOrderHistory
}

interface GetCustomerProfileResult {
    success: boolean
    data?:   CustomerProfileData
    message?: string
}

interface CustomerProfileParams {
    user_id:              number
    date_range?:          'day' | 'week' | 'month'
    event?:               string
    chart_range?:         'day' | 'week' | 'month'
    history_date_range?:  'day' | 'week' | 'month'
    history_event?:       string
    ticket_type?:         number
    search?:              string
    ordering?:            string
    page?:                number
}

type CustomerProfileDatePreset = 'day' | 'week' | 'month'