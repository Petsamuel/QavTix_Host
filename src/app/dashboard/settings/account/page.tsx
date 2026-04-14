import { getPaymentMethods } from "@/actions/payment"
import { getPrivacySettings } from "@/actions/settings"
import AccountSettingsContentWrapper from "@/components/page-wrappers/AccountSettingsContentWrapper"


export default async function SettingsPage() {
    const [privacyResult, paymentResult] = await Promise.all([
        getPrivacySettings(),
        getPaymentMethods(),
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