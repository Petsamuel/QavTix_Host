'use client'

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { getAttendeesExport } from "@/actions/customers/client"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { space_grotesk } from "@/lib/fonts"
import { useRouter } from "next/navigation"
import { NAVIGATION_LINKS, SETTINGS_SUB_LINKS } from "@/enums/navigation"
import { DialogDescription, DialogTitle } from "../ui/dialog"

interface DownloadAttendeesModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function DownloadAttendeesModal({
    isOpen,
    onClose,
}: DownloadAttendeesModalProps) {

    const { user } = useAppSelector(store => store.authUser)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const [isDownloading, setIsDownloading] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)

        const result = await getAttendeesExport()

        if (!result.success || !result.blob) {
            dispatch(showAlert({
                variant: "destructive",
                title: "Download Failed",
                description: result.message || "Could not generate the file"
            }))
            setIsDownloading(false)
            return
        }

        try {
            const url = URL.createObjectURL(result.blob)
            const link = document.createElement("a")
            const timestamp = new Date().toISOString().split('T')[0]

            link.href = url
            link.download = `QavTix_Attendees_${timestamp}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up
            URL.revokeObjectURL(url)

            dispatch(showAlert({
                variant: "success",
                title: "Success",
                description: "Attendee list downloaded successfully"
            }))

            onClose()

        } catch (error) {
            dispatch(showAlert({
                variant: "destructive",
                title: "Error",
                description: "Failed to process the downloaded file"
            }))
        }

        setIsDownloading(false)
    }

    return (
        <AnimatedDialog 
            open={isOpen} 
            onOpenChange={() => !isDownloading ? onClose() : undefined} 
            className="md:max-w-[26em] p-0 overflow-hidden"
        >
            <div className="p-4 pb-0 text-center">
                <div className="size-14 bg-brand-primary-1 text-brand-primary-6 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon icon="hugeicons:document-attachment" className="size-7" />
                </div>
                <DialogTitle className={cn(space_grotesk.className, "text-lg font-bold text-brand-neutral-8")}>
                    Download Attendees
                </DialogTitle>
                <DialogDescription className="text-xs text-brand-neutral-7 mt-1.5 DialogDescriptionx-4 leading-relaxed">
                    Export your attendee list as a CSV. Your download capacity depends on your active subscription plan.
                </DialogDescription>
            </div>

            <div className="p-6 space-y-2">
                {[
                    { name: 'Free', limit: '250', type: 'free' },
                    { name: 'Pro', limit: '1,000', type: 'pro' },
                    { name: 'Enterprise', limit: 'Unlimited', type: 'enterprise' },
                ].map((plan) => {
                    const isCurrent = user?.plan_type === plan.type
                    return (
                        <div 
                            key={plan.name}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all",
                                isCurrent 
                                    ? "bg-brand-primary-1/40 border-brand-primary-2 ring-1 ring-brand-primary-2" 
                                    : "bg-brand-neutral-1 border-brand-neutral-2 opacity-50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "size-2 rounded-full",
                                    isCurrent ? "bg-brand-primary-6" : "bg-brand-neutral-4"
                                )} />
                                <span className={cn(
                                    "text-sm font-medium",
                                    isCurrent ? "text-brand-primary-7" : "text-brand-secondary-8"
                                )}>
                                    {plan.name}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className={cn(
                                    "text-[13px] font-medium",
                                    isCurrent ? "text-brand-primary-7" : "text-brand-neutral-8"
                                )}>
                                    {plan.limit}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider text-brand-neutral-8 font-medium">
                                    Records
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="p-6 pt-2 bg-brand-neutral-1/50 border-t border-brand-neutral-2 flex flex-col gap-3">
                <ActionButton1 
                    buttonText={isDownloading ? "Generating CSV..." : "Download List"}
                    action={handleDownload}
                    isLoading={isDownloading}
                    icon="solar:cloud-download-bold"
                    iconPosition="left"
                    className="w-full shadow-lg shadow-brand-primary/20"
                />
                
                {user?.plan_type !== 'enterprise' && (
                    <button 
                        onClick={() => router.push(
                            SETTINGS_SUB_LINKS.find(v => v.href.includes("subscription"))?.href || 
                            NAVIGATION_LINKS.SETTINGS.href
                        )} 
                        className="py-1 text-[11px] font-semibold text-brand-primary-6 hover:text-brand-primary-7 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wide"
                    >
                        <Icon icon="solar:crown-minimalistic-bold-duotone" className="size-3.5" />
                        Upgrade for unlimited access
                    </button>
                )}
            </div>
        </AnimatedDialog>
    )
}