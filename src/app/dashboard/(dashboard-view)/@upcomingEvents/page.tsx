import { getUpcomingEvents } from "@/actions/dashboard"
import UpcomingEventsError from "@/components/error-components/UpcomingEventsSlotError"
import UpcomingEventsPW from "@/components/page-wrappers/UpcomingEventsPW"

export default async function UpcomingEventsSlot() {
    const result = await getUpcomingEvents()

    console.log(result)

    if (!result.success || !result.data) {
        return <UpcomingEventsError />
    }
    

    return <UpcomingEventsPW initialData={result.data} />
}