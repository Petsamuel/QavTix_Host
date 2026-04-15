import { getEvents } from "@/actions/event"
import EventsPageContentWrapper from "@/components/page-wrappers/EventsPageContentWrapper"

export default async function EventsPage() {
    const result = await getEvents()

    const initialEvents = result.success && result.data
        ? {
            results:     result.data.results,
            count:       result.data.count,
            next:        result.data.next,
            previous:    result.data.previous,
            total_pages: result.data.total_pages,
            cards:       result.data.cards,
          }
        : {
            results:     [],
            count:       0,
            next:        null,
            previous:    null,
            total_pages: 1,
            cards:       { live: 0, draft: 0, ended: 0, sold_out: 0 },
          }

    return (
        <EventsPageContentWrapper initialEvents={initialEvents} />
    )
}