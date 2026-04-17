import { getCategories } from "@/actions/filters";
import CreateEventPageContentWrapper from "@/components/page-wrappers/CreateEventPageContentWrapper";
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.CREATE_EVENT.title,
    description: HOST_PAGE_METADATA.CREATE_EVENT.description,
}

export const dynamic = 'force-dynamic';

export default async function CreateEventPage(){

    const categoryResult = await getCategories()

    if (!categoryResult.success) {
        throw new Error("Failed to load page")
    }

    return (
        <CreateEventPageContentWrapper categories={categoryResult.data} />
    )
}