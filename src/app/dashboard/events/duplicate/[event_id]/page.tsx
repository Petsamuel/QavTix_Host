import { getEditEventDetails } from "@/actions/event/client"
import { getCategories } from "@/actions/filters/index"
import { getPlans } from "@/actions/settings/index"
import CreateEventPageContentWrapper from "@/components/page-wrappers/CreateEventPageContentWrapper"
import { mapEventToFormData } from "@/helper-fns/mapEventCreateData"
import { notFound } from "next/navigation"
import { cookies } from "next/headers";

interface Props {
    params: Promise<{ event_id: string }>
}

export default async function DuplicateEventPage({ params }: Props) {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;

    const { event_id } = await params;

    const [categoryResult, eventResult, plansResult] = await Promise.all([
        getCategories(),
        getEditEventDetails(event_id),
        getPlans()
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
            plans={plansResult.data}
        />
    )
}