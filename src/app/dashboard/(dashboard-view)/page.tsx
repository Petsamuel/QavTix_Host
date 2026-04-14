import { getDashboardOverview } from "@/actions/dashboard"
import DashboardPagePW from "@/components/page-wrappers/DashboardPagePW"

export default async function DashboardPage() {
    const result = await getDashboardOverview()

    if (!result.success || !result.data) {
        throw new Error("Failed to load dashboard")
    }

    return <DashboardPagePW initialData={result.data} />
}