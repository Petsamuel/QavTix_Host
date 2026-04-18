"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { sendSingleSms } from "@/actions/campaigns"

const MAX_SMS_LENGTH = 160

interface SmsEditorProps {
    open:            boolean
    setOpen:         (open: boolean) => void
    recipientPhone?: string
    recipientName?:  string
}

export default function SmsEditor({
    open,
    setOpen,
    recipientPhone = "",
    recipientName  = "",
}: SmsEditorProps) {

    const dispatch = useAppDispatch()
    const { user } = useAppSelector(store => store.authUser)

    const [phone,     setPhone]     = useState(recipientPhone)
    const [message,   setMessage]   = useState("")
    const [isSending, setIsSending] = useState(false)

    const charsLeft = MAX_SMS_LENGTH - message.length
    const smsCount  = Math.ceil(message.length / MAX_SMS_LENGTH) || 1

    const handleClose = () => {
        setPhone(recipientPhone)
        setMessage("")
        setOpen(false)
    }

    const handleSend = async () => {
        if (!phone.trim()) {
            dispatch(showAlert({ variant: "destructive", title: "Missing phone", description: "Please enter a recipient phone number." }))
            return
        }
        if (!message.trim()) {
            dispatch(showAlert({ variant: "destructive", title: "Empty message", description: "Please write your message." }))
            return
        }

        setIsSending(true)

        const result = await sendSingleSms({
            recipient_phone: phone,
            message:         message.trim(),
            sender_name:     user?.business_name ?? user?.full_name ?? "Host",
        })

        setIsSending(false)

        if (result.success) {
            handleClose()
            dispatch(openSuccessModal({
                title:       "SMS Sent!",
                description: result.message ?? "Your message has been delivered.",
                variant:     "success",
                autoClose:   true,
            }))
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Failed to send SMS",
                description: result.message ?? "Something went wrong. Please try again.",
            }))
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent showCloseButton={false} className={cn(
                    "max-w-md p-0 overflow-hidden border-none gap-0 flex flex-col",
                    // Open animation
                    "data-[state=open]:animate-in",
                    "data-[state=open]:fade-in-0",
                    "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "data-[state=open]:zoom-in-90",
                    "data-[state=open]:slide-in-from-top-4",
                    // Close animation
                    "data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0",
                    "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
                    "data-[state=closed]:zoom-out-90",
                    "data-[state=closed]:slide-out-to-top-4"
                )}
                >

                {/* Header */}
                <div className="bg-brand-secondary-9 h-12 flex items-center justify-between px-4 text-white shrink-0">
                    <DialogTitle className="text-sm font-medium">New SMS</DialogTitle>
                    <button onClick={handleClose} className="hover:bg-white/10 p-1 rounded transition-colors">
                        <Icon icon="hugeicons:cancel-01" width="20" height="20" />
                    </button>
                </div>

                <div className="flex flex-col bg-white p-4 gap-4">

                    {/* Recipient */}
                    <div className="flex items-center gap-3 border-b pb-3">
                        <Icon icon="lucide:phone" className="w-4 h-4 text-brand-neutral-6 shrink-0" />
                        <div className="flex-1">
                            <label className="text-[11px] text-brand-neutral-6 mb-0.5 block">To</label>
                            <input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="+234 800 000 0000"
                                className="w-full outline-none text-sm text-brand-secondary-9"
                            />
                        </div>
                    </div>

                    {/* Sender info */}
                    <div className="flex items-center gap-3 border-b pb-3">
                        <Icon icon="lucide:user" className="w-4 h-4 text-brand-neutral-6 shrink-0" />
                        <div>
                            <p className="text-[11px] text-brand-neutral-6">From</p>
                            <p className="text-sm text-brand-secondary-6">
                                {user?.business_name ?? user?.full_name ?? "—"}
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="text-[11px] text-brand-neutral-6 mb-2 block">Message</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Write your SMS message..."
                            maxLength={MAX_SMS_LENGTH * 3}  // allow multi-part SMS
                            rows={6}
                            className={cn(
                                "w-full outline-none text-sm text-brand-secondary-9 resize-none",
                                "border border-brand-neutral-3 rounded-lg p-3",
                                "focus:border-brand-primary-5 transition-colors",
                                message.length > MAX_SMS_LENGTH && "border-amber-400"
                            )}
                        />
                        {/* Character counter */}
                        <div className="flex items-center justify-between mt-1.5">
                            <span className={cn(
                                "text-[11px]",
                                charsLeft < 0    ? "text-amber-500" :
                                charsLeft < 20   ? "text-amber-400" : "text-brand-neutral-6"
                            )}>
                                {message.length > MAX_SMS_LENGTH
                                    ? `${smsCount} SMS parts · ${Math.abs(charsLeft)} chars over limit`
                                    : `${charsLeft} chars remaining`
                                }
                            </span>
                            {message.length > MAX_SMS_LENGTH && (
                                <span className="text-[11px] text-amber-500 flex items-center gap-1">
                                    <Icon icon="lucide:alert-triangle" className="w-3 h-3" />
                                    Will be sent as {smsCount} SMS
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-2">
                        <button
                            onClick={handleSend}
                            disabled={isSending || !message.trim() || !phone.trim()}
                            className="flex-1 bg-brand-primary-6 text-white py-3 rounded-lg font-semibold text-sm hover:bg-brand-primary-7 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSending ? (
                                <>
                                    <Icon icon="svg-spinners:ring-resize" className="w-4 h-4" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Icon icon="tabler:message" className="w-4 h-4" />
                                    Send SMS
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={isSending}
                            className="p-3 border border-brand-neutral-3 rounded-lg hover:bg-red-50 transition-colors group"
                        >
                            <Icon icon="hugeicons:delete-02" className="w-5 h-5 text-red-400 group-hover:text-red-600" />
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}