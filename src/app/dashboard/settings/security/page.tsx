import SecurityPageClient from "@/components/settings-page/SecurityPageClient"
import { hostSiteMetadata, HOST_PAGE_METADATA } from "@/lib/metadata/index"
import { Metadata } from "next"

export const metadata: Metadata = {
    ...hostSiteMetadata,
    title: HOST_PAGE_METADATA.SECURITY.title,
    description: HOST_PAGE_METADATA.SECURITY.description,
}

export default function SecurityPage(){
    return <SecurityPageClient />
}