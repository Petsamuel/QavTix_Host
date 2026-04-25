import { getSalesAnalyticsCards, getSalesAnalyticsGraphs, getSalesAnalyticsTransaction } from "@/actions/sales-n-analytics"
import SalesAnalyticsPageContentWrapper from "@/components/page-wrappers/SalesAnalyticsPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.SALES_ANALYTICS.title,
    description: HOST_PAGE_METADATA.SALES_ANALYTICS.description,
}

const emptyCards: SalesAnalyticsCardsData = {
    total_revenue: "0.00",
    total_revenue_change: "0.00",
    tickets_sold: 0,
    conversion_rate: 0,
    conversion_change: 0,
    average_order_value: "0.00",
    aov_change: 0,
    page_views: 0,
    refunds: 0,
    repeat_buyers: 0,
}

const emptyGraphs: SalesAnalyticsGraphsData = {
    sales_breakdown: {
        overall: [],
        by_period: [],
    },
    revenue_chart: {
        locked: false,
        data: [],
    },
    week_analysis: {
        locked: false,
        data: {
            change_vs_last_week: 0,
            label: "",
            days: [],
        },
    },
    geo_breakdown: {
        locked: false,
        data: {
            locations: [],
            best_location: {
                label: "",
                tickets: 0,
                revenue: "0.00",
                clicks: 0,
            },
        },
    },
}

const emptyTransactions = {
    results: [],
    count: 0,
    next: null,
    previous: null,
    total_pages: 1,
}

export const dynamic = "force-dynamic"


export default async function SalesAndAnalyticsPage() {
    const [cardsResult, graphsResult, transactionsResult] = await Promise.allSettled([
        getSalesAnalyticsCards(),
        getSalesAnalyticsGraphs(),
        getSalesAnalyticsTransaction(),
    ])

    const cards = cardsResult.status === "fulfilled" && cardsResult.value.success
        ? cardsResult.value.data!
        : emptyCards

    const graphs = graphsResult.status === "fulfilled" && graphsResult.value.success
        ? graphsResult.value.data!
        : emptyGraphs

    const transactionsData = transactionsResult.status === "fulfilled" && transactionsResult.value.success
        ? transactionsResult.value.data!
        : null

    const transactions = transactionsData ? {
        results: transactionsData.results,
        count: transactionsData.count,
        next: transactionsData.next ? 1 : null,
        previous: transactionsData.previous ? 1 : null,
        total_pages: Math.ceil(transactionsData.count / 10),
    } : emptyTransactions

    return (
        <SalesAnalyticsPageContentWrapper
            initialCards={cards}
            initialGraphs={graphs}
            initialTransactions={transactions}
        />
    )
}