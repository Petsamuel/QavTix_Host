import { getCheckInMetrics, getCheckInAttendees } from "@/actions/checkin"
import CheckInSystemPageContentWrapper from "@/components/page-wrappers/CheckInSystemPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.CHECK_IN_SYSTEM.title,
    description: HOST_PAGE_METADATA.CHECK_IN_SYSTEM.description,
}


export default async function CheckInSystemPage() {
    const [metricsResult, attendeesResult] = await Promise.all([
        getCheckInMetrics(),
        getCheckInAttendees(),
    ])

    if (!metricsResult.success) {
        throw new Error(metricsResult.message || "Failed to load check-in data.")
    }

    return (
        <CheckInSystemPageContentWrapper
            initialMetrics={metricsResult.data!}
            initialAttendees={attendeesResult.data ?? {
                results: [], count: 0, next: null, previous: null, total_pages: 1
            }}
        />
    )
}