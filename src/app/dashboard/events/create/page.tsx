import { getCategories } from "@/actions/filters/index";
import { getPlans } from "@/actions/settings/index";
import CreateEventPageContentWrapper from "@/components/page-wrappers/CreateEventPageContentWrapper";
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"
import { cookies } from "next/headers";

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.CREATE_EVENT.title,
    description: HOST_PAGE_METADATA.CREATE_EVENT.description,
}


export default async function CreateEventPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;

    const [categoryResult, plansResult] = await Promise.all([
        getCategories(),
        getPlans()
    ])

    if (!categoryResult.success) {
        throw new Error("Failed to load page")
    }

    return (
        <CreateEventPageContentWrapper 
            categories={categoryResult.data} 
            plans={plansResult.data}
        />
    )
}