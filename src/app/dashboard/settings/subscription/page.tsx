import { getSubscription } from "@/actions/settings"
import SubscriptionPanel from "@/components/settings-page/SubsciptionPanel"
import { PricingCheckoutProvider } from "@/custom-hooks/PricingCheckoutContext"


export default async function SubscriptionPage() {
    const result = await getSubscription()

    return (
        <PricingCheckoutProvider>
            <SubscriptionPanel
                initialData={result.success ? (result.data ?? null) : null}
                fetchError={!result.success ? (result.message ?? "Failed to load subscription.") : null}
            />
        </PricingCheckoutProvider>
    )
}