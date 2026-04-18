type UserRole = "attendee" | "host" | "admin"

type AuthUser = {
    user_id:             number
    email:               string
    username:            string
    full_name:           string
    description:         string | null
    business_name:       string
    business_type:       string
    registration_number: string
    social_links:        string[]
    tax_id:              string
    nin:                 string | null
    phone_number:        string
    country:             string
    state:               string
    city:                string
    postal_code:         string
    categories:          number[]
    registration_date:   string
    role:                "host"
    followers:           number
    profile_picture:     string | null
    profile_banner:      string | null
    show_my_events:      boolean
    show_past_events:    boolean
    verified:            boolean
    payout_available:    boolean
    available_balance:   number
    verified_badge:      boolean
    subscription:        boolean
    plan_type:           string
    can_activate_free_trial: boolean
    currency:            string
}


interface PrivacySettings {
    show_my_events:    boolean
    show_past_events: boolean
}