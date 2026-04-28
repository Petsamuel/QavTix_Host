import { getPaymentMethods } from "@/actions/payment"
import { getPrivacySettings } from "@/actions/settings"
import AccountSettingsContentWrapper from "@/components/page-wrappers/AccountSettingsContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.ACCOUNT_SETTINGS.title,
    description: HOST_PAGE_METADATA.ACCOUNT_SETTINGS.description,
}



export default async function SettingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const [privacyResult, paymentResult] = await Promise.all([
        getPrivacySettings(token),
        getPaymentMethods(token),
    ])

    return (
        <AccountSettingsContentWrapper
            initialPrivacySettings={
                privacyResult.success && privacyResult.data
                    ? privacyResult.data
                    : { show_my_events: false, show_past_events: false }
            }
            initialPaymentMethods={
                paymentResult.success ? (paymentResult.data ?? []) : []
            }
        />
    )
}