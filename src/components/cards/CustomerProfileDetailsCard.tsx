import { cn } from "@/lib/utils"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import { Button } from "../ui/button"
import { Icon } from "@iconify/react"
import { formatDateTime } from "@/helper-fns/date-utils"
import { useState } from "react"
import EmailTemplateEditor from "../custom-utils/email-template-editor/EmailTemplateEditor"
import SmsEditor from "../custom-utils/email-template-editor/SmsEditor"

interface CustomerProfileDetailsCardProps {
    customer:     CustomerProfile
    className?:   string
}

export function CustomerProfileDetailsCard({
    customer,
    className,
}: CustomerProfileDetailsCardProps) {

    const address = [customer.city, customer.state, customer.country]
        .filter(Boolean)
        .join(", ")

    const [showEmailEditor, setShowEmailEditor] = useState(false)
    const [showSmsEditor,   setShowSmsEditor]   = useState(false)

    const handleEmail = () => setShowEmailEditor(true)
    const handleSMS   = () => {
        if (!customer.phone_number) return
        setShowSmsEditor(true)
    }

    return (
        <>
            <div className={cn(
                "bg-white rounded-2xl h-full shadow-[0px_5.8px_23.17px_0px_#3326AE14] border border-brand-neutral-2 p-6",
                className
            )}>
                <div className="flex flex-col items-center text-center mb-6">
                    <CustomAvatar
                        name={customer.full_name}
                        profileImg={customer.profile_picture ?? undefined}
                        id={String(customer.user_id)}
                        size="size-16"
                    />
                    <h3 className="text-[13px] font-bold text-brand-secondary-9 mb-1">
                        {customer.full_name}
                    </h3>
                    <p className="text-[13px] text-brand-neutral-7">
                        {customer.email}
                    </p>
                </div>

                <div className="flex gap-3 mb-6">
                    <Button
                        onClick={handleEmail}
                        className="flex-1 bg-brand-primary-6 hover:bg-brand-primary-7 text-white text-xs rounded-lg h-11 font-medium"
                    >
                        <Icon icon="clarity:email-line" width="20" height="20" />
                        Send Email
                    </Button>
                    <Button
                        onClick={handleSMS}
                        className="flex-1 bg-brand-primary-4 text-white hover:bg-brand-primary-5 text-xs rounded-lg h-11 font-medium"
                    >
                        <Icon icon="tabler:message" width="20" height="20" />
                        Send SMS
                    </Button>
                </div>

                <div className="space-y-4">
                    {/* Address */}
                    <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-brand-neutral-2 flex items-center justify-center shrink-0">
                            <Icon icon="lucide:map-pin" className="w-5 h-5 text-[#C8CAD8]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] font-semibold text-brand-secondary-9 mb-1">Address</p>
                            <p className="text-xs text-brand-neutral-7 leading-relaxed">
                                {address || "—"}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    {customer.phone_number && (
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-brand-neutral-2 flex items-center justify-center shrink-0">
                                <Icon icon="lucide:phone" className="w-5 h-5 text-[#C8CAD8]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[13px] font-semibold text-brand-secondary-9 mb-1">Phone</p>
                                <p className="text-xs text-brand-neutral-7">{customer.phone_number}</p>
                            </div>
                        </div>
                    )}

                    {/* First Purchase */}
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-neutral-2 flex items-center justify-center shrink-0">
                            <Icon icon="mdi:calendar" className="w-5 h-5 text-[#C8CAD8]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] font-semibold text-brand-secondary-9 mb-1">First Purchase</p>
                            <p className="text-xs text-brand-neutral-7">
                                {formatDateTime(customer.first_purchase_date)}
                            </p>
                        </div>
                    </div>

                    {/* Latest Purchase */}
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-neutral-2 flex items-center justify-center shrink-0">
                            <Icon icon="mdi:calendar-check" className="w-5 h-5 text-[#C8CAD8]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] font-semibold text-brand-secondary-9 mb-1">Latest Purchase</p>
                            <p className="text-xs text-brand-neutral-6">
                                {formatDateTime(customer.last_purchase_date)}
                            </p>
                        </div>
                    </div>

                    {/* Registered */}
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-neutral-2 flex items-center justify-center shrink-0">
                            <Icon icon="lucide:user-check" className="w-5 h-5 text-[#C8CAD8]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] font-semibold text-brand-secondary-9 mb-1">Member Since</p>
                            <p className="text-xs text-brand-neutral-6">
                                {formatDateTime(customer.registration_date)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <EmailTemplateEditor
                open={showEmailEditor}
                setOpen={setShowEmailEditor}
                mode="single"
                recipientEmail={customer.email}
                recipientName={customer.full_name}
            />

            <SmsEditor
                open={showSmsEditor}
                setOpen={setShowSmsEditor}
                recipientPhone={customer.phone_number ?? ""}
                recipientName={customer.full_name}
            />
        </>
    )
}