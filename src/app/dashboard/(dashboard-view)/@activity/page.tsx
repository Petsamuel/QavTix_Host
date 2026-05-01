import { cookies } from "next/headers"
import ActivitySectionError from "@/components/error-components/DashboardSlotError"
import ActivitySectionPW from "@/components/page-wrappers/ActivitySectionPW"
import { getDashboardFeed } from "@/actions/dashboard"

export default async function ActivitySection() {
    const cookieStore = await cookies()
    const token = cookieStore.get("host_access_token")?.value;
    const result = await getDashboardFeed(token!)

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