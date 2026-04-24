import { getCheckInMetrics, getCheckInAttendees } from "@/actions/checkin"
import CheckInSystemPageContentWrapper from "@/components/page-wrappers/CheckInSystemPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.CHECK_IN_SYSTEM.title,
    description: HOST_PAGE_METADATA.CHECK_IN_SYSTEM.description,
}

export const dynamic = "force-dynamic"


export default async function CheckInSystemPage() {
    const [metricsResult, attendeesResult] = await Promise.allSettled([
        getCheckInMetrics(),
        getCheckInAttendees(),
    ])

    const metrics = metricsResult.status === "fulfilled" && metricsResult.value.success
        ? metricsResult.value.data!
        : null

    const attendees = attendeesResult.status === "fulfilled" && attendeesResult.value.success
        ? attendeesResult.value.data
        : null

    return (
        <CheckInSystemPageContentWrapper
            initialMetrics={metrics ?? { total_tickets: 0, total_checkins: 0, total_not_checked_in: 0, issues: 0 }}
            initialAttendees={attendees ?? { results: [], count: 0, next: null, previous: null, total_pages: 1 }}
        />
    )
}