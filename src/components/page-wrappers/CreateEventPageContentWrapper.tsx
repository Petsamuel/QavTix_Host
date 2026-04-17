"use client"

import { EventCreationProvider } from "@/contexts/create-event/CreateEventProvider"
import { StepperProvider } from "@/contexts/create-event/StepperProvider"
import EventCreationLayout from "../create-event/CreateEventLayout"
import { ApiCategory } from "@/actions/filters"
import { CompleteEventFormData } from "@/schemas/create-event.schema"

interface Props {
    categories:   ApiCategory[]
    initialData?: Partial<CompleteEventFormData>
    eventID?:     string 
}

export default function CreateEventPageContentWrapper({
    categories,
    initialData,
    eventID,
}: Props) {
    return (
        <EventCreationProvider categories={categories} initialData={initialData} eventID={eventID}>
        <StepperProvider>
                <EventCreationLayout />
            </StepperProvider>
        </EventCreationProvider>
    )
}