import { getSalesAnalyticsCards, getSalesAnalyticsGraphs, getSalesAnalyticsTransaction } from "@/actions/sales-n-analytics"
import { getHostProfile } from "@/actions/auth/index"
import GatedPageModal from "@/components/modals/GatedPageModal"
import SalesAnalyticsPageContentWrapper from "@/components/page-wrappers/SalesAnalyticsPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

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




export default async function SalesAndAnalyticsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const [profileResult, cardsResult, graphsResult, transactionsResult] = await Promise.allSettled([
        getHostProfile(token),
        getSalesAnalyticsCards(token!),
        getSalesAnalyticsGraphs(token!),
        getSalesAnalyticsTransaction(token!),
    ])

    const profile = profileResult.status === "fulfilled" ? profileResult.value : null

    if (profile && profile.user_id && !profile?.verified) {
        return <GatedPageModal type="verification" />
    }

    if (profile && profile.plan_type !== "pro" && profile.plan_type !== "enterprise") {
        return <GatedPageModal type="plan" featureName="Sales Analytics" requiredPlan="Pro" />
    }

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