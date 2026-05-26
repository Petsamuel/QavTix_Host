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
import { FeatureCheckoutProvider, useFeatureCheckout } from "@/contexts/checkout/FeatureCheckoutProvider"
import FeaturedSuccessModal from "@/components/modals/FeaturedSuccessModal"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { cancelEvent, deleteEvent, updateEventStatus } from "@/actions/event/client"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { AnimatedDialog } from "@/components/custom-utils/dialogs/AnimatedDialog"
import { DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export type ItemAction = {
    id: LiveEventActionID | EndedEventActionID | "view-profile"
    label: string
    icon: string
    variant?: 'default' | 'danger'
    onClick?: () => void | Promise<void>
}

interface ItemActionDropdownProps {
    actions: ItemAction[]
    disabled?: boolean
    eventID?: string
    eventName?: string
    onRefresh?: () => void
}

function ItemActionDropdownInner({
    actions,
    disabled = false,
    eventID,
    eventName,
    onRefresh,
}: ItemActionDropdownProps) {
    const dispatch = useAppDispatch()
    const { trigger: triggerRevalidation } = useRevalidate("events")
    const { promoteToFeatured } = useFeatureCheckout()

    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [showShareModal, setShowShareModal] = useState(false)
    const [eventUrl, setEventUrl] = useState("")
    const [openEmail, setOpenEmail] = useState(false)
    const [openDownloadModal, setOpenDownloadModal] = useState(false)
    const [openAddToFeaturedModal, setOpenAddToFeaturedModal] = useState(false)
    const [showCancelModal, setShowCancelModal] = useState(false)

    const handleAction = async (action: ItemAction) => {
        if (loadingAction) return
        setLoadingAction(action.id)

        try {
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
                setShowCancelModal(true)
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

    // Don't close modal here — AddToFeaturedModal stays open during processing
    // context status + closeAddModal controls visibility internally
    const handleFeaturedConfirm = async (planId: string) => {
        if (!eventID) return
        await promoteToFeatured(eventID, planId)
    }

    return (
        <>
            <DropdownMenu open={isOpen} onOpenChange={(v) => {
                !loadingAction && setIsOpen(v)
            }}>
                <DropdownMenuTrigger asChild disabled={disabled} className="p-0">
                    <button
                        className={cn(
                            "px-1 h-fit md:border border-brand-neutral-5 rounded-md transition-colors",
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
                        const isActionLoading = loadingAction === action.id
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

            <ShareEventModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareUrl={eventUrl}
            />

            <EmailTemplateEditor
                open={openEmail && !!eventID}
                setOpen={setOpenEmail}
                eventID={eventID}
                campaignName={eventName}
                mode="campaign"
                onClose={() => setOpenEmail(false)}
            />

            <DownloadAttendeesModal
                isOpen={openDownloadModal}
                onClose={() => setOpenDownloadModal(false)}
            />

            {/* Modal stays open during processing — its internal open prop uses context status */}
            <AddToFeaturedModal
                isOpen={openAddToFeaturedModal}
                onClose={() => setOpenAddToFeaturedModal(false)}
                onConfirm={handleFeaturedConfirm}
            />

            {/* Opens automatically when context status === "success" */}
            <FeaturedSuccessModal
                eventSlug={eventID}
                onClose={() => setOpenAddToFeaturedModal(false)}
            />

            <AnimatedDialog
                open={showCancelModal}
                onOpenChange={setShowCancelModal}
                showCloseButton={false}
                className='md:max-w-sm! py-2'
            >
                <DialogHeader className="text-center flex justify-center items-center">
                    <DialogTitle className="text-lg font-bold text-brand-secondary-9">
                        Cancel Event
                    </DialogTitle>
                    <DialogDescription className="text-sm text-center text-brand-secondary-9">
                        Are you sure you want to cancel &ldquo;{eventName}&rdquo;? This action cannot be undone and attendees will be notified.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-6 justify-center flex-row gap-3 sm:gap-3">
                    <button
                        onClick={() => setShowCancelModal(false)}
                        className="w-full px-6 py-4 text-sm font-medium text-brand-secondary-9 bg-white border-2 border-gray-300 rounded-full hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                        Go back
                    </button>

                    <button
                        onClick={async () => {
                            setShowCancelModal(false)
                            setLoadingAction("cancel")
                            try {
                                const result = await cancelEvent({ eventId: eventID || "" })
                                if (result.success) {
                                    dispatch(showAlert({ title: "Event Cancelled", description: result.message, variant: "success" }))
                                    onRefresh?.()
                                    triggerRevalidation()
                                } else {
                                    dispatch(showAlert({ title: "Cancel Failed", description: result.message, variant: "destructive" }))
                                }
                            } catch (err) {
                                dispatch(showAlert({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }))
                            } finally {
                                setLoadingAction(null)
                            }
                        }}
                        className="w-full px-6 py-4 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        Yes, cancel it
                    </button>
                </DialogFooter>
            </AnimatedDialog>
        </>
    )
}

export default function ItemActionDropdown(props: ItemActionDropdownProps) {
    return (
        <FeatureCheckoutProvider>
            <ItemActionDropdownInner {...props} />
        </FeatureCheckoutProvider>
    )
}