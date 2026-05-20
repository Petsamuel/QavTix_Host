import { getCategories } from "@/actions/filters"
import ProfileSettingsContentWrapper from "@/components/page-wrappers/ProfileSettingsContentWrapper"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: "Host Profile | QAVTIX",
    description: "Manage your host profile on QAVTIX",
}

export default async function ProfileSettingsPage() {
    const categoriesResult = await getCategories()

    return (
        <ProfileSettingsContentWrapper
            categories={categoriesResult.success ? categoriesResult.data : []}
        />
    )
}
