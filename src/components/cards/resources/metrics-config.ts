import { formatPrice } from "@/helper-fns/formatPrice"

export interface MetricConfig {
    id: string
    label: string
    description: string
    icon: string
    iconColor: string
    valueFormatter?: (value: any, currency?: string) => string
}


export const customerMetricsConfig: Record<string, MetricConfig> = {
    'total-customers': {
        id: 'total-customers',
        label: 'Total customers',
        description: "Everyone you've served.",
        icon: "famicons:people-outline",
        iconColor: 'text-[#359160]',
    },
    'new-month': {
        id: 'new-month',
        label: 'New this month',
        description: 'Latest ticket buyers.',
        icon: "famicons:gift-outline",
        iconColor: 'text-brand-accent-5',
    },
    'repeat-buyers': {
        id: 'repeat-buyers',
        label: 'Repeat Buyers',
        description: 'Customers who returned',
        icon: "uil:repeat",
        iconColor: 'text-brand-accent-9',
    },
    'average-spend': {
        id: 'average-spend',
        label: 'Average Spend',
        description: 'Avg. spend per customer.',
        icon: "icon-park-outline:average",
        iconColor: 'text-blue-600',
        valueFormatter: (v: string, currency?: string, isMounted: boolean = true) =>
            formatPrice(parseFloat(v ?? "0"), currency, true, isMounted)
    }
}


export const customerProfileMetricsConfig: Record<string, MetricConfig> = {
    "total-spent": {
        id:             "total-spent",
        label:          "Total Spent",
        description:    "Cumulative spend by this customer.",
        icon:           "hugeicons:dollar-square",
        iconColor:      "text-[#359160]",
        valueFormatter: (v: string, currency?: string, isMounted: boolean = true) =>
            formatPrice(parseFloat(v ?? "0"), currency, true, isMounted),
    },
    "tickets-bought": {
        id:          "tickets-bought",
        label:       "Tickets Bought",
        description: "Total tickets purchased.",
        icon:        "hugeicons:ticket-02",
        iconColor:   "text-brand-accent-5",
        valueFormatter: (v: number) => String(v ?? 0),
    },
    "refund-count": {
        id:          "refund-count",
        label:       "Refund Count",
        description: "Number of refunds requested.",
        icon:        "uil:repeat",
        iconColor:   "text-brand-accent-9",
        valueFormatter: (v: number) => String(v ?? 0),
    },
    "last-order-value": {
        id:             "last-order-value",
        label:          "Last Order Value",
        description:    "Most recent purchase amount.",
        icon:           "icon-park-outline:average",
        iconColor:      "text-blue-600",
        valueFormatter: (v: string, currency?: string, isMounted: boolean = true) =>
            formatPrice(parseFloat(v ?? "0"), currency, true, isMounted),
    },
}


export const financeMetricsConfig: Record<string, MetricConfig> = {
    'gross': {
        id: 'gross',
        label: 'Gross',
        description: "Total revenue generated",
        icon: "hugeicons:dollar-square",
        iconColor: 'text-[#359160]',
        valueFormatter: (value: number, currency?: string, isMounted: boolean = true) => 
            formatPrice(value, currency, true, isMounted)
    },
    'platform-fees': {
        id: 'platform-fees',
        label: 'Platform Fees',
        description: 'Total Charges deducted',
        icon: "hugeicons:discount-01",
        iconColor: 'text-[#914613]',
        valueFormatter: (value: number, currency?: string, isMounted: boolean = true) => 
            formatPrice(value, currency, true, isMounted)
    },
    'all-time-payouts': {
        id: 'all-time-payouts',
        label: 'All-time Payouts',
        description: 'Total payouts made',
        icon: "hugeicons:wallet-done-01",
        iconColor: 'text-brand-accent-5',
    },
    'next-payout-date': {
        id: 'next-payout-date',
        label: 'Next Payout Date',
        description: 'Scheduled payment date',
        icon: "hugeicons:calendar-03",
        iconColor: 'text-brand-primary-4'
    }
}



export const affiliateMetricsConfig: Record<string, MetricConfig> = {
    'affiliates': {
        id: 'affiliates',
        label: 'Affiliates',
        description: "Partners driving referrals",
        icon: "famicons:people-outline",
        iconColor: 'text-brand-accent-9',
    },
    'new-affiliates-month': {
        id: 'new-affiliates-month',
        label: 'New this month',
        description: 'Recently added affiliates',
        icon: "hugeicons:discount-01",
        iconColor: 'text-brand-accent-5',
    },
    'tickets-sold': {
        id: 'tickets-sold',
        label: 'Tickets Sold',
        description: 'Units sold by affiliates',
        icon: "hugeicons:ticket-02",
        iconColor: 'text-brand-primary-4'
    },
    'commission-paid': {
        id: 'commission-paid',
        label: 'Commission Paid',
        description: 'Total earnings distributed.',
        icon: "hugeicons:dollar-square",
        iconColor: 'text-brand-accent-5',
        valueFormatter: (value: number, currency?: string, isMounted: boolean = true) => 
            formatPrice(value, currency, true, isMounted)
    },
}




export const checkInMetricsConfig: Record<string, MetricConfig> = {
    'total-tickets': {
        id: 'total-tickets',
        label: 'Tickets Sold',
        description: 'All tickets issued out',
        icon: "hugeicons:ticket-02",
        iconColor: 'text-brand-primary-4'
    },
    'checked-in': {
        id: 'checked-in',
        label: 'Checked-In',
        description: 'Successfully admitted',
        icon: "hugeicons:checkmark-badge-03",
        iconColor: 'text-[#359160]',
    },
    'not-arrived': {
        id: 'not-arrived',
        label: 'Not Arrived',
        description: 'Tickets not yet scanned',
        icon: "mingcute:sandglass-line",
        iconColor: 'text-brand-accent-4'
    },
    'issues-duplicates': {
        id: 'issues-duplicates',
        label: 'Issues / Duplicates',
        description: 'Failed or repeated scans',
        icon: "octicon:alert-16",
        iconColor: 'text-[#FF0000]',
    },
}




export const userProfileMetricsConfig: Record<string, MetricConfig> = {
    'total-spent': {
        id: 'total-spent',
        label: "Total Spent",
        description: "Customer's lifetime spend",
        icon: "hugeicons:dollar-square",
        iconColor: 'text-[#359160]',
        valueFormatter: (value: number, currency?: string, isMounted: boolean = true) => 
            formatPrice(value, currency, true, isMounted)
    },
    'tickets-bought': {
        id: 'tickets-bought',
        label: "Tickets Bought",
        description: "Total tickets purchased",
        icon: "hugeicons:ticket-02",
        iconColor: 'text-brand-primary-4'
    },
    'refund-count': {
        id: 'refund-count',
        label: "Refund Count",
        description: "Number of refunds",
        icon: "hugeicons:refund-01",
        iconColor: 'text-[#FF0000]',
    },
    'last-order-value': {
        id: 'last-order-value',
        label: "Last Order Value",
        description: "Most recent purchase amount",
        icon: "hugeicons:shopping-cart-01",
        iconColor: 'text-brand-accent-5',
        valueFormatter: (value: number, currency?: string, isMounted: boolean = true) => 
            formatPrice(value, currency, true, isMounted)
    }
}



export const dashboardStatsConfig = {
    'total-revenue': {
        id: 'total-revenue',
        icon: "hugeicons:analytics-01",
        iconBg: "bg-[#FA5A7D]",
        cardBg: "bg-[#FFE2E5]",
        label: "Total Revenue",
        linkText: "View Details →",
        valueFormatter: (value: number) => value.toLocaleString()
    },
    'tickets-sold': {
        id: 'tickets-sold',
        icon: "icon-park-solid:ticket",
        iconBg: "bg-[#FF947A]",
        cardBg: "bg-[#FFF4DE]",
        label: "Tickets Sold",
        linkText: "View Sales →",
    },
    'active-events': {
        id: 'active-events',
        icon: "hugeicons:calendar-check-out-02",
        iconBg: "bg-brand-primary-5",
        cardBg: "bg-[#E6EEFA]",
        label: "Active Events",
        linkText: "Manage Events →",
    },
    'pending-payouts': {
        id: 'pending-payouts',
        icon: "ph:currency-circle-dollar-bold",
        iconBg: "bg-[#83AD7D]",
        cardBg: "bg-[#EFFFED]",
        label: "Pending Payouts",
        linkText: "Payout History →",
    }
}





export const salesAnalyticsMetricsConfig: Record<string, MetricConfig> = {
    'total-revenue': {
        id: 'total-revenue',
        label: "Total Revenue",
        icon: "/images/vectors/dollar-in.svg",
        valueFormatter: (value: number, currency?: string, isMounted: boolean = true) => 
            formatPrice(value, currency, true, isMounted),
        iconColor: "",
        description: "",
    },
    'tickets-sold': {
        id: 'tickets-sold',
        label: "Tickets Sold",
        icon: "/images/vectors/ticket.svg",
        iconColor: "",
        description: "",
    },
    'conversion-rate': {
        id: 'conversion-rate',
        label: "Conversion Rate",
        icon: "/images/vectors/conversion.svg",
        description: "",
        iconColor: "",
    },
    'average-order-value': {
        id: 'average-order-value',
        label: "Average Order Value",
        icon: "/images/vectors/average-order.svg",
        description: "",
        iconColor: "",
        valueFormatter: (value: number, currency?: string, isMounted: boolean = true) => 
            formatPrice(value, currency, true, isMounted)
    }
}



export type MetricStatCardConfig = {
    id: string
    value: string | number
    label: string
    description: string
    variant: 'primary' | 'accent' | 'blue'
}

export const analyticsMetricStatCardsConfig2: MetricStatCardConfig[] = [
    {
        id: 'page-views',
        value: '2,632',
        label: 'Page views',
        description: 'Traffic coming in.',
        variant: 'primary'
    },
    {
        id: 'refunds',
        value: '14',
        label: 'Refunds',
        description: 'Money going back.',
        variant: 'accent'
    },
    {
        id: 'repeat-buyers',
        value: '632',
        label: 'Repeat Buyers',
        description: 'Customers returning.',
        variant: 'blue'
    }
]

export const analyticsMetricStatCardsConfig2VariantStyles = {
    primary: {
        container: 'bg-brand-primary-1 border-brand-primary-2',
        value: 'text-brand-primary-4',
        label: 'text-brand-primary-4',
        description: 'text-brand-primary-4'
    },
    accent: {
        container: 'bg-brand-accent-1 border-brand-accent-2',
        value: 'text-brand-accent-6',
        label: 'text-brand-accent-7',
        description: 'text-brand-accent-5'
    },
    blue: {
        container: 'bg-brand-primary-4 border-brand-primary-5',
        value: 'text-white',
        label: 'text-white',
        description: 'text-white/80'
    }
}




export const myEventsMetricsConfig: Record<string, MetricConfig> = {
    'live-events': {
        id: 'live-events',
        label: 'Live Events',
        description: "Events currently listed",
        icon: "hugeicons:calendar-03",
        iconColor: 'text-[#359160]',
    },
    'draft': {
        id: 'draft',
        label: 'Draft',
        description: 'Events in preparation',
        icon: "hugeicons:task-edit-02",
        iconColor: 'text-brand-accent-5',
    },
    'ended': {
        id: 'ended',
        label: 'Ended',
        description: 'Events already concluded',
        icon: "fluent-mdl2:end-point-solid",
        iconColor: 'text-[#FF0000]'
    },
    'sold-out': {
        id: 'sold-out',
        label: 'Sold Out',
        description: 'Events fully booked',
        icon: "hugeicons:wallet-done-01",
        iconColor: 'text-brand-primary-4',
    },
}