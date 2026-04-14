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

// Host Plans

export const hostPricingData: PricingData = {
    plans: [
        {
            id:           'standard',
            name:         'Standard Plan',
            price:        0,
            currency:     '₦',
            perTicketFee: 0,
            description:  'Start hosting with no monthly fee. Perfect for testing the waters with up to 2 active events at a time.',
            features: [
                '2 active events at a time',
                'Single ticket type per event',
                'Basic event setup',
                'Max ticket sales (750 tickets)',
                'Real-time sales insights',
                'Downloadable attendee list (up to 250)',
                'QR code check-in system',
                'Fraud detection',
                'Email support',
                'Group sharing',
            ],
            buttonText:    'Get started free',
            buttonVariant: 'secondary',
        },
        {
            id:            'pro',
            name:          'Pro Plan',
            price:         25000,
            currency:      '₦',
            perTicketFee:  0,
            description:   'Everything you need to grow. Unlock advanced analytics, marketing tools, and team access. First 30 days FREE.',
            features: [
                'Everything in Standard Plan',
                'Unlimited event creation',
                'Unlimited ticket categories',
                'Advanced event setup',
                'Max ticket sales (2,500 tickets)', 
                'Revenue performance chart',
                'Week-based sales analysis',
                'Integrated marketing dashboard',
                'Built-in email campaigns (100 sends/month)',
                'Exclusive discount codes (up to 100)',
                'Referral sales program',
                'Team permissions (1 team member)',
                'Downloadable attendee list (up to 1,000)',
                'Priority email support',
            ],
            buttonText:    'Start free trial',
            buttonVariant: 'primary',
            highlighted:   true,
            trial:         'First 30 days FREE',
        },
        {
            id:            'enterprise',
            name:          'Enterprise Plan',
            price:         0,
            currency:      'Custom',
            perTicketFee:  0,
            description:   'Maximum power for large-scale organisations. Full analytics, resale controls, dedicated support, and custom pricing.',
            features: [
                'Everything in Pro Plan',
                'Unlimited team members (3 included)',
                'Max ticket sales (10,000 tickets)',
                'Geographical breakdown analytics',
                'Customer profile insights',
                'Exclusive discount codes (up to 300)', 
                'Sponsored email campaigns',
                'Featured event listing (2 weeks included)',
                'Bulk refunds (where applicable)',
                'Dedicated account manager',
                'Ticket resale controls (up to +20%)',
                'Fraud detection & resale controls',
                'Advanced security options',
                'Priority customer support',
                'Custom integrations & workflows',
            ],
            buttonText:    'Contact sales',
            buttonVariant: 'secondary',
        },
    ],

    // Feature comparison table
    // true   = check icon
    // false  = lock / unavailable icon
    // string = specific value shown as text
    features: [
        //  Event Management
        { category: 'Event Management', name: 'Active Events',                  standard: '2 max',       pro: 'Unlimited',    enterprise: 'Unlimited'        },
        { category: 'Event Management', name: 'Event Setup',                    standard: 'Basic',       pro: 'Advanced',     enterprise: 'Advanced'         },
        { category: 'Event Management', name: 'Ticket Categories',              standard: 'Single type', pro: 'Unlimited',    enterprise: 'Unlimited'        },
        { category: 'Event Management', name: 'Max Ticket Sales',               standard: '750',         pro: '2,500',        enterprise: '10,000'           },
        { category: 'Event Management', name: 'Discount & Promo Codes',         standard: false,         pro: 'Up to 100',    enterprise: 'Up to 300'        }, // ← corrected: was 500
        { category: 'Event Management', name: 'Referral / Affiliate Program',   standard: false,         pro: true,           enterprise: true               },
        { category: 'Event Management', name: 'QR Code Check-In',               standard: true,          pro: true,           enterprise: true               },
        { category: 'Event Management', name: 'Bulk Refunds',                   standard: false,         pro: false,          enterprise: 'Where applicable' },
        { category: 'Event Management', name: 'Ticket Resale Controls',         standard: false,         pro: false,          enterprise: 'Up to +20%'       },
        { category: 'Event Management', name: 'Group Sharing',                  standard: true,          pro: true,           enterprise: true               },

        //  Team & Access
        { category: 'Team & Access',    name: 'Team Permissions',               standard: false,         pro: '1 member',     enterprise: '3 members'        },

        //  Analytics & Reports
        { category: 'Analytics',        name: 'Real-Time Sales Insights',       standard: true,          pro: true,           enterprise: true               },
        { category: 'Analytics',        name: 'Revenue Performance Chart',      standard: false,         pro: true,           enterprise: true               },
        { category: 'Analytics',        name: 'Week-Based Sales Analysis',      standard: false,         pro: true,           enterprise: true               },
        { category: 'Analytics',        name: 'Geographical Breakdown',         standard: false,         pro: false,          enterprise: true               },
        { category: 'Analytics',        name: 'Customer Profile Insights',      standard: false,         pro: false,          enterprise: true               },
        { category: 'Analytics',        name: 'Attendee List Export',           standard: 'Up to 250',   pro: 'Up to 1,000',  enterprise: 'Unlimited'        },

        //  Marketing
        { category: 'Marketing',        name: 'Integrated Marketing Dashboard', standard: false,         pro: true,           enterprise: true               },
        { category: 'Marketing',        name: 'Built-in Email Campaigns',       standard: false,         pro: '100/month',    enterprise: '100/month'        },
        { category: 'Marketing',        name: 'Sponsored Email Campaign',       standard: false,         pro: false,          enterprise: true               },
        { category: 'Marketing',        name: 'Featured Event Listing',         standard: false,         pro: false,          enterprise: '2 weeks free'     },

        //  Support & Security
        { category: 'Support',          name: 'Email Support',                  standard: 'Standard',    pro: 'Priority',     enterprise: 'Priority'         },
        { category: 'Support',          name: 'Dedicated Account Manager',      standard: false,         pro: false,          enterprise: true               },
        { category: 'Support',          name: 'Fraud Detection',                standard: true,          pro: true,           enterprise: true               },
        { category: 'Support',          name: 'Advanced Security Options',      standard: false,         pro: false,          enterprise: true               },
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
            id:           'standard',
            name:         'Free (Points-Based)',
            price:        0,
            currency:     '₦',
            perTicketFee: 0,
            description:  'Discover and attend free events with no cost. Earn rewards on every ticket purchase.',
            features: [
                'Browse all public events',
                'Ticket purchase & QR code delivery',
                'Earn 1 point per ₦100 spent',
                'Redeem points for ticket discounts (10–15% limit)',
                'Standard affiliate referral rewards',
                'Group ticket sharing',
                'Standard customer support',
            ],
            buttonText:    'Get started free',
            buttonVariant: 'secondary',
        },
        {
            id:            'pro',
            name:          'Pro',
            price:         2500,
            currency:      '₦',
            perTicketFee:  0,
            description:   'Unlock ticket resale, boosted rewards, early access, and exclusive deals. Built for frequent event-goers.',
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
            buttonText:    'Upgrade to Pro',
            buttonVariant: 'primary',
            highlighted:   true,
        }
    ],

    features: [
        //  Ticketing & Discovery
        { category: 'Ticketing',        name: 'Free Event Access',              standard: true,               pro: true,                   enterprise: true               },
        { category: 'Ticketing',        name: 'Paid Event Tickets',             standard: true,               pro: true,                   enterprise: true               },
        { category: 'Ticketing',        name: 'QR Code Ticket Delivery',        standard: true,               pro: true,                   enterprise: true               },
        { category: 'Ticketing',        name: 'Ticket Resale Access',           standard: false,              pro: true,                   enterprise: true               },
        { category: 'Ticketing',        name: 'Bulk Ticket Purchasing',         standard: false,              pro: false,                  enterprise: true               },
        { category: 'Ticketing',        name: 'Priority / Faster Checkout',     standard: false,              pro: true,                   enterprise: true               },

        //  Rewards & Points
        { category: 'Rewards',          name: 'Earn Points on Purchases',       standard: '1 pt / ₦100',      pro: '2 pts / ₦100',         enterprise: '2 pts / ₦100'     },
        { category: 'Rewards',          name: 'Bonus Points for Attendance',    standard: 'Standard',         pro: 'Higher bonus',         enterprise: 'Higher bonus'     },
        { category: 'Rewards',          name: 'Redeem Points for Discounts',    standard: 'Yes',              pro: 'Yes (higher caps)',     enterprise: 'Yes (higher caps)'},
        { category: 'Rewards',          name: 'Max Discount per Ticket',        standard: 'Limited (10–15%)', pro: 'Higher limit',         enterprise: 'Higher limit'     },
        { category: 'Rewards',          name: 'Points Expiry',                  standard: '6–12 months',      pro: 'Longer validity',      enterprise: 'Longer validity'  },

        //  Perks & Savings
        { category: 'Perks',            name: 'Affiliate Referral Rewards',     standard: 'Yes',              pro: 'Yes (boosted)',         enterprise: 'Yes (boosted)'    },
        { category: 'Perks',            name: 'Early Access to Popular Events', standard: false,              pro: true,                   enterprise: true               },
        { category: 'Perks',            name: 'Exclusive Member-Only Deals',    standard: false,              pro: true,                   enterprise: true               },
        { category: 'Perks',            name: 'Eligibility for Sponsored Deals',standard: 'Limited',          pro: 'Priority',             enterprise: 'Priority'         },
        { category: 'Perks',            name: 'Promo Code Eligibility',         standard: false,              pro: true,                   enterprise: true               },
        { category: 'Perks',            name: 'Convenience Fee Discounts',      standard: false,              pro: 'Reduced or zero',      enterprise: 'Reduced or zero'  },
        { category: 'Perks',            name: 'Monthly Ticket Credits',         standard: false,              pro: 'Yes (e.g. ₦1,000/mo)', enterprise: 'Custom'           },

        //  Group & Social
        { category: 'Group & Social',   name: 'Group Ticket Sharing',           standard: true,               pro: true,                   enterprise: true               },
        { category: 'Group & Social',   name: 'Split Payments in Groups',       standard: false,              pro: true,                   enterprise: true               },
        { category: 'Group & Social',   name: 'Team Accounts',                  standard: false,              pro: false,                  enterprise: true               },

        //  Billing & Reporting
        { category: 'Billing',          name: 'Centralised Team Billing',       standard: false,              pro: false,                  enterprise: true               },
        { category: 'Billing',          name: 'Spend Reporting & Export',       standard: false,              pro: false,                  enterprise: true               },

        //  Support
        { category: 'Support',          name: 'Customer Support',               standard: 'Standard',         pro: 'Priority',             enterprise: 'Priority'         },
        { category: 'Support',          name: 'Dedicated Account Manager',      standard: false,              pro: false,                  enterprise: true               },
    ],
}