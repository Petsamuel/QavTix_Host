import { CACHE_TAGS } from "@/cache-tags"
import { PAYMENT_METHODS_ENDPOINT, PLANS_ENDPOINT } from "@/endpoints"
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface PaymentMethodsResult {
    success: boolean
    data?: PaymentMethod[]
    message?: string
}

export async function getPaymentMethods(token: string | undefined): Promise<PaymentMethodsResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${PAYMENT_METHODS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PAYMENT_METHODS], revalidate: 300 }
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        const results = json.data?.results ?? json.results ?? json.data ?? json
        return { success: true, data: Array.isArray(results) ? results : [] }

    } catch (error: any) {
        return { success: false, message: "Failed to load payment methods." }
    }
}

export async function getPlans(token: string | undefined) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${PLANS_ENDPOINT}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (res.ok) {
            return await res.json()
        }
    } catch (e) {
        // ignore
    }
    // Fallback if not available
    return {
        "message": "Plans retrieved successfully.",
        "status": 200,
        "data": [
            {
                "slug": "free",
                "name": "Free",
                "monthly_price": "0.00",
                "annual_price": "0.00",
                "features": {
                    "affiliate": false,
                    "qr_checkin": false,
                    "promo_codes": false,
                    "bulk_refunds": false,
                    "geo_breakdown": false,
                    "group_sharing": false,
                    "revenue_chart": false,
                    "week_analysis": false,
                    "sales_insights": true,
                    "email_campaigns": false,
                    "fraud_detection": true,
                    "resale_controls": false,
                    "featured_listing": false,
                    "max_ticket_types": 1,
                    "priority_support": false,
                    "promo_code_limit": 0,
                    "team_permissions": 0,
                    "advanced_security": false,
                    "dedicated_manager": false,
                    "max_active_events": 2,
                    "marketing_dashboard": false,
                    "sponsored_campaigns": false,
                    "advanced_event_setup": false,
                    "email_campaign_limit": 0,
                    "attendee_export_limit": 250,
                    "customer_profile_insights": false
                }
            },
            {
                "slug": "pro",
                "name": "Pro",
                "monthly_price": "25000.00",
                "annual_price": "250000.00",
                "features": {
                    "affiliate": true,
                    "qr_checkin": true,
                    "promo_codes": true,
                    "bulk_refunds": false,
                    "geo_breakdown": false,
                    "group_sharing": true,
                    "revenue_chart": false,
                    "week_analysis": false,
                    "sales_insights": true,
                    "email_campaigns": true,
                    "fraud_detection": true,
                    "resale_controls": false,
                    "featured_listing": false,
                    "max_ticket_types": null,
                    "priority_support": true,
                    "promo_code_limit": 100,
                    "team_permissions": 1,
                    "advanced_security": false,
                    "dedicated_manager": false,
                    "max_active_events": null,
                    "marketing_dashboard": true,
                    "sponsored_campaigns": false,
                    "advanced_event_setup": true,
                    "email_campaign_limit": 100,
                    "attendee_export_limit": 1000,
                    "customer_profile_insights": false
                }
            },
            {
                "slug": "enterprise",
                "name": "Enterprise",
                "monthly_price": "300000.00",
                "annual_price": "3000000.00",
                "features": {
                    "affiliate": true,
                    "qr_checkin": true,
                    "promo_codes": true,
                    "bulk_refunds": true,
                    "geo_breakdown": true,
                    "group_sharing": true,
                    "revenue_chart": true,
                    "week_analysis": true,
                    "sales_insights": true,
                    "email_campaigns": true,
                    "fraud_detection": true,
                    "resale_controls": true,
                    "featured_listing": true,
                    "max_ticket_types": null,
                    "priority_support": true,
                    "promo_code_limit": 300,
                    "team_permissions": 3,
                    "advanced_security": true,
                    "dedicated_manager": true,
                    "max_active_events": null,
                    "marketing_dashboard": true,
                    "sponsored_campaigns": true,
                    "advanced_event_setup": true,
                    "email_campaign_limit": 100,
                    "attendee_export_limit": null,
                    "customer_profile_insights": true
                }
            }
        ]
    }
}