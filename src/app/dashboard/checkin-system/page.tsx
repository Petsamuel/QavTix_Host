import { getCheckInMetrics, getCheckInAttendees } from "@/actions/checkin"
import { getHostProfile } from "@/actions/auth"
import GatedPageModal from "@/components/modals/GatedPageModal"
import CheckInSystemPageContentWrapper from "@/components/page-wrappers/CheckInSystemPageContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.CHECK_IN_SYSTEM.title,
    description: HOST_PAGE_METADATA.CHECK_IN_SYSTEM.description,
}




export default async function CheckInSystemPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;
    const [profileResult, metricsResult, attendeesResult] = await Promise.allSettled([
        getHostProfile(token),
        getCheckInMetrics(token),
        getCheckInAttendees(token),
    ])

    const profile = profileResult.status === "fulfilled" ? profileResult.value : null

    if (!profile?.verified) {
        return <GatedPageModal type="verification" />
    }

    if (profile.plan_type !== "pro" && profile.plan_type !== "enterprise") {
        return <GatedPageModal type="plan" featureName="QR Check-in" requiredPlan="Pro" />
    }

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