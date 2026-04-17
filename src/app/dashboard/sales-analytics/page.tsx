import { getSalesAnalyticsCards, getSalesAnalyticsGraphs, getSalesAnalyticsTransaction } from "@/actions/sales-n-analytics"
import SalesAnalyticsPageContentWrapper from "@/components/page-wrappers/SalesAnalyticsPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.SALES_ANALYTICS.title,
    description: HOST_PAGE_METADATA.SALES_ANALYTICS.description,
}


export default async function SalesAndAnalyticsPage() {
    const [cardsResult, graphsResult, transactionsResult] = await Promise.all([
        getSalesAnalyticsCards(),
        getSalesAnalyticsGraphs(),
        getSalesAnalyticsTransaction(),
    ])

    if (!cardsResult.success || !cardsResult.data) {
        throw new Error("Failed to load sales analytics cards")
    }
    if (!graphsResult.success || !graphsResult.data) {
        throw new Error("Failed to load sales analytics graphs")
    }
    if (!transactionsResult.success || !transactionsResult.data) {
        throw new Error("Failed to load sales analytics transactions")
    }

    const transactionsSlice = {
        results:     transactionsResult.data.results,
        count:       transactionsResult.data.count,
        next:        transactionsResult.data.next ? 1 : null,
        previous:    transactionsResult.data.previous ? 1 : null,
        total_pages: Math.ceil(transactionsResult.data.count / 10),
    }

    return (
        <SalesAnalyticsPageContentWrapper
            initialCards={cardsResult.data}
            initialGraphs={graphsResult.data}
            initialTransactions={transactionsSlice}
        />
    )
}