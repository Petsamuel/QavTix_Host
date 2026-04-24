import { getUpcomingEvents } from "@/actions/dashboard"
import { getCategories } from "@/actions/filters"
import UpcomingEventsError from "@/components/error-components/UpcomingEventsSlotError"
import UpcomingEventsPW from "@/components/page-wrappers/UpcomingEventsPW"

export default async function UpcomingEventsSlot() {

    const [upcomingEventsResult, categoriesResult] = await Promise.all([
        getUpcomingEvents(),
        getCategories()
    ])


    if (!upcomingEventsResult.success || !upcomingEventsResult.data || !categoriesResult.success || !categoriesResult.data) {
        return <UpcomingEventsError />
    }
    

    return <UpcomingEventsPW initialData={upcomingEventsResult.data} categories={categoriesResult.data} />
}