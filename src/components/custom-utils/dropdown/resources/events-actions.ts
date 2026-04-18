"use client"

import { EVENT_DETAILS_LINK } from "@/enums/navigation"
import { ItemAction } from "../ItemActionDropdown"

export type LiveEventActionID =
    | "edit"
    | "duplicate"
    | "view"
    | "download"
    | "send-update"
    | "share"
    | "feature"
    | "unpublish"
    | "cancel"
    | "delete"

export type EndedEventActionID =
    | "edit"
    | "download"
    | "send-update"
    | "delete"

export type EventActionId = LiveEventActionID | EndedEventActionID

export function buildLiveEventActions(
    eventID: string,
    isFeatured: boolean,
    router: ReturnType<typeof import("next/navigation").useRouter>
): ItemAction[] {
    const actions = [
        {
            id: "edit" as const,
            label: "Edit Event",
            icon: "hugeicons:pencil-edit-01",
            onClick: () => router.push(EVENT_DETAILS_LINK.replace("[event_id]", eventID)),
        },
        { id: "duplicate" as const, label: "Duplicate Event", icon: "system-uicons:duplicate" },
        {
            id: "view" as const,
            label: "View On Site",
            icon: "uil:search",
            onClick: () => {
                window.open(EVENT_DETAILS_LINK.replace("[event_id]", eventID), "_blank")
            },
        },
        { id: "download" as const, label: "Download Attendee List", icon: "hugeicons:download-01" },
        { id: "send-update" as const, label: "Send Update to Buyers", icon: "lucide:mail" },
        { id: "share" as const, label: "Share Event Link", icon: "mynaui:send-solid" },

        {
            id: "unpublish" as const,
            label: "Unpublish Event",
            icon: "octicon:eye-closed-24",
        }
    ]

    const riskActions = [
        {
            id: "cancel" as const,
            label: "Cancel Event",
            icon: "iconoir:cancel",
            variant: "danger" as const,
        }
    ]

    return !isFeatured ?
     [...actions,
        {
           id: "feature" as "feature",
           label: "Add to Featured",
           icon: "flowbite:rectangle-list-outline",
        },
        ...riskActions
    ]
    :
    [...actions, ...riskActions]
}

export function buildEndedEventActions(
    eventID: string,
    router: ReturnType<typeof import("next/navigation").useRouter>
): ItemAction[] {
    return [
        {
            id: "download" as const,
            label: "Download Attendee List",
            icon: "hugeicons:download-01",
        },
        {
            id: "send-update" as const,
            label: "Send Update to Buyers",
            icon: "lucide:mail",
        },
        {
            id: "delete" as const,
            label: "Delete Event",
            icon: "hugeicons:delete-02",
            variant: "danger" as const,
        },
    ]
}