import { getDashboardFeed } from "@/actions/dashboard"
import ActivitySectionError from "@/components/error-components/DashboardSlotError"
import ActivitySectionPW from "@/components/page-wrappers/ActivitySectionPW"

export default async function ActivitySection() {
    const result = await getDashboardFeed()

    if (!result.success || !result.data) {
        return (
			<ActivitySectionError 
				title="Failed to load activity"
				desc=""
			/>
		)
    }

    return (
        <div className="w-full">
            <ActivitySectionPW
                activities={result.data.activities}
                notifications={result.data.notifications}
            />
        </div>
    )
}