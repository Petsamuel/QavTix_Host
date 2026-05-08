import { cookies } from "next/headers"
import ActivitySectionError from "@/components/error-components/DashboardSlotError"
import ActivitySectionPW from "@/components/page-wrappers/ActivitySectionPW"
import { getDashboardFeed } from "@/actions/dashboard"

export default async function ActivitySection(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const searchParams = await props.searchParams;
    const cookieStore = await cookies()
    const token = cookieStore.get("host_access_token")?.value;

    const params: Record<string, any> = {};
    if (searchParams?.activity_type) params.activity_type = searchParams.activity_type;
    if (searchParams?.notification_type) params.notification_type = searchParams.notification_type;

    const result = await getDashboardFeed(token!, params)

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
                follower_count={result.data.follower_count}
            />
        </div>
    )
}