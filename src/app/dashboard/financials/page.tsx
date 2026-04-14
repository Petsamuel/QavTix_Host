import { getFinancials, getPayoutAccounts } from "@/actions/financials"
import FinancialsPageContentWrapper from "@/components/page-wrappers/FinancialsPageContentWrapper"

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