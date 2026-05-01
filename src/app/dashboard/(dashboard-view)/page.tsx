import { cookies } from "next/headers"
import DashboardPagePW from "@/components/page-wrappers/DashboardPagePW"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { getDashboardOverview } from "@/actions/dashboard"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.DASHBOARD.title,
    description: HOST_PAGE_METADATA.DASHBOARD.description,
}



export default async function DashboardPage() {
    const cookieStore = await cookies()
    const token = cookieStore.get("host_access_token")?.value
    const result = await getDashboardOverview(token!)

    if (!result.success || !result.data) {
        throw new Error("Failed to load dashboard")
    }

    return <DashboardPagePW initialData={result.data} />
}