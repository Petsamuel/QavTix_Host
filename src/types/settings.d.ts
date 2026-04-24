interface PrivacySettings {
    show_my_events: boolean,
    show_past_events: boolean,
}


interface TwoFactorProvider {
    id: string
    name: string
    icon: string
    status: "connected" | "disconnected" | "not_connected"
    email?: string
}


interface PaymentMethod {
    id: number
    provider: string
    brand: string
    last4: string
    exp_month: number
    exp_year: number
    is_default: boolean
    created_at: string
}


type SubscriptionStatus = "active" | "trialing" | "cancelled" | "expired"
type BillingCycle = "monthly" | "annual"
type PlanSlug = "free" | "standard" | "pro" | "enterprise"

interface SubscriptionPlanFeatures {
    affiliate: boolean
    qr_checkin: boolean
    promo_codes: boolean
    bulk_refunds: boolean
    geo_breakdown: boolean
    group_sharing: boolean
    revenue_chart: boolean
    week_analysis: boolean
    sales_insights: boolean
    email_campaigns: boolean
    fraud_detection: boolean
    resale_controls: boolean
    featured_listing: boolean
    max_ticket_types: number | null
    priority_support: boolean
    promo_code_limit: number | null
    team_permissions: number | null
    advanced_security: boolean
    dedicated_manager: boolean
    max_active_events: number | null
    marketing_dashboard: boolean
    sponsored_campaigns: boolean
    advanced_event_setup: boolean
    email_campaign_limit: number | null
    attendee_export_limit: number | null
    customer_profile_insights: boolean
}

interface SubscriptionPlan {
    slug: PlanSlug
    name: string
    monthly_price: string
    annual_price: string
    features: SubscriptionPlanFeatures
}

interface SubscriptionData {
    status: SubscriptionStatus
    billing_cycle: BillingCycle
    amount_paid: string
    currency: string
    started_at: string
    expires_at: string
    cancelled_at: string | null
    plan_slug: PlanSlug
    is_expired: boolean
    plan: SubscriptionPlan
    auto_renew: boolean
}

interface GetSubscriptionResult {
    success: boolean
    data?: SubscriptionData
    message?: string
}

interface ToggleAutoRenewResult {
    success: boolean
    message?: string
}

interface RenewSubscriptionResult {
    success: boolean
    message?: string
}



// Local File
interface PricingPlan {
    id: string
    name: string
    price: number
    currency: string
    perTicketFee: number
    description: string
    features: string[]
    buttonText: string
    buttonVariant: 'primary' | 'secondary'
    highlighted?: boolean
    trial?: string
}

interface PricingFeature {
    category?: string
    name: string
    free: boolean | string
    pro: boolean | string
    enterprise: boolean | string
}

interface PricingData {
    plans: PricingPlan[]
    features: Feature[]
}