import { getDashboardFeed } from "@/actions/dashboard"
import AllActivityNotificationsModal from "@/components/modals/ActivityNotificationModal"

export default async function AllActivityModalPage() {
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