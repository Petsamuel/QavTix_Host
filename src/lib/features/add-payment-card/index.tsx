"use client"

import { useState, useCallback } from "react"
import { Icon } from "@iconify/react"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AnimatedDialog } from "@/components/custom-utils/dialogs/AnimatedDialog"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { cn } from "@/lib/utils"
import { extractAccessCode } from "@/helper-fns/extractAccessCode"
import { addPaymentMethod, verifyPaymentMethod } from "@/actions/payment"
import { tick } from "@/helper-fns/tick"
import { resolveCountryCode } from "@/helper-fns/resolveCountryCode"
import Image from "next/image"
import { useRouter } from "next/navigation"

type FlowStatus = "idle" | "loading" | "verifying" | "success" | "error"

const STEPS = [
    "Initialising secure session…",
    "Connecting to payment provider…",
    "Launching card setup…",
    "Verifying your card…",
]

interface Props {
    onSuccess?: () => void
}

export default function AddPaymentCardModal({ onSuccess }: Props = {}) {

    const dispatch = useAppDispatch()
    const user = useAppSelector(state => state.authUser.user)
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState<FlowStatus>("idle")
    const [stepIndex, setStepIndex] = useState(0)
    const [errorMsg, setErrorMsg] = useState("")

    const openFresh = () => {
        setStatus("idle")
        setStepIndex(0)
        setErrorMsg("")
        setOpen(true)
    }

    const handleProceed = useCallback(async () => {
        setStatus("loading")
        setStepIndex(0)

        try {
            await tick(); setStepIndex(1)

            const init = await addPaymentMethod(resolveCountryCode(user?.country || "") ?? "NG")

            if (!init.success || !init.checkout_url) {
                throw new Error(init.message ?? "Could not generate card setup link.")
            }

            setStepIndex(2)
            await tick()

            const PaystackPop = (await import("@paystack/inline-js")).default
            const handler = new PaystackPop()
            const accessCode = extractAccessCode(init.checkout_url)

            // Close dialog BEFORE Paystack mounts — removes Radix body pointer-events lock
            setOpen(false)

            handler.resumeTransaction(accessCode, {

                onSuccess: async (transaction: { reference: string }) => {
                    // Set state before reopening — no reset effect to race against
                    setStepIndex(3)
                    setStatus("verifying")
                    setOpen(true)

                    const verify = await verifyPaymentMethod({
                        reference: transaction.reference,
                        country: user?.country ?? "NG",
                        save_card: false,
                    })

                    if (!verify.success) {
                        setStatus("error")
                        setErrorMsg(verify.message ?? "Card verification failed. Please try again.")
                        dispatch(showAlert({
                            variant: "destructive",
                            title: "Verification Failed",
                            description: verify.message ?? "Card could not be verified.",
                        }))
                        return
                    }

                    setStatus("success")
                    dispatch(showAlert({
                        variant: "success",
                        title: "Card Added Successfully",
                        description: "Your card has been saved to your account.",
                        duration: 5000,
                    }))

                    router.refresh()
                    onSuccess?.()
                },

                onCancel: () => {
                    setStatus("idle")
                    setOpen(true)
                    dispatch(showAlert({
                        variant: "destructive",
                        title: "Card Setup Cancelled",
                        description: "You closed the card setup window. No card was saved.",
                    }))
                },
            })

        } catch (err: any) {
            setStatus("error")
            setOpen(true)
            setErrorMsg(err?.message ?? "An unexpected error occurred. Please try again.")
            dispatch(showAlert({
                variant: "destructive",
                title: "Card Setup Failed",
                description: err?.message ?? "Please try again.",
            }))
        }
    }, [user, dispatch])

    return (
        <>
            <button
                onClick={openFresh}
                className={cn(
                    "bg-brand-primary-1 size-12 text-brand-primary-6 md:p-2 font-bold text-sm mx-1",
                    "flex rounded-lg gap-1 justify-center items-center",
                    "hover:bg-brand-primary-2 hover:scale-105 transition-all ease-in-out duration-200"
                )}
                aria-label="Add payment card"
            >
                <Icon icon="codex:plus" width="21" height="21" className="size-8" />
            </button>

            <AnimatedDialog
                open={open}
                onOpenChange={status === "loading" || status === "verifying" ? undefined : setOpen}
                showCloseButton={false}
                className="md:max-w-sm py-2"
            >
                {status !== "loading" && status !== "verifying" && (
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 text-brand-neutral-7/80 hover:text-brand-neutral-6"
                        aria-label="Close modal"
                    >
                        <Icon icon="line-md:close-circle-filled" width="24" height="24" className="size-7" />
                    </button>
                )}

                {/* ── idle ──────────────────────────────────────────────── */}
                {status === "idle" && (
                    <div className="flex flex-col items-center text-center gap-5 px-1 pt-1 pb-2">

                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary-1 border-4 border-brand-primary-2">
                            <Icon icon="hugeicons:credit-card-add" className="size-8 text-brand-primary-6" />
                        </div>

                        <DialogHeader className="text-center flex flex-col items-center gap-1">
                            <DialogTitle className="text-lg font-bold text-brand-secondary-9">
                                Add a Payment Card
                            </DialogTitle>
                            <DialogDescription className="text-sm text-brand-secondary-6 max-w-xs">
                                You'll be redirected to our secure payment provider to add your card.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="w-full rounded-xl border border-dashed border-brand-secondary-3 bg-brand-secondary-1/30 px-4 py-3 text-left">
                            <div className="flex items-start gap-2.5">
                                <Icon icon="hugeicons:information-circle" className="size-4 text-brand-secondary-5 mt-0.5 shrink-0" />
                                <p className="text-xs text-brand-secondary-6 leading-relaxed">
                                    A small <span className="font-semibold text-brand-secondary-8">service charge</span> may
                                    be temporarily held to verify your card. This amount is{" "}
                                    <span className="font-semibold text-brand-secondary-8">fully refunded</span> within
                                    24 hours and will not be deducted from your balance.
                                </p>
                            </div>
                        </div>

                        <div className="w-full space-y-1.5">
                            <label className="text-xs font-medium text-brand-secondary-5 text-left block">
                                Billing Country
                            </label>
                            <div className="flex items-center gap-2.5 w-full h-11 rounded-lg border border-brand-secondary-2 bg-brand-secondary-1/40 px-3 cursor-not-allowed">
                                <Icon icon="hugeicons:location-01" className="size-4 text-brand-secondary-4 shrink-0" />
                                <span className="text-sm text-brand-secondary-7 font-medium flex-1 text-left">
                                    {user?.country}
                                </span>
                                <Icon icon="hugeicons:lock" className="size-3.5 text-brand-secondary-4 shrink-0" />
                            </div>
                        </div>

                        <button
                            onClick={handleProceed}
                            className={cn(
                                "w-full h-12 rounded-xl font-semibold text-sm text-white",
                                "bg-brand-primary-6 hover:bg-brand-primary-7",
                                "active:scale-[0.98] transition-all duration-150",
                                "flex items-center justify-center gap-2"
                            )}
                        >
                            <Icon icon="hugeicons:shield-01" className="size-4" />
                            Proceed Securely
                        </button>

                        <p className="text-[11px] text-brand-secondary-4 -mt-1">
                            Secured · Powered by Paystack
                        </p>
                    </div>
                )}

                {/* ── loading / verifying ───────────────────────────────── */}
                {(status === "loading" || status === "verifying") && (
                    <div className="flex flex-col items-center text-center gap-6 px-1 py-4">

                        <div className="relative flex items-center justify-center w-20 h-20">
                            <svg
                                className="absolute inset-0 w-full h-full animate-spin"
                                viewBox="0 0 80 80"
                                fill="none"
                            >
                                <circle
                                    cx="40" cy="40" r="34"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeDasharray="60 150"
                                    className="text-brand-primary-5"
                                />
                            </svg>
                            <span className="w-4 h-4 rounded-full bg-brand-primary-5 animate-pulse" />
                        </div>

                        <DialogHeader className="text-center flex flex-col items-center gap-1">
                            <DialogTitle className="text-base font-bold text-brand-secondary-9">
                                {status === "verifying" ? "Verifying your card" : "Setting up your card"}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-brand-secondary-6">
                                {STEPS[stepIndex]}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex items-center gap-2">
                            {STEPS.map((_, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "block rounded-full transition-all duration-300",
                                        i < stepIndex ? "w-2 h-2 bg-brand-primary-5"
                                            : i === stepIndex ? "w-4 h-2 bg-brand-primary-6"
                                                : "w-2 h-2 bg-brand-secondary-3"
                                    )}
                                />
                            ))}
                        </div>

                        <p className="text-[11px] text-brand-secondary-4">
                            Please don't close this window…
                        </p>
                    </div>
                )}

                {/* ── success ───────────────────────────────────────────── */}
                {status === "success" && (
                    <div className="flex flex-col items-center text-center gap-5 px-1 py-4">

                        <div className="flex items-center justify-center w-20 h-20 rounded-full">
                            <Image src="/images/vectors/scan-verified.svg" alt="success" width={80} height={80} />
                        </div>

                        <DialogHeader className="text-center flex flex-col items-center gap-1">
                            <DialogTitle className="text-base font-bold text-brand-secondary-9">
                                Card Added Successfully
                            </DialogTitle>
                            <DialogDescription className="text-sm text-brand-secondary-6">
                                Your card has been saved to your account.
                            </DialogDescription>
                        </DialogHeader>

                        <button
                            onClick={() => setOpen(false)}
                            className={cn(
                                "w-full h-11 rounded-xl font-semibold text-sm text-white",
                                "bg-brand-primary-6 hover:bg-brand-primary-7 active:scale-[0.98] transition-all"
                            )}
                        >
                            Done
                        </button>
                    </div>
                )}

                {/* ── error ─────────────────────────────────────────────── */}
                {status === "error" && (
                    <div className="flex flex-col items-center text-center gap-5 px-1 py-2">

                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 border-4 border-red-100">
                            <svg
                                viewBox="0 0 24 24" fill="none"
                                className="w-9 h-9 text-red-500"
                                strokeWidth={2.5} stroke="currentColor"
                                strokeLinecap="round"
                            >
                                <path d="M12 8v4M12 16h.01" />
                                <circle cx="12" cy="12" r="9" />
                            </svg>
                        </div>

                        <DialogHeader className="text-center flex flex-col items-center gap-1">
                            <DialogTitle className="text-base font-bold text-brand-secondary-9">
                                Something went wrong
                            </DialogTitle>
                            <DialogDescription className="text-sm text-brand-secondary-6 max-w-xs">
                                {errorMsg}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-2.5 w-full">
                            <button
                                onClick={handleProceed}
                                className={cn(
                                    "w-full h-11 rounded-xl font-semibold text-sm text-white",
                                    "bg-brand-primary-6 hover:bg-brand-primary-7 active:scale-[0.98] transition-all"
                                )}
                            >
                                Try again
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "w-full h-11 rounded-xl font-semibold text-sm",
                                    "border border-brand-secondary-3 bg-brand-secondary-1 text-brand-secondary-7",
                                    "hover:bg-brand-secondary-2 active:scale-[0.98] transition-all"
                                )}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </AnimatedDialog>
        </>
    )
}