"use client"

import { EventCreationProvider } from "@/contexts/create-event/CreateEventProvider"
import { StepperProvider } from "@/contexts/create-event/StepperProvider"
import EventCreationLayout from "../create-event/CreateEventLayout"
import { ApiCategory } from "@/actions/filters/index"
import { CompleteEventFormData } from "@/schemas/create-event.schema"

interface Props {
    categories: ApiCategory[]
    initialData?: Partial<CompleteEventFormData>
    eventID?: string
    eventStatus?: 'draft' | 'active' | 'cancelled' | 'completed'
    isDuplicate?: boolean
    plans?: SubscriptionPlan[]
}

export default function CreateEventPageContentWrapper({
    categories,
    initialData,
    eventID,
    eventStatus,
    isDuplicate,
    plans
}: Props) {
    return (
        <EventCreationProvider
            isDuplicate={isDuplicate}
            categories={categories}
            initialData={initialData}
            eventID={eventID}
            eventStatus={eventStatus}
            plans={plans}
        >
            <StepperProvider>
                <EventCreationLayout />
            </StepperProvider>
        </EventCreationProvider>
    )
}