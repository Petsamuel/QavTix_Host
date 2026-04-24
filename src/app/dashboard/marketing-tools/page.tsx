import { getPromoCodes, getAffiliateLinks, getEmailCampaigns } from "@/actions/marketing"
import MarketingToolsPageContentWrapper from "@/components/page-wrappers/MarketingToolsPageContentWrapper"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.MARKETING_TOOLS.title,
    description: HOST_PAGE_METADATA.MARKETING_TOOLS.description,
}



const emptyPromos: TabSlice<PromoCode> = {
    results: [], count: 0, next: null, previous: null, total_pages: 1,
}

const emptyAffiliates: TabSlice<AffiliateLink> & { cards: AffiliateCards } = {
    results: [], count: 0, next: null, previous: null, total_pages: 1,
    cards: {
        total_affiliates: 0,
        new_this_month: 0,
        total_tickets_sold: 0,
        total_commission_paid: "0.00",
    },
}

const emptyCampaigns: TabSlice<EmailCampaign> = {
    results: [], count: 0, next: null, previous: null, total_pages: 1,
}

export default async function MarketingToolsPage() {
    const [promoResult, affiliateResult, campaignResult] = await Promise.allSettled([
        getPromoCodes(),
        getAffiliateLinks(),
        getEmailCampaigns(),
    ])

    const promos = promoResult.status === "fulfilled" && promoResult.value.success
        ? promoResult.value.data!
        : emptyPromos

    const affiliates = affiliateResult.status === "fulfilled" && affiliateResult.value.success
        ? affiliateResult.value.data!
        : emptyAffiliates

    const campaigns = campaignResult.status === "fulfilled" && campaignResult.value.success
        ? campaignResult.value.data!
        : emptyCampaigns

    return (
        <MarketingToolsPageContentWrapper
            initialPromoCodes={promos}
            initialAffiliates={affiliates}
            initialCampaigns={campaigns}
        />
    )
}