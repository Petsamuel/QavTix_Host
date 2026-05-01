"use client"

import { FormEvent, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import { cn } from "@/lib/utils"
import { closePasswordModal, resetPasswordStatus, setPasswordStatus } from "@/lib/redux/slices/passwordModalConfirmationSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { usePathname } from "next/navigation"
import { Icon } from "@iconify/react"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"
import { logOut, verifyPassword } from "@/actions/auth/client"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { cancelSubscription, deleteAccount } from "@/actions/settings/client"


export default function PasswordModal() {

    const dispatch    = useAppDispatch()
    const pathName    = usePathname()

    const [password,      setPassword]      = useState("")
    const [showPassword,  setShowPassword]  = useState(false)
    const [isProcessing,  setIsProcessing]  = useState(false)
    const [errorMessage,  setErrorMessage]  = useState("")

    const { isOpen, status, actionType } = useAppSelector(state => state.passwordModal)
    const { user } = useAppSelector(state => state.authUser)

    const closeAndReset = () => {
        dispatch(closePasswordModal())
        dispatch(resetPasswordStatus())
        setPassword("")
        setErrorMessage("")
    }

    // Close on route change
    useEffect(() => {
        if (isOpen) closeAndReset()
    }, [pathName])

    const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!password || !user?.email) return

        setIsProcessing(true)
        setErrorMessage("")
        dispatch(setPasswordStatus("submitting"))

        const verifyResult = await verifyPassword(user.email, password)

        if (!verifyResult.success) {
            dispatch(setPasswordStatus("error"))
            setErrorMessage(verifyResult.message ?? "Incorrect password. Please try again.")
            setIsProcessing(false)
            return
        }

        if (actionType === "delete_account") {
            const deleteResult = await deleteAccount()

            if (deleteResult.success) {
                closeAndReset()
                dispatch(openSuccessModal({
                    title:          "Deletion Complete",
                    description:    "Your account has been permanently removed. Thank you for being with us.",
                    variant:        "account_deleted",
                }))
                setTimeout(async () => {
                    await logOut()
                }, 3200)
            } else {
                dispatch(showAlert({
                    title:       "Deletion Failed",
                    description: deleteResult.message ?? "An error occurred while deleting your account. Please try again.",
                    variant:     "destructive",
                }))
                setIsProcessing(false)
            }
        }

        else if (actionType === "cancel_plan") {
            const cancelResult = await cancelSubscription()

            if (cancelResult.success) {
                closeAndReset()
                dispatch(openSuccessModal({
                    title:       "Plan Cancelled",
                    description: "Your subscription has been cancelled. You'll retain access until the end of your billing period.",
                    variant:     "success",
                }))
            } else {
                dispatch(showAlert({
                    title:       "Cancellation Failed",
                    description: cancelResult.message ?? "An error occurred while cancelling your plan. Please try again.",
                    variant:     "destructive",
                }))
                setIsProcessing(false)
            }
        }

        else {
            console.warn("[PasswordModal] Unknown actionType:", actionType)
            setIsProcessing(false)
        }

        window.location.reload()
    }

    return (
        <AnimatedDialog
            open={isOpen}
            onOpenChange={closeAndReset}
            showCloseButton={false}
            className="md:max-w-sm py-4"
        >
            <DialogHeader className="flex flex-col items-center justify-center text-center mb-6">
                <DialogTitle className="text-xl font-bold text-brand-secondary-9">
                    Enter Password
                </DialogTitle>
                <DialogDescription className="text-sm text-brand-secondary-5">
                    Enter your password to confirm
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirm}>
                <div className="mt-6 px-1">
                    <label className="block text-sm font-semibold text-brand-neutral-9 mb-2">
                        Password
                    </label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className={cn(
                                "w-full h-12 px-4 rounded-md border-[1.4px] transition-all outline-none",
                                "border-brand-primary-4 bg-brand-secondary-1 focus:border-brand-primary-6 focus:bg-white",
                                status === "error" && "border-red-500"
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-secondary-4 hover:text-brand-secondary-9 transition-colors"
                        >
                            <Icon icon={showPassword ? "hugeicons:view-off-slash" : "hugeicons:view"} width="20" />
                        </button>
                    </div>
                    {status === "error" && errorMessage && (
                        <p className="text-xs text-red-500 mt-2 text-center">{errorMessage}</p>
                    )}
                </div>

                <DialogFooter className="mt-8 flex flex-row gap-3">
                    <button
                        type="button"
                        disabled={isProcessing}
                        onClick={closeAndReset}
                        className="flex-1 h-12 md:h-14 rounded-full border border-brand-secondary-6 text-brand-secondary-8 font-semibold text-sm hover:bg-brand-neutral-3 transition-all disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <ActionButton1
                        buttonText="Confirm"
                        buttonType="submit"
                        isDisabled={!password}
                        isLoading={isProcessing}
                        className="w-[55%] text-sm!"
                    />
                </DialogFooter>
            </form>
        </AnimatedDialog>
    )
}