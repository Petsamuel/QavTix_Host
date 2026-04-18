"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { EndedEventActionID, LiveEventActionID } from "./resources/events-actions"
import ShareEventModal from "@/components/modals/ShareEventModal"
import { EVENT_DETAILS_LINK } from "@/enums/navigation"
import EmailTemplateEditor from "../email-template-editor/EmailTemplateEditor"
import DownloadAttendeesModal from "@/components/modals/DownloadAttendeesModal"
import AddToFeaturedModal from "@/components/modals/AddToFeaturedEventsModal"
import { FeatureCheckoutProvider } from "@/contexts/checkout/FeatureCheckoutProvider"
import FeaturedSuccessModal from "@/components/modals/FeaturedSuccessModal"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { cancelEvent, deleteEvent, updateEventStatus } from "@/actions/event"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"

export type ItemAction = {
    id:       LiveEventActionID | EndedEventActionID | "view-profile"
    label:    string
    icon:     string
    variant?: 'default' | 'danger'
    onClick?: () => void | Promise<void>
}

interface ItemActionDropdownProps {
    actions:    ItemAction[]
    disabled?:  boolean
    eventID?:   string
    eventName?: string
    onRefresh?: () => void   // optional — call this after a mutating action
}

export default function ItemActionDropdown({ 
    actions, 
    disabled = false, 
    eventID, 
    eventName,
    onRefresh,
}: ItemActionDropdownProps) {

    const dispatch = useAppDispatch()
    const { trigger: triggerRevalidation } = useRevalidate("events")

    const [loadingAction,          setLoadingAction]          = useState<string | null>(null)
    const [isOpen,                 setIsOpen]                 = useState(false)
    const [showShareModal,         setShowShareModal]         = useState(false)
    const [eventUrl,               setEventUrl]               = useState("")
    const [openEmail,              setOpenEmail]              = useState(false)
    const [openDownloadModal,      setOpenDownloadModal]      = useState(false)
    const [openAddToFeaturedModal, setOpenAddToFeaturedModal] = useState(false)

    const handleAction = async (action: ItemAction) => {
        if (loadingAction) return
        setLoadingAction(action.id)

        try {
            // ── Modal-based actions (open modal, don't close dropdown yet) ──────
            if (action.id === "share") {
                setEventUrl(EVENT_DETAILS_LINK.replace("[event_id]", eventID || ""))
                setShowShareModal(true)
                return
            }

            if (action.id === "send-update") {
                setOpenEmail(true)
                return
            }

            if (action.id === "download") {
                setOpenDownloadModal(true)
                return
            }

            if (action.id === "feature" && eventID) {
                setOpenAddToFeaturedModal(true)
                return
            }

            if (action.id === "cancel" && eventID) {
                const result = await cancelEvent({ eventId: eventID })
                if (result.success) {
                    dispatch(showAlert({ title: "Event Cancelled", description: result.message, variant: "success" }))
                    onRefresh?.()
                    triggerRevalidation()
                } else {
                    dispatch(showAlert({ title: "Cancel Failed", description: result.message, variant: "destructive" }))
                }
                return
            }

            if (action.id === "unpublish" && eventID) {
                const result = await updateEventStatus({ eventId: eventID, status: "draft" })
                if (result.success) {
                    dispatch(showAlert({ title: "Event Unpublished", description: result.message, variant: "success" }))
                    onRefresh?.()
                    triggerRevalidation()
                } else {
                    dispatch(showAlert({ title: "Unpublish Failed", description: result.message, variant: "destructive" }))
                }
                return
            }

            if (action.id === "delete" && eventID) {
                const result = await deleteEvent({ eventId: eventID })
                if (result.success) {
                    dispatch(showAlert({ title: "Event Deleted", description: result.message, variant: "success" }))
                    onRefresh?.()
                    triggerRevalidation()
                } else {
                    dispatch(showAlert({ title: "Delete Failed", description: result.message, variant: "destructive" }))
                }
                return
            }

            await action.onClick?.()

        } catch (err) {
            console.error(`Action "${action.label}" failed:`, err)
            dispatch(showAlert({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }))
        } finally {
            setLoadingAction(null)
            setIsOpen(false)
        }
    }

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={(v) => {
                !loadingAction && setIsOpen(v)
            }}>
                <DropdownMenuTrigger asChild disabled={disabled} className="p-0">
                    <button
                        className={cn(
                            "px-1 h-fit border border-brand-neutral-5 rounded-md transition-colors",
                            disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-brand-neutral-2"
                        )}
                        disabled={disabled}
                    >
                        <Icon icon="tabler:dots" className="size-5 text-brand-secondary-9 hidden md:inline-block" />
                        <Icon icon="ix:context-menu" className="size-5 text-brand-secondary-9 md:hidden" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 text-brand-secondary-9 space-y-1.5">
                    {actions.map((action) => {
                        const isActionLoading  = loadingAction === action.id
                        const isActionDisabled = loadingAction !== null && !isActionLoading

                        return (
                            <DropdownMenuItem
                                key={action.id}
                                asChild
                                onSelect={(e) => e.preventDefault()}
                            >
                                <button
                                    type="button"
                                    disabled={isActionDisabled}
                                    onClick={() => { if (!isActionDisabled) handleAction(action) }}
                                    className={cn(
                                        "w-full text-left flex items-center text-xs gap-2 font-normal cursor-pointer transition-colors px-2 py-1.5 rounded-sm",
                                        "hover:bg-brand-neutral-4 focus:bg-brand-neutral-4 focus:outline-none",
                                        action.variant === 'danger' && "text-red-600 hover:bg-red-50 focus:bg-red-50",
                                        isActionDisabled && "opacity-40 cursor-not-allowed",
                                    )}
                                >
                                    {isActionLoading
                                        ? <Icon icon="eos-icons:three-dots-loading" className="size-4" />
                                        : <Icon icon={action.icon} className="size-4.5" />
                                    }
                                    {action.label}
                                </button>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <ShareEventModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} shareUrl={eventUrl} />
            <EmailTemplateEditor
                open={openEmail && !!eventID}
                setOpen={setOpenEmail}
                eventID={eventID}
                campaignName={eventName}
                mode="campaign"
                onClose={() => setOpenEmail(false)}
            />
            <DownloadAttendeesModal isOpen={openDownloadModal} onClose={() => setOpenDownloadModal(false)} />
            <FeatureCheckoutProvider>
                <AddToFeaturedModal eventId={eventID || ""} isOpen={openAddToFeaturedModal} onClose={() => setOpenAddToFeaturedModal(false)} />
                <FeaturedSuccessModal eventSlug={eventID} onClose={() => setOpenAddToFeaturedModal(false)} />
            </FeatureCheckoutProvider>
        </>
    )
}