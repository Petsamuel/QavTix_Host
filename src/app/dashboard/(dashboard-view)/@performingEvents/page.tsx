import { getDashboardFeed } from "@/actions/dashboard/index"
import { cookies } from "next/headers"
import ActivitySectionError from "@/components/error-components/DashboardSlotError"
import TopPerformingEventsSlotPW from "@/components/page-wrappers/TopPerformingEventsSlotPW"

export default async function PerformingEventsSlot() {
    const cookieStore = await cookies()
    const token = cookieStore.get("host_access_token")?.value
    const result = await getDashboardFeed(token!)

    if (!result.success || !result.data) {
        return (
            <ActivitySectionError
                title="Failed to load top events"
                desc="We couldn't fetch your top performing events. Please refresh the page."
            />
        )
    }

    return (
        <section>
            <TopPerformingEventsSlotPW eventsData={result.data.trending} />
        </section>
    )
}