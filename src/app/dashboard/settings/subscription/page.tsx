import { getSubscription } from "@/actions/settings"
import SubscriptionPanel from "@/components/settings-page/SubsciptionPanel"
import { PricingCheckoutProvider } from "@/contexts/checkout/PricingCheckoutContext"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.SUBSCRIPTION.title,
    description: HOST_PAGE_METADATA.SUBSCRIPTION.description,
}



export default async function SubscriptionPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const result = await getSubscription(token)

    return (
        <PricingCheckoutProvider>
            <SubscriptionPanel
                initialData={result.success ? (result.data ?? null) : null}
                fetchError={!result.success ? (result.message ?? "Failed to load subscription.") : null}
            />
        </PricingCheckoutProvider>
    )
}