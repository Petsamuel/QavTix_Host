import { getPromoCodes, getAffiliateLinks, getEmailCampaigns } from "@/actions/marketing"
import MarketingToolsPageContentWrapper from "@/components/page-wrappers/MarketingToolsPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.MARKETING_TOOLS.title,
    description: HOST_PAGE_METADATA.MARKETING_TOOLS.description,
}

export const dynamic = "force-dynamic"

export default async function MarketingToolsPage() {
    const [promoResult, affiliateResult, campaignResult] = await Promise.all([
        getPromoCodes(),
        getAffiliateLinks(),
        getEmailCampaigns(),
    ])

    if (!promoResult.success || !affiliateResult.success || !campaignResult.success) {
        throw new Error("Failed to load marketing tools")
    }

    return (
        <MarketingToolsPageContentWrapper
            initialPromoCodes={promoResult.data     ?? { results: [], count: 0, next: null, previous: null, total_pages: 1 }}
            initialAffiliates={affiliateResult.data ?? { results: [], count: 0, next: null, previous: null, total_pages: 1, cards: { total_affiliates: 0, new_this_month: 0, total_tickets_sold: 0, total_commission_paid: "0.00" } }}
            initialCampaigns={campaignResult.data   ?? { results: [], count: 0, next: null, previous: null, total_pages: 1 }}
        />
    )
}