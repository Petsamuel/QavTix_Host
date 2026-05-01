import { getDashboardFeed } from "@/actions/dashboard/client"
import AllActivityNotificationsModal from "@/components/modals/ActivityNotificationModal"
import { cookies } from "next/headers";

export default async function AllActivityModalPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const res = await getDashboardFeed({ page: 1 })

    const activities = res.success ? res.data?.activities ?? [] : []
    const notifications = res.success ? res.data?.notifications ?? [] : []

    return (
        <AllActivityNotificationsModal
            initialActivities={activities}
            initialNotifications={notifications}
            initialPage={1}
            initialHasMore={true}
        />
    )
}