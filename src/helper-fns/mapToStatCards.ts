import { formatPrice } from "./formatPrice"
import { format, parseISO } from "date-fns"


export function mapToStatCards(cards: DashboardCardData): IDashboardStat[] {
    return [
        {
            label: "Total Revenue",
            number: cards.total_revenue,
            icon: "hugeicons:money-bag-01",
            iconBg: "bg-red-400",
            cardBg: "bg-red-50",
            linkHref: "/dashboard/payouts",
            buttonLabel: "View Details",
            change: {
                value: `+${cards.revenue_change.toLocaleString()}%`,
                period: "from last month",
            },
        },
        {
            label: "Tickets Sold",
            number: cards.tickets_sold.toLocaleString(),
            icon: "hugeicons:ticket-02",
            iconBg: "bg-orange-400",
            cardBg: "bg-orange-50",
            linkHref: "/dashboard/tickets",
            buttonLabel: "View Sales",
            change: {
                value: `+${cards.tickets_sold_change}`,
                period: "this week",
            },
        },
        {
            label: "Active Events",
            number: cards.active_events,
            icon: "hugeicons:calendar-02",
            iconBg: "bg-blue-500",
            cardBg: "bg-blue-50",
            linkHref: "/dashboard/events",
            buttonLabel: "Manage Events",
            change: {
                value: cards.active_events_change,
                period: "this week",
            },
        },
        {
            label: "Pending Payouts",
            number: cards.pending_payouts,
            icon: "hugeicons:hourglass",
            iconBg: "bg-emerald-500",
            cardBg: "bg-emerald-50",
            linkHref: "/dashboard/payouts",
            buttonLabel: "Payout History",
            change: {
                value: cards.pending_payouts_change,
                period: "this week",
            },
        },
    ]
}

export function mapCustomerCardsToMetrics(cards: CustomersCards, currency: string): MetricCardData[] {
    return [
        {
            id: "total-customers",
            value: String(cards.total_customers),
            label: "Total customers",
            description: "Everyone you've served.",
            icon: "famicons:people-outline",
            iconColor: "text-[#359160]",
        },
        {
            id: "new-month",
            value: String(cards.new_this_month),
            label: "New this month",
            description: "Latest ticket buyers.",
            icon: "famicons:gift-outline",
            iconColor: "text-brand-accent-5",
        },
        {
            id: "repeat-buyers",
            value: String(cards.repeat_buyers),
            label: "Repeat Buyers",
            description: "Customers who returned",
            icon: "uil:repeat",
            iconColor: "text-brand-accent-9",
        },
        {
            id: "average-spend",
            value: `${formatPrice(Number(cards.average_spend), currency)}`,
            label: "Average Spend",
            description: "Avg. spend per customer.",
            icon: "icon-park-outline:average",
            iconColor: "text-blue-600",
        },
    ]
}



export function mapFinancialCards(
    cards: FinancialCards,
    currency: string,
): MetricCardData[] {
    return [
        {
            id: "gross",
            value: formatPrice(parseFloat(cards.total_revenue), currency),
            label: "Gross",
            description: "Total revenue generated",
            icon: "hugeicons:dollar-square",
            iconColor: "text-[#359160]",
        },
        {
            id: "total-payout",
            value: formatPrice(parseFloat(cards.total_payout), currency),
            label: "Total Payout",
            description: "Total amount paid out",
            icon: "hugeicons:wallet-done-01",
            iconColor: "text-brand-accent-5",
        },
        {
            id: "available-balance",
            value: formatPrice(parseFloat(cards.available_balance), currency),
            label: "Available Balance",
            description: "Ready to withdraw",
            icon: "hugeicons:discount-01",
            iconColor: "text-[#914613]",
        },
        {
            id: "next-payout-date",
            value: cards.next_payout_date
                ? format(parseISO(cards.next_payout_date), "EEE, MMM d, yyyy")
                : "—",
            label: "Next Payout Date",
            description: "Scheduled payment date",
            icon: "hugeicons:calendar-03",
            iconColor: "text-brand-primary-4",
        },
    ]
}



export function mapAffiliateCards(
    cards: AffiliateCards,
    currency: string,
): MetricCardData[] {
    return [
        {
            id: "affiliates",
            value: String(cards.total_affiliates),
            label: "Affiliates",
            description: "Partners driving referrals",
            icon: "famicons:people-outline",
            iconColor: "text-brand-accent-9",
        },
        {
            id: "new-month",
            value: String(cards.new_this_month),
            label: "New This Month",
            description: "Recently added affiliates",
            icon: "hugeicons:discount-01",
            iconColor: "text-brand-accent-5",
        },
        {
            id: "tickets-sold",
            value: String(cards.total_tickets_sold),
            label: "Tickets Sold",
            description: "Units sold by affiliates",
            icon: "hugeicons:ticket-02",
            iconColor: "text-brand-primary-4",
        },
        {
            id: "commission-paid",
            value: formatPrice(parseFloat(cards.total_commission_paid), currency),
            label: "Commission Paid",
            description: "Total earnings distributed.",
            icon: "hugeicons:dollar-square",
            iconColor: "text-brand-accent-5",
        },
    ]
}



export function mapCheckInMetricsCards(cards: CheckInCards, currency: string): MetricCardData[] {
    return [
        {
            id: 'total-tickets',
            value: cards.total_tickets.toLocaleString(),
            label: 'Tickets Sold',
            description: 'All tickets issued out',
            icon: "hugeicons:ticket-02",
            iconColor: 'text-brand-primary-4'
        },
        {
            id: 'checked-in',
            value: cards.total_checkins.toLocaleString(),
            label: 'Checked-In',
            description: 'Successfully admitted',
            icon: "hugeicons:checkmark-badge-03",
            iconColor: 'text-[#359160]',
        },
        {
            id: 'not-arrived',
            value: cards.total_not_checked_in.toLocaleString(),
            label: 'Not Arrived',
            description: 'Tickets not yet scanned',
            icon: "mingcute:sandglass-line",
            iconColor: 'text-brand-accent-4'
        },
        {
            id: 'issues-duplicates',
            value: cards.issues.toLocaleString(),
            label: 'Issues / Duplicates',
            description: 'Failed or repeated scans',
            icon: "octicon:alert-16",
            iconColor: 'text-[#FF0000]',
        },
    ]
}




export function mapEventsCards(cards: EventCards): MetricCardData[] {
    return [
        {
            id: "live",
            value: String(cards.live),
            label: "Live Events",
            description: "Currently published & active",
            icon: "hugeicons:calendar-02",
            iconColor: "text-[#359160]",
        },
        {
            id: "draft",
            value: String(cards.draft),
            label: "Drafts",
            description: "Unpublished events",
            icon: "hugeicons:pencil-edit-01",
            iconColor: "text-brand-accent-5",
        },
        {
            id: "ended",
            value: String(cards.ended),
            label: "Ended",
            description: "Past events",
            icon: "mingcute:sandglass-line",
            iconColor: "text-brand-accent-4",
        },
        {
            id: "sold-out",
            value: String(cards.sold_out),
            label: "Sold Out",
            description: "Fully booked events",
            icon: "hugeicons:ticket-02",
            iconColor: "text-brand-primary-4",
        },
    ]
}


export function mapSalesAnalyticsCards(
    cards: SalesAnalyticsCardsData,
    currency: string,
): MetricCardData[] {
    const fmtChange = (val: number) =>
        val > 0 ? `+${val.toLocaleString()}%` :
            val < 0 ? `${val.toLocaleString()}%` : "0%"

    return [
        {
            id: "total-revenue",
            value: formatPrice(parseFloat(cards.total_revenue), currency),
            label: "Total Revenue",
            description: `${fmtChange(parseFloat(cards.total_revenue_change))} change`,
            icon: "/images/vectors/dollar-in.svg",
            iconColor: "text-[#359160]",
            change: parseFloat(cards.total_revenue_change).
        },
        {
            id: "tickets-sold",
            value: cards.tickets_sold.toLocaleString(),
            label: "Tickets Sold",
            description: "Units sold across events",
            icon: "/images/vectors/ticket.svg",
            iconColor: "text-brand-accent-5",
        },
        {
            id: "conversion-rate",
            value: `${cards.conversion_rate.toFixed(2)}%`,
            label: "Conversion Rate",
            description: `${fmtChange(cards.conversion_change)} vs last period`,
            icon: "/images/vectors/conversion.svg",
            iconColor: "text-brand-primary-4",
            change: Number(cards.conversion_change)
        },
        {
            id: "aov",
            value: formatPrice(parseFloat(cards.average_order_value), currency),
            label: "Avg. Order Value",
            description: `${fmtChange(cards.aov_change)} vs last period`,
            icon: "/images/vectors/average-order.svg",
            iconColor: "text-[#914613]",
            change: Number(cards.aov_change)
        },
        // ── Row 2 ────────────────────────────────────────────────────────────
        {
            id: "page-views",
            value: cards.page_views.toLocaleString(),
            label: "Page Views",
            description: "Traffic coming in.",
            icon: "hugeicons:eye",
            iconColor: "text-brand-accent-9",
        },
        {
            id: "refunds",
            value: cards.refunds.toLocaleString(),
            label: "Refunds",
            description: "Money going back.",
            icon: "hugeicons:return-request",
            iconColor: "text-red-500",
        },
        {
            id: "repeat-buyers",
            value: cards.repeat_buyers.toLocaleString(),
            label: "Repeat Buyers",
            description: "Customers returning.",
            icon: "uil:repeat",
            iconColor: "text-blue-600",
        },
    ]
}