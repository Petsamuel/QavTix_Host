import { getSubscription } from "@/actions/settings"


export default async function SubscriptionPage() {
    const result = await getSubscription()

    return (
        <SubscriptionPanel
            initialData={result.success ? (result.data ?? null) : null}
            fetchError={!result.success ? (result.message ?? "Failed to load subscription.") : null}
        />
    )
}