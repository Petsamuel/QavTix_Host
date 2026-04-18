"use client"

import { Dispatch, SetStateAction, useState } from "react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/lib/redux/hooks"
import { MarketingToolsFilter } from "../custom-utils/TableDataDisplayAreas/resources/avaliable-filters"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import PromoCodeListTable from "../custom-utils/TableDataDisplayAreas/tables/PromoCodeTable"
import AffiliateLeaderboardTable from "../custom-utils/TableDataDisplayAreas/tables/AffliateLeaderboardTable"
import EmailCampaignListTable from "../custom-utils/TableDataDisplayAreas/tables/EmailCampaignListTable"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import AddPromoCode from "@/lib/features/promo/AddPromoCode"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import ComposeMailBtn from "@/lib/features/compose-mail/ComposeMailBtn"
import { TabSlice, useDataDisplay } from "@/custom-hooks/UseDataDisplay"

import {
    PROMO_CODES_ENDPOINT,
    AFFILIATE_LINKS_HOST_ENDPOINT,
    EMAIL_CAMPAIGNS_ENDPOINT,
} from "@/endpoints"
import { mapAffiliateCards } from "@/helper-fns/mapToStatCards"

interface Props {
    initialPromoCodes: TabSlice<PromoCode>
    initialAffiliates: TabSlice<AffiliateLink> & { cards: AffiliateCards }
    initialCampaigns:  TabSlice<EmailCampaign>
}

export default function MarketingToolsPageContentWrapper({
    initialPromoCodes,
    initialAffiliates,
    initialCampaigns,
}: Props) {

    const { tabList: tabListData } = MarketingToolsFilter
    const [activeTab, setActiveTab] = useState<typeof MarketingToolsFilter.tabList[number]["value"]>("promo-codes")

    const { user }    = useAppSelector(store => store.authUser)
    const currency    = user?.currency || ""

    // Affiliate cards state
    const [affiliateCards, setAffiliateCards] = useState<AffiliateCards>(initialAffiliates.cards)

    // Promo codes
    const { activeTabState: promoState } = useDataDisplay<PromoCode>(
        {
            endpoint: PROMO_CODES_ENDPOINT,
            tabs: [{ key: "promo-codes", initialData: initialPromoCodes, staticParams: {} }],
            activeTab: "promo-codes",
            revalidateTarget: "marketing"
        },
        {},
    )

    // Affiliates
    const { activeTabState: affiliateState } = useDataDisplay<AffiliateLink>(
        {
            endpoint: AFFILIATE_LINKS_HOST_ENDPOINT,
            tabs: [{
                key:         "affiliate-program",
                initialData: initialAffiliates,
                staticParams: {},
                onCards:     (cards: AffiliateCards | null) => {
                    if (cards) setAffiliateCards(cards)
                },
            }],
            activeTab: "affiliate-program",
        },
        {},
    )

    // Campaigns
    const { activeTabState: campaignState } = useDataDisplay<EmailCampaign>(
        {
            endpoint: EMAIL_CAMPAIGNS_ENDPOINT,
            tabs: [{ key: "email-campaigns", initialData: initialCampaigns, staticParams: {} }],
            activeTab: "email-campaigns",
            revalidateTarget: "marketing"
        },
        {},
    )

    const handleTabChange = (tab: string) => {
        // Reset the leaving tab's search
        promoState.resetSearch()
        affiliateState.resetSearch()
        campaignState.resetSearch()
        setActiveTab(tab as typeof activeTab)
    }

    const affiliateMetrics = mapAffiliateCards(affiliateCards, currency)

    const activeState =
        activeTab === "promo-codes"       ? promoState     :
        activeTab === "affiliate-program" ? affiliateState :
        campaignState

    return (
        <main className="pt-6 pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4 capitalize")}>
                    {activeTab.replace("-", " ")}
                </h2>
                {activeTab === "promo-codes"       && <AddPromoCode />}
                {activeTab === "affiliate-program" && <ExportButton1 showFormatSelector />}
                {activeTab === "email-campaigns"   && <ComposeMailBtn />}
            </div>

            {activeTab === "affiliate-program" && (
                <div className="mb-10">
                    <MetricCardsContainer1 metrics={affiliateMetrics} />
                </div>
            )}

            <section>
                <DataDisplayTableWrapper
                    tabs={tabListData}
                    activeTab={activeTab}
                    setActiveTab={handleTabChange as Dispatch<SetStateAction<string>>}
                    showSearch
                    currentSearch={activeState.search}
                    searchPlaceholder={
                        activeTab === "promo-codes"     ? "Search promo codes..." :
                        activeTab === "email-campaigns" ? "Search campaigns..."   :
                        "Search affiliates..."
                    }
                    onSearch={activeState.handleSearch}
                    isLoading={activeState.isLoading}
                >
                    {activeTab === "promo-codes" && (
                        <PromoCodeListTable
                            items={promoState.items}
                            isLoading={promoState.isLoading}
                            isLoadingMore={promoState.isLoadingMore}
                            isEmpty={promoState.isEmpty}
                            isError={promoState.isError}
                            search={promoState.search}
                            count={promoState.count}
                            currentPage={promoState.currentPage}
                            totalPages={promoState.totalPages}
                            fetchPage={promoState.fetchPage}
                        />
                    )}
                    {activeTab === "affiliate-program" && (
                        <AffiliateLeaderboardTable
                            items={affiliateState.items}
                            isLoading={affiliateState.isLoading}
                            isLoadingMore={affiliateState.isLoadingMore}
                            isEmpty={affiliateState.isEmpty}
                            isError={affiliateState.isError}
                            search={affiliateState.search}
                            count={affiliateState.count}
                            currentPage={affiliateState.currentPage}
                            totalPages={affiliateState.totalPages}
                            fetchPage={affiliateState.fetchPage}
                        />
                    )}
                    {activeTab === "email-campaigns" && (
                        <EmailCampaignListTable
                            items={campaignState.items}
                            isLoading={campaignState.isLoading}
                            isLoadingMore={campaignState.isLoadingMore}
                            isEmpty={campaignState.isEmpty}
                            isError={campaignState.isError}
                            search={campaignState.search}
                            count={campaignState.count}
                            currentPage={campaignState.currentPage}
                            totalPages={campaignState.totalPages}
                            fetchPage={campaignState.fetchPage}
                        />
                    )}
                </DataDisplayTableWrapper>
            </section>
        </main>
    )
}