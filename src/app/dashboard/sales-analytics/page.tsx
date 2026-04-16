import { getSalesAnalyticsCards, getSalesAnalyticsGraphs } from "@/actions/sales-n-analytics"
import SalesAnalyticsPageContentWrapper from "@/components/page-wrappers/SalesAnalyticsPageContentWrapper"

export default async function SalesAndAnalyticsPage() {
    const [cardsResult, graphsResult] = await Promise.all([
        getSalesAnalyticsCards(),
        getSalesAnalyticsGraphs(),
    ])

    if (!cardsResult.success || !cardsResult.data) {
        throw new Error("Failed to load sales analytics cards")
    }
    if (!graphsResult.success || !graphsResult.data) {
        throw new Error("Failed to load sales analytics graphs")
    }

    return (
        <SalesAnalyticsPageContentWrapper
            initialCards={cardsResult.data}
            initialGraphs={graphsResult.data}
        />
    )
}