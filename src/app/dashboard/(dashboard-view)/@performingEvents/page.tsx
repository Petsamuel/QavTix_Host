import { getDashboardFeed } from "@/actions/dashboard"
import ActivitySectionError from "@/components/error-components/DashboardSlotError"
import TopPerformingEventsSlotPW from "@/components/page-wrappers/TopPerformingEventsSlotPW"

export default async function PerformingEventsSlot() {

    const result = await getDashboardFeed()

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