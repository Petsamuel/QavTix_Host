import { getDashboardFeed } from "@/actions/dashboard/client"
import AllActivityNotificationsModal from "@/components/modals/ActivityNotificationModal"
import { cookies } from "next/headers";

export default async function AllActivityModalPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const searchParams = await props.searchParams;
    const params: Record<string, any> = { page: 1 };
    if (searchParams?.activity_type) params.activity_type = searchParams.activity_type;
    if (searchParams?.notification_type) params.notification_type = searchParams.notification_type;

    const res = await getDashboardFeed(params)

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