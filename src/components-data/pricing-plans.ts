// 
// QavTix Pricing Plans
// Source: QAVTIX PROJECT PRICING & RBAC document (LAST UPDATE MARCH 30 2026)
// Plan IDs match the keys used in PricingFeature — do not rename without
// updating DesktopFeatureComparison and MobileFeatureComparison too.
//
// KEY CORRECTIONS vs previous version (reconciled from PDF):
//   - Standard plan: restored 'Max ticket sales (750 tickets)' feature
//   - Pro plan: restored 'Max ticket sales (2,500 tickets)' feature
//   - Enterprise plan: restored 'Max ticket sales (10,000 tickets)' feature
//   - Enterprise Discount & Promo Codes: corrected 500 → 300 (PDF feature table)
//   - Pro features: 'Everything in Free Plan' → 'Everything in Standard Plan'
//   - Attendee Standard plan: restored full points-based feature set from PDF p.2
//   - Attendee feature table: restored Rewards, Perks categories from PDF p.2
//
// UPDATED MAY 11 2026 (reconciled from PDF p.2):
//   - Pro plan features: Built-in email campaigns corrected 100 → 400 sends/month
//   - Enterprise plan features: Added Built-in email campaigns (4,600 sends/month)
//   - Feature table QR Code Check-In: Standard corrected true → false (locked on Free)
//   - Feature table Real-Time Sales Insights: Standard corrected true → false (locked on Free)
//   - Feature table Customer Profile Insights: Standard & Pro corrected false → true (✓ all plans)
//   - Feature table Built-in Email Campaigns: corrected Pro 100 → 400/month, Enterprise 100 → 4,600/month
//
// SYNCED MAY 31 2026: copied from qavtix-website (source of truth)
//   - Standard plan renamed: 'Standard Plan' → 'Free Plan'
//   - Pro plan renamed: 'Pro Plan' → 'Professional Plan'
//   - Standard features condensed to 6 core items
//   - Pro features reordered and de-duplicated
//   - Enterprise features updated: Discount Codes cap corrected to 500, SMS Send added
//   - Feature table simplified and column labels updated
//

// Host Plans

export const hostPricingData: PricingData = {
    plans: [
        {
            id: 'standard',
            name: 'Free Plan',
            price: 0,
            currency: '₦',
            perTicketFee: 0,
            description: 'Start hosting with no monthly fee. Perfect for testing the waters with up to 2 active events at a time.',
            features: [
                '2 Active Events at a Time',
                'Single Ticket Type',
                'Max Ticket Sales (750 tickets)',
                'Customer Profile Insights',
                'Downloadable Attendees List (Up to 250)',
                'Fraud Detection',
            ],
            buttonText: 'Get started free',
            buttonVariant: 'secondary',
        },
        {
            id: 'pro',
            name: 'Professional Plan',
            price: 25000,
            currency: '₦',
            perTicketFee: 0,
            description: 'Everything you need to grow. Unlock advanced analytics, marketing tools, and team access. First 30 days FREE.',
            features: [
                'Unlimited Event Creation',
                'Unlimited Ticket Categories',
                'Max Ticket Sales (2,500 tickets)',
                'Exclusive Discount Codes (Up to 100)',
                'Referral Sales Program',
                'Customer Profile Insights',
                'Downloadable Attendee List (Up to 1,000)',
                'QR Code Check-In System',
                'Real-Time Sales Insights',
                'Revenue Performance Chart',
                'Integrated Marketing Dashboard',
                'Built-in Email Campaigns (400 Sends/Month)',
                'Priority Email Support',
                'Fraud Detection',
            ],
            buttonText: 'Start free trial',
            buttonVariant: 'primary',
            highlighted: true,
            trial: 'First 30 days FREE',
        },
        {
            id: 'enterprise',
            name: 'Enterprise Plan',
            price: 300000,
            currency: '₦',
            perTicketFee: 0,
            description: 'Maximum power for large-scale organisations. Full analytics, resale controls, dedicated support, and custom pricing.',
            features: [
                'Unlimited Event Creation',
                'Unlimited Ticket Categories',
                'Unlimited Resale Volume',
                'Exclusive Discount Codes (Up to 500)',
                'Referral Sales Program',
                'Customer Profile Insights',
                'Unlimited downloadable Attendee List',
                'QR Code Check-In System',
                'Included Featured Event Listing (2 Weeks)',
                'Real-Time Sales Insights',
                'Revenue Performance Chart',
                'Geographical Breakdown',
                'Week-Based Analysis',
                'Integrated Marketing Dashboard',
                'Built-in Email Campaigns (4,600 Sends/Month)',
                'SMS Send (100 Sends)',
                'Sponsored Email Campaign',
                'Dedicated Account Manager',
                'Priority Customer Support',
                'Fraud Detection',
            ],
            buttonText: 'Contact sales',
            buttonVariant: 'secondary',
        },
    ],

    // Feature comparison table
    // true   = check icon
    // false  = lock / unavailable icon
    // string = specific value shown as text
    features: [
        //  Event Management
        { category: 'Event Management', name: 'Active Events Limit', standard: '2 Active Events', pro: 'Unlimited', enterprise: 'Unlimited' },
        { category: 'Event Management', name: 'Ticket Types', standard: 'Single Ticket Type', pro: 'Unlimited Categories', enterprise: 'Unlimited Categories' },
        { category: 'Event Management', name: 'Max Ticket Sales', standard: '750 Tickets', pro: '2,500 Tickets', enterprise: 'Unlimited' },
        { category: 'Event Management', name: 'Unlimited Resale Volume', standard: false, pro: false, enterprise: true },
        { category: 'Event Management', name: 'Exclusive Discount Codes', standard: false, pro: 'Up to 100', enterprise: 'Up to 500' },
        { category: 'Event Management', name: 'Referral Sales Program', standard: false, pro: true, enterprise: true },
        { category: 'Event Management', name: 'QR Code Check-In System', standard: false, pro: true, enterprise: true },

        //  Analytics & Reports
        { category: 'Analytics', name: 'Downloadable Attendee List', standard: 'Up to 250', pro: 'Up to 1,000', enterprise: 'Unlimited' },
        { category: 'Analytics', name: 'Customer Profile Insights', standard: true, pro: true, enterprise: true },
        { category: 'Analytics', name: 'Real-Time Sales Insights', standard: false, pro: true, enterprise: true },
        { category: 'Analytics', name: 'Revenue Performance Chart', standard: false, pro: true, enterprise: true },
        { category: 'Analytics', name: 'Geographical Breakdown', standard: false, pro: false, enterprise: true },
        { category: 'Analytics', name: 'Week-Based Analysis', standard: false, pro: false, enterprise: true },

        //  Marketing
        { category: 'Marketing', name: 'Integrated Marketing Dashboard', standard: false, pro: true, enterprise: true },
        { category: 'Marketing', name: 'Built-in Email Campaigns', standard: false, pro: '400/Monthly Send', enterprise: '4,600/Monthly Send' },
        { category: 'Marketing', name: 'SMS Send', standard: false, pro: false, enterprise: 'SMS Send (100 Send)' },
        { category: 'Marketing', name: 'Sponsored Email Campaign', standard: false, pro: false, enterprise: true },
        { category: 'Marketing', name: 'Featured Event Listing', standard: false, pro: false, enterprise: '2 Weeks' },

        //  Support & Security
        { category: 'Support', name: 'Priority Support', standard: false, pro: 'Email', enterprise: 'Priority Support Email + Call' },
        { category: 'Support', name: 'Dedicated Account Manager', standard: false, pro: false, enterprise: true },
        { category: 'Support', name: 'Fraud Detection', standard: true, pro: true, enterprise: true },
    ],
}

// Attendee Plans
// Attendees pay per ticket only — no monthly subscription.
// Source: Individual Pricing Plan section, PDF page 2.
//
// NOTE: The points/rewards system is core to the attendee free tier —
// do not strip it. It was fully documented in the original PDF.

export const attendeePricingData: PricingData = {
    plans: [
        {
            id: 'standard',
            name: 'Free (Points-Based)',
            price: 0,
            currency: '₦',
            perTicketFee: 0,
            description: 'Discover and attend free events with no cost. Earn rewards on every ticket purchase.',
            features: [
                'Browse all public events',
                'Ticket purchase & QR code delivery',
                'Earn 1 point per ₦100 spent',
                'Redeem points for ticket discounts (10–15% limit)',
                'Standard affiliate referral rewards',
                'Group ticket sharing',
                'Standard customer support',
            ],
            buttonText: 'Get started free',
            buttonVariant: 'secondary',
        },
        {
            id: 'pro',
            name: 'Pro',
            price: 2500,
            currency: '₦',
            perTicketFee: 0,
            description: 'Unlock ticket resale, boosted rewards, early access, and exclusive deals. Built for frequent event-goers.',
            features: [
                'Everything in Free',
                'Earn 2 points per ₦100 spent',
                'Higher points redemption limits',
                'Ticket resale marketplace access',
                'Early access to popular events',
                'Exclusive member-only deals & promo codes',
                'Reduced or zero convenience fees',
                'Monthly ticket credits (e.g., ₦1,000/month)',
                'Priority / faster checkout',
                'Priority customer support',
            ],
            buttonText: 'Upgrade to Pro',
            buttonVariant: 'primary',
            highlighted: true,
        }
    ],

    features: [
        //  Ticketing & Discovery
        { category: 'Ticketing', name: 'Free Event Access', standard: true, pro: true, enterprise: true },
        { category: 'Ticketing', name: 'Paid Event Tickets', standard: true, pro: true, enterprise: true },
        { category: 'Ticketing', name: 'QR Code Ticket Delivery', standard: true, pro: true, enterprise: true },
        { category: 'Ticketing', name: 'Ticket Resale Access', standard: false, pro: true, enterprise: true },
        { category: 'Ticketing', name: 'Bulk Ticket Purchasing', standard: false, pro: false, enterprise: true },
        { category: 'Ticketing', name: 'Priority / Faster Checkout', standard: false, pro: true, enterprise: true },

        //  Rewards & Points
        { category: 'Rewards', name: 'Earn Points on Purchases', standard: '1 pt / ₦100', pro: '2 pts / ₦100', enterprise: '2 pts / ₦100' },
        { category: 'Rewards', name: 'Bonus Points for Attendance', standard: 'Standard', pro: 'Higher bonus', enterprise: 'Higher bonus' },
        { category: 'Rewards', name: 'Redeem Points for Discounts', standard: 'Yes', pro: 'Yes (higher caps)', enterprise: 'Yes (higher caps)' },
        { category: 'Rewards', name: 'Max Discount per Ticket', standard: 'Limited (10–15%)', pro: 'Higher limit', enterprise: 'Higher limit' },
        { category: 'Rewards', name: 'Points Expiry', standard: '6–12 months', pro: 'Longer validity', enterprise: 'Longer validity' },

        //  Perks & Savings
        { category: 'Perks', name: 'Affiliate Referral Rewards', standard: 'Yes', pro: 'Yes (boosted)', enterprise: 'Yes (boosted)' },
        { category: 'Perks', name: 'Early Access to Popular Events', standard: false, pro: true, enterprise: true },
        { category: 'Perks', name: 'Exclusive Member-Only Deals', standard: false, pro: true, enterprise: true },
        { category: 'Perks', name: 'Eligibility for Sponsored Deals', standard: 'Limited', pro: 'Priority', enterprise: 'Priority' },
        { category: 'Perks', name: 'Promo Code Eligibility', standard: false, pro: true, enterprise: true },
        { category: 'Perks', name: 'Convenience Fee Discounts', standard: false, pro: 'Reduced or zero', enterprise: 'Reduced or zero' },
        { category: 'Perks', name: 'Monthly Ticket Credits', standard: false, pro: 'Yes (e.g. ₦1,000/mo)', enterprise: 'Custom' },

        //  Group & Social
        { category: 'Group & Social', name: 'Group Ticket Sharing', standard: true, pro: true, enterprise: true },
        { category: 'Group & Social', name: 'Split Payments in Groups', standard: false, pro: true, enterprise: true },
        { category: 'Group & Social', name: 'Team Accounts', standard: false, pro: false, enterprise: true },

        //  Billing & Reporting
        { category: 'Billing', name: 'Centralised Team Billing', standard: false, pro: false, enterprise: true },
        { category: 'Billing', name: 'Spend Reporting & Export', standard: false, pro: false, enterprise: true },

        //  Support
        { category: 'Support', name: 'Customer Support', standard: 'Standard', pro: 'Priority', enterprise: 'Priority' },
        { category: 'Support', name: 'Dedicated Account Manager', standard: false, pro: false, enterprise: true },
    ],
}



interface FeaturedPlan {
    id: string
    name: string
    duration: string
    price: number
    originalPrice?: number
    features: string[]
}

export const FEATURED_PLANS: FeaturedPlan[] = [
    {
        id: "basic",
        name: "Basic",
        duration: "1-Day Feature",
        price: 45000,
        features: ["Featured in Top Events for 24 hours", "Priority placement in event feed", "“Featured” badge on your post"]
    },
    {
        id: "standard",
        name: "Standard",
        duration: "3-Day Feature",
        price: 85000,
        features: ["Featured for 72 hours", "Higher visibility across homepage & search", "Featured badge + boosted impressions", "Social media story promotion"]
    },
    {
        id: "advanced",
        name: "Advanced",
        duration: "7-Day Feature",
        price: 165000,
        features: ["Featured for 7 days", "Maximum visibility & sustained reach", "Featured badge + boosted impressions", "Weekly main social media post + story promotion"]
    },
    {
        id: "premium",
        name: "Premium",
        duration: "30-Day Feature",
        price: 600000,
        originalPrice: 1300000,
        features: [
            "Featured for 30 days",
            "Dominant visibility across homepage, event feed & search",
            "Featured badge + continuous boosted impressions",
            "Monthly main social media post + story promotion",
            "Email / newsletter feature",
            "Advanced performance insights & engagement analytics"
        ]
    }
]