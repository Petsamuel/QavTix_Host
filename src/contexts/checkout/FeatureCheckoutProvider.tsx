"use client"

import { createContext, useContext, useState, useMemo, useCallback, ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { extractAccessCode } from "@/helper-fns/extractAccessCode"
import { PLATFORM_CURRENCY } from "@/components-data/currencies"
import { useCurrencyConversion } from "@/custom-hooks/useCurrencyConversion"
import { FEATURED_PLANS } from "@/components-data/pricing-plans"
import { initializeFeaturedPayment, verifyFeaturedPayment } from "@/actions/payment"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"

type FeaturedStatus = "idle" | "processing" | "success" | "error"

interface FeatureCheckoutContextType {
    selectedPlanId: string | null
    successPlan: any | null
    status: FeaturedStatus
    activeCurrency: string
    isRatesLoading: boolean
    closeAddModal: boolean,
    setSelectedPlanId: (id: string | null) => void
    setStatus: (status: FeaturedStatus) => void
    convertedPrice: (amountNGN: number) => string
    promoteToFeatured: (eventId: string) => Promise<void>
    resetSuccess: () => void
}

const FeatureCheckoutContext = createContext<FeatureCheckoutContextType | undefined>(undefined)

export function FeatureCheckoutProvider({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(store => store.authUser)
    const currencyCode = user?.currency || PLATFORM_CURRENCY

    const { trigger } = useRevalidate("events")

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
    const [successPlan, setSuccessPlan] = useState<any | null>(null)
    const [closeAddModal, setCloseAddModal] = useState(false)
    const [status, setStatus] = useState<FeaturedStatus>("idle")

    const { convert, isLoading: isRatesLoading } = useCurrencyConversion(currencyCode)

    const convertedPrice = useCallback(
        (amountNGN: number): string => convert(amountNGN).formatted,
        [convert]
    )


    const resetSuccess = useCallback(() => {
        setSuccessPlan(null)
        setStatus("idle")
        setSelectedPlanId(null)
        setCloseAddModal(false)
    }, [])

    const promoteToFeatured = async (eventId: string) => {
        const plan = FEATURED_PLANS.find(p => p.id === selectedPlanId)
        if (!plan || !eventId) return

        setStatus("processing")
        
        try {
            const res = await initializeFeaturedPayment({
                event_id: eventId,
                plan_slug: plan.id,
                country: user?.country || "NG",
                currency: "NGN"
            })

            if (!res.success) {
                throw new Error(res.message || "Failed to initialize payment")
            }

            // FLOW: FREE
            if (res.flow === "free") {
                setSuccessPlan(plan)
                setStatus("success")
                trigger()
                return
            }

            // FLOW: POPUP
            if (res.flow === "popup" && res.checkout_url) {
                const PaystackPop = (await import("@paystack/inline-js")).default
                const handler = new PaystackPop()
                const accessCode = extractAccessCode(res.checkout_url)
                setCloseAddModal(true)
                handler.resumeTransaction(accessCode, {
                    onSuccess: async (transaction: { reference: string }) => {
                        const verify = await verifyFeaturedPayment({
                            reference: transaction.reference,
                            event_id: eventId,
                            country: user?.country || "NG",
                        })
                        
                        if (verify.success) {
                            setSuccessPlan(plan)
                            setStatus("success")
                            trigger()
                        } else {
                            throw new Error(verify.message || "Verification failed")
                        }
                    },
                    onCancel: () => {
                        setStatus("idle")
                        dispatch(showAlert({ title: "Cancelled", description: "Payment was not completed.", variant: "destructive" }))
                    }
                })
            }
        } catch (error: any) {
            console.error(error)
            setStatus("error")
            dispatch(showAlert({ 
                title: "Error", 
                description: error.message || "An unexpected error occurred", 
                variant: "destructive" 
            }))
        }
    }

    const value = useMemo(() => ({
        selectedPlanId,
        successPlan,
        status,
        activeCurrency: currencyCode,
        isRatesLoading,
        convertedPrice,
        setSelectedPlanId,
        setStatus,
        promoteToFeatured,
        closeAddModal,
        resetSuccess
    }), [selectedPlanId, successPlan, status, closeAddModal, currencyCode, isRatesLoading, convertedPrice, resetSuccess])

    return (
        <FeatureCheckoutContext.Provider value={value}>
            {children}
        </FeatureCheckoutContext.Provider>
    )
}

export const useFeatureCheckout = () => {
    const context = useContext(FeatureCheckoutContext)
    if (!context) throw new Error("useFeatureCheckout must be used within FeatureCheckoutProvider")
    return context
}