import { getPromoCodes, getAffiliateLinks, getEmailCampaigns } from "@/actions/marketing"
import { getHostProfile } from "@/actions/auth"
import GatedPageModal from "@/components/modals/GatedPageModal"
import MarketingToolsPageContentWrapper from "@/components/page-wrappers/MarketingToolsPageContentWrapper"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

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
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const [profileResult, promoResult, affiliateResult, campaignResult] = await Promise.allSettled([
        getHostProfile(token),
        getPromoCodes(token),
        getAffiliateLinks(token),
        getEmailCampaigns(token),
    ])

    const profile = profileResult.status === "fulfilled" ? profileResult.value : null

    if (!profile?.verified) {
        return <GatedPageModal type="verification" />
    }

    if (profile.plan_type !== "pro" && profile.plan_type !== "enterprise") {
        return <GatedPageModal type="plan" featureName="Marketing Tools" requiredPlan="Pro" />
    }

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