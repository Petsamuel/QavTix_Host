"use client"

import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { useEventCreation } from "@/contexts/create-event/CreateEventProvider"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { useRouter } from "next/navigation"
import { NAVIGATION_LINKS } from "@/enums/navigation"
import { uploadEventMedia } from "@/helper-fns/uploadEventMedia"
import { sanitizeEventDataForServer } from "@/lib/cloudinary"
import { saveEventAsDraft, updateEventAsDraft, updateAndPublishEvent } from "@/actions/event/creation"
import { clearEventDraft } from "@/custom-hooks/UseEventDraftPersist"
import { EVENT_DETAILS_LINK } from "@/enums/navigation"


export default function SaveAsDraftBtn() {

    const { eventData, isEditMode, eventID, eventStatus, discardDraft } = useEventCreation()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { trigger } = useRevalidate("events")
    const [saving, setSaving] = useState(false)

    const isLive = eventStatus === 'active' || eventStatus === 'completed'

    const handleSave = async () => {
        if (saving) return

        const bInfo = eventData.basicInformation
        const dMedia = eventData.detailsMedia
        const missingFields: string[] = []

        if (!bInfo?.eventTitle?.trim()) missingFields.push("Event Title")
        if (bInfo?.eventType === "single") {
            if (!bInfo?.startDateTime) missingFields.push("Start Date")
            if (!bInfo?.endDateTime) missingFields.push("End Date")
        } else if (bInfo?.eventType === "recurring") {
            if (!bInfo?.dates?.length) missingFields.push("Recurring Dates")
        } else {
            missingFields.push("Event Type")
            missingFields.push("Start/End Date")
        }

        if (bInfo?.locationType === "physical") {
            if (!bInfo?.venueName || !bInfo?.address || !bInfo?.city || !bInfo?.country) {
                missingFields.push("Physical Location Details")
            }
        } else if (bInfo?.locationType === "online") {
            if (!bInfo?.onlineLink) missingFields.push("Online Event Link")
        } else if (!bInfo?.locationType && bInfo?.locationType !== "tba") {
            missingFields.push("Location Type")
        }

        if (!dMedia?.shortDescription?.trim()) missingFields.push("Short Description")
        if (!dMedia?.fullDescription?.trim()) missingFields.push("Full Description")
        if (!dMedia?.organizerDisplayName?.trim()) missingFields.push("Organiser Name")
        if (!dMedia?.publicEmail?.trim()) missingFields.push("Public Email")

        if (missingFields.length > 0) {
            dispatch(showAlert({
                title: "Incomplete Draft Details",
                description: `Please fill in the following required fields to save a draft: ${missingFields.join(", ")}`,
                variant: "warning",
            }))
            return
        }

        setSaving(true)
        try {
            const media = await uploadEventMedia(eventData.detailsMedia)
            const sanitizedEventData = sanitizeEventDataForServer(eventData, media)
            
            let result;
            if (isEditMode && eventID) {
                if (isLive) {
                    result = await updateAndPublishEvent({ eventId: eventID, eventData: sanitizedEventData, media })
                } else {
                    result = await updateEventAsDraft({ eventId: eventID, eventData: sanitizedEventData, media })
                }
            } else {
                result = await saveEventAsDraft({ eventData: sanitizedEventData, media })
            }

            if (result.success) {
                dispatch(showAlert({
                    title: isEditMode ? "Changes Saved" : "Draft Saved",
                    description: isEditMode ? "Your event changes have been saved." : "Your event progress has been saved.",
                    variant: "success",
                }))
                clearEventDraft()
                trigger()
                if (isEditMode && isLive && eventID) {
                    router.push(EVENT_DETAILS_LINK.replace("[event_id]", String(eventID)))
                } else {
                    router.push(NAVIGATION_LINKS.MY_EVENTS.href)
                }
            } else {
                dispatch(showAlert({
                    title: "Save Failed",
                    description: result.message ?? "Could not save your changes. Please try again.",
                    variant: "destructive",
                }))
            }
        } catch {
            dispatch(showAlert({
                title: "Save Failed",
                description: "An unexpected error occurred.",
                variant: "destructive",
            }))
        } finally {
            setSaving(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={cn(
                "md:bg-brand-primary-1 text-brand-primary-6 md:p-2 font-bold text-sm mx-1 flex rounded-md md:rounded-sm gap-1 items-center",
                "hover:bg-brand-primary-2 hover:scale-105 transition-all ease-in-out duration-200",
                "disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            )}
            aria-label={saving ? "Saving..." : (isEditMode && isLive) ? "Save Changes" : "Save as Draft"}
            data-testid="btn-save-as-draft"
        >
            <span className="size-9 md:size-7 rounded-sm flex justify-center items-center bg-brand-primary-4 text-white shrink-0">
                {saving
                    ? <Icon icon="lucide:loader-2" className="size-6 animate-spin" />
                    : <Icon icon="ri:draft-line" className="size-4" />
                }
            </span>
            <span className="hidden md:inline">
                {saving ? "Saving..." : (isEditMode && isLive) ? "Save Changes" : "Save as Draft"}
            </span>
        </button>
    )
}