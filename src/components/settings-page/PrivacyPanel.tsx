"use client"

import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { useRouter } from "next/navigation"
import { ToggleItem } from "../custom-utils/inputs/CustomToggleItem"
import { openPasswordModal } from "@/lib/redux/slices/passwordModalConfirmationSlice"
import { downloadPrivacyData, updatePrivacySettings } from "@/actions/settings"

interface Props {
    initialSettings: PrivacySettings
}


const PLAN_STATUS_LABEL: Record<string, string> = {
    active: "Active",
    trialing: "Trial",
    cancelled: "Cancelled",
    expired: "Expired",
}

export default function PrivacyPanel({ initialSettings }: Props) {

    const dispatch = useAppDispatch()
    const [anyLoading, setAnyLoading] = useState(false)
    const [isDownloading, setIsDownloading] = useState(false)

    const router = useRouter()

    const { control, getValues } = useForm({
        defaultValues: {
            showMyEvents: initialSettings.show_my_events,
            showPastEvents: initialSettings.show_past_events,
        }
    })

    const save = useCallback(async () => {
        setAnyLoading(true)
        const values = getValues()
        const result = await updatePrivacySettings({
            show_my_events: values.showMyEvents,
            show_past_events: values.showPastEvents,
        })
        setAnyLoading(false)
        router.refresh()

        if (!result.success) {
            dispatch(showAlert({
                variant: "destructive",
                title: "Could not save privacy settings",
                description: result.message ?? "Please try again.",
            }))
        }
    }, [getValues, dispatch])

    const handleDownload = async () => {
        if (isDownloading) return
        setIsDownloading(true)
        const result = await downloadPrivacyData()
        setIsDownloading(false)

        dispatch(showAlert({
            variant: result.success ? "success" : "destructive",
            title: result.success ? "Data request sent" : "Download failed",
            description: result.success
                ? "A copy of your data will be delivered to your email shortly."
                : result.message ?? "Please try again.",
        }))
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    return (
        <main className="w-full pt-8 pb-16">
            <div className="space-y-14">
                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Activity Sharing:</h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Control how your activity is shared and who can see it
                        </p>
                    </header>
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                    <div className="w-full max-w-sm space-y-5">
                        <ToggleItem
                            control={control}
                            name="showMyEvents"
                            label="Show events I’m hosting"
                            disabled={anyLoading}
                            onChange={save}
                        />
                        <ToggleItem
                            control={control}
                            name="showPastEvents"
                            label="Allow people to see my past events"
                            disabled={anyLoading}
                            onChange={save}
                        />
                    </div>
                </section>

                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Download My Data</h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Get a copy of all your data delivered via email
                        </p>
                    </header>
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                    <ActionButton1
                        action={handleDownload}
                        buttonText={isDownloading ? "Requesting..." : "Download Data"}
                        buttonType="button"
                        icon={isDownloading ? "eos-icons:three-dots-loading" : "hugeicons:download-01"}
                        className="h-12! rounded-md font-semibold text-sm!"
                        iconPosition="left"
                        isLoading={isDownloading}
                    />
                </section>

                <section className="space-y-6">
                    <header>
                        <h3 className="text-base font-bold text-brand-secondary-9">Delete My Account</h3>
                        <p className="text-sm text-brand-secondary-9 font-medium">
                            Permanently delete account. This cannot be undone.
                        </p>
                    </header>
                    <div className="w-full border-t-[1.5px] border-dashed border-brand-secondary-2" />
                    <ActionButton1
                        action={() => dispatch(openPasswordModal("delete_account"))}
                        buttonText="Delete Account"
                        buttonType="button"
                        icon="formkit:trash"
                        className="h-12! rounded-md font-semibold text-sm! bg-red-600 active:bg-red-400 focus:ring-2 focus:ring-red-400 focus:outline-0 hover:bg-red-500"
                        iconPosition="left"
                    />
                </section>

            </div>
        </main>
    )
}