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
import { saveEventAsDraft, updateEventAsDraft } from "@/actions/event/creation"


export default function SaveAsDraftBtn() {

    const { eventData, isEditMode, eventID } = useEventCreation()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { trigger } = useRevalidate("events")
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        if (saving) return
        setSaving(true)
        try {
            const media = await uploadEventMedia(eventData.detailsMedia)
            const sanitizedEventData = sanitizeEventDataForServer(eventData, media)
            
            const result = isEditMode && eventID
                ? await updateEventAsDraft({ eventId: eventID, eventData: sanitizedEventData, media })
                : await saveEventAsDraft({ eventData: sanitizedEventData, media })

            if (result.success) {
                dispatch(showAlert({
                    title: isEditMode ? "Changes Saved" : "Draft Saved",
                    description: isEditMode ? "Your event changes have been saved." : "Your event progress has been saved.",
                    variant: "success",
                }))
                trigger()
                router.push(NAVIGATION_LINKS.MY_EVENTS.href)
            } else {
                dispatch(showAlert({
                    title: "Save Failed",
                    description: result.message ?? "Could not save your draft. Please try again.",
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
            aria-label={saving ? "Saving draft..." : "Save as Draft"}
            data-testid="btn-save-as-draft"
        >
            <span className="size-9 md:size-7 rounded-sm flex justify-center items-center bg-brand-primary-4 text-white shrink-0">
                {saving
                    ? <Icon icon="lucide:loader-2" className="size-6 animate-spin" />
                    : <Icon icon="ri:draft-line" className="size-4" />
                }
            </span>
            <span className="hidden md:inline">
                {saving ? "Saving..." : "Save as Draft"}
            </span>
        </button>
    )
}