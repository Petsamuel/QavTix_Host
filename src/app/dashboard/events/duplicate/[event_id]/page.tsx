import { getEditEventDetails } from "@/actions/event"
import { getCategories } from "@/actions/filters"
import CreateEventPageContentWrapper from "@/components/page-wrappers/CreateEventPageContentWrapper"
import { mapEventToFormData } from "@/helper-fns/mapEventCreateData"
import { notFound } from "next/navigation"

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function EditEventPage({ params }: Props) {

    const { event_id } = await params;

    const [categoryResult, eventResult] = await Promise.all([
        getCategories(),
        getEditEventDetails(event_id),
    ])

    if (!categoryResult.success) throw new Error("Failed to load categories")
    if (!eventResult.success || !eventResult.data) return notFound()
        
    const initialFormData = mapEventToFormData(eventResult.data, categoryResult.data)

    return (
        <CreateEventPageContentWrapper
            categories={categoryResult.data}
            initialData={initialFormData} 
            isDuplicate={true}
            eventID={event_id}
        />
    )
}