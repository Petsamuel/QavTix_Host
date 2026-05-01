import { cookies } from "next/headers"
import { getCategories } from "@/actions/filters/index"
import UpcomingEventsError from "@/components/error-components/UpcomingEventsSlotError"
import UpcomingEventsPW from "@/components/page-wrappers/UpcomingEventsPW"
import { getUpcomingEvents } from "@/actions/dashboard"

export default async function UpcomingEventsSlot() {
    const cookieStore = await cookies()
    const token = cookieStore.get("host_access_token")?.value

    const [upcomingEventsResult, categoriesResult] = await Promise.all([
        getUpcomingEvents(token!),
        getCategories()
    ])


    if (!upcomingEventsResult.success || !upcomingEventsResult.data || !categoriesResult.success || !categoriesResult.data) {
        return <UpcomingEventsError />
    }


    return <UpcomingEventsPW initialData={upcomingEventsResult.data} categories={categoriesResult.data} />
}