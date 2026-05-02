import { CACHE_TAGS } from "@/cache-tags";
import {
    GET_PRIVACY_SETTINGS_ENDPOINT,
    GET_SUBSCRIPTION_ENDPOINT,
} from "@/endpoints";
import { handleApiError } from "@/helper-fns/handleApiErrors"

interface PrivacyResult {
    success: boolean
    data?: PrivacySettings
    message?: string
}

export async function getPrivacySettings(token: string | undefined): Promise<PrivacyResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_PRIVACY_SETTINGS_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                next: { tags: [CACHE_TAGS.PRIVACY_SETTINGS], revalidate: 300 }
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data ?? json }

    } catch (error: any) {
        return { success: false, message: "Failed to load privacy settings." }
    }
}

export async function getSubscription(token: string | undefined): Promise<GetSubscriptionResult> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/${GET_SUBSCRIPTION_ENDPOINT}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                next: { tags: [CACHE_TAGS.SUBSCRIPTION], revalidate: 300 }
            }
        )

        if (!res.ok) {
            const json = await res.json()
            return { success: false, message: handleApiError(json) }
        }

        const json = await res.json()
        return { success: true, data: json.data }

    } catch (err) {
        return { success: false, message: "Failed to load subscription." }
    }
}

