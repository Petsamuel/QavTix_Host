import { getFinancials, getPayoutAccounts } from "@/actions/financials"
import FinancialsPageContentWrapper from "@/components/page-wrappers/FinancialsPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.FINANCIALS.title,
    description: HOST_PAGE_METADATA.FINANCIALS.description,
}


export const dynamic = "force-dynamic"


export default async function FinancialsPage() {
    const [financialsResult, accountsResult] = await Promise.all([
        getFinancials(),
        getPayoutAccounts(),
    ])

    if (!financialsResult.success || !financialsResult.data) {
        throw new Error("Failed to load page")
    }

    return (
        <FinancialsPageContentWrapper
            initialCards={financialsResult.data.cards}
            initialHistory={financialsResult.data.withdrawal_history}
            payoutAccounts={accountsResult.data ?? []}
        />
    )
}