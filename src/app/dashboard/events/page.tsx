import { getEvents } from "@/actions/event"
import { getCategories } from "@/actions/filters/index"
import EventsPageContentWrapper from "@/components/page-wrappers/EventsPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.MY_EVENTS.title,
    description: HOST_PAGE_METADATA.MY_EVENTS.description,
}


export default async function EventsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const [allRes, liveRes, draftRes, endedRes, cancelledRes, categoryResult] = await Promise.all([
        getEvents(token!),
        getEvents(token!, { status: "active" }),
        getEvents(token!, { status: "draft" }),
        getEvents(token!, { status: "ended" }),
        getEvents(token!, { status: "cancelled" }),
        getCategories()
    ])

    const createInitialSlice = (result: any, defaultCards?: any) => ({
        results: result.success && result.data?.results ? result.data.results : [],
        count: result.success && result.data?.count ? result.data.count : 0,
        next: result.success && result.data?.next !== undefined ? result.data.next : null,
        previous: result.success && result.data?.previous !== undefined ? result.data.previous : null,
        total_pages: result.success && result.data?.total_pages ? result.data.total_pages : 1,
        cards: result.success && result.data?.cards ? result.data.cards : defaultCards,
    })

    const initialEvents = {
        all: createInitialSlice(allRes),
        live: createInitialSlice(liveRes),
        draft: createInitialSlice(draftRes),
        ended: createInitialSlice(endedRes),
        cancelled: createInitialSlice(cancelledRes),
        cards: allRes.success && allRes.data?.cards
            ? allRes.data.cards
            : liveRes.success && liveRes.data?.cards
                ? liveRes.data.cards
                : { live: 0, draft: 0, ended: 0, sold_out: 0, cancelled: 0 },
    }

    return <EventsPageContentWrapper initialEvents={initialEvents} categories={categoryResult.data} />
}