import { getFinancials, getPayoutAccounts } from "@/actions/financials"
import { getHostProfile } from "@/actions/auth/index"
import GatedPageModal from "@/components/modals/GatedPageModal"
import FinancialsPageContentWrapper from "@/components/page-wrappers/FinancialsPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.FINANCIALS.title,
    description: HOST_PAGE_METADATA.FINANCIALS.description,
}

export default async function FinancialsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const [profile, financialsResult, accountsResult] = await Promise.all([
        getHostProfile(token),
        getFinancials(token!),
        getPayoutAccounts(token!),
    ])

    if (!profile?.verified) {
        return <GatedPageModal type="verification" />
    }

    if (!profile.plan_type) {
        return <GatedPageModal type="plan" featureName="Financials" requiredPlan="Free" />
    }

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