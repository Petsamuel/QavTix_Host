import { getEditEventDetails } from "@/actions/event"
import { getCategories } from "@/actions/filters"
import CreateEventPageContentWrapper from "@/components/page-wrappers/CreateEventPageContentWrapper"
import { mapEventToFormData } from "@/helper-fns/mapEventCreateData"
import { notFound } from "next/navigation"
import { cookies } from "next/headers";

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EditEventPage({ params }: Props) {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;

    const { event_id } = await params;

    const [categoryResult, eventResult] = await Promise.all([
        getCategories(token),
        getEditEventDetails(token, event_id),
    ])

    if (!categoryResult.success) throw new Error("Failed to load categories")
    if (!eventResult.success || !eventResult.data) return notFound()
        
    const initialFormData = mapEventToFormData(eventResult.data, categoryResult.data)

    return (
        <CreateEventPageContentWrapper
            categories={categoryResult.data}
            initialData={initialFormData} 
            eventID={event_id}
        />
    )
}