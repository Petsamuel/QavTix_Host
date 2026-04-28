"use client"

import {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode,
} from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { extractAccessCode } from "@/helper-fns/extractAccessCode"
import { PLATFORM_CURRENCY } from "@/components-data/currencies"
import { useCurrencyConversion } from "../../custom-hooks/useCurrencyConversion"
import { getUserLocationClient as getUserLocation, initializeHostSubscription, verifyHostSubscription } from "@/actions/settings/client"


type BillingCycle   = "monthly" | "annual"
type CheckoutStatus = "idle" | "processing" | "success" | "error"

interface PricingCheckoutState {
    selectedPlan:     PricingPlan | null
    successPlan:      PricingPlan | null   // THE PLAN THAT COMPLETED PAYMENT SUCCESSFULLY
    billingCycle:     BillingCycle
    status:           CheckoutStatus
    processingPlanId: string | null        // ID OF THE CARD CURRENTLY SHOWING A SPINNER
    activeCurrency:   string
    isRatesLoading:   boolean
    convertedPrice:   (amountNGN: number) => string
}

interface PricingCheckoutActions {
    selectPlan:         (plan: PricingPlan) => void
    clearSelectedPlan:  () => void
    setBillingCycle:    (cycle: BillingCycle) => void
    subscribe:          (plan: PricingPlan) => Promise<void>
    resetSuccess:       () => void
}

type PricingCheckoutContextType = PricingCheckoutState & PricingCheckoutActions

const PricingCheckoutContext = createContext<PricingCheckoutContextType | undefined>(undefined)

interface Props {
    children:    ReactNode
}

export function PricingCheckoutProvider({ children }: Props) {

    const dispatch = useAppDispatch()

    const { user }     = useAppSelector(store => store.authUser)
    const currencyCode = user?.currency || PLATFORM_CURRENCY

    const [selectedPlan,     setSelectedPlan]     = useState<PricingPlan | null>(null)
    const [successPlan,      setSuccessPlan]      = useState<PricingPlan | null>(null)
    const [billingCycle,     setBillingCycle]     = useState<BillingCycle>("monthly")
    const [status,           setStatus]           = useState<CheckoutStatus>("idle")

    // TRACKS EXACTLY WHICH CARD IS SPINNING — OTHER CARDS DISABLE WITHOUT A SPINNER
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)

    const { convert, isLoading: isRatesLoading } = useCurrencyConversion(currencyCode)

    const convertedPrice = useCallback(
        (amountNGN: number): string => convert(amountNGN).formatted,
        [convert]
    )

    const effectivePrice = useCallback(
        (plan: PricingPlan): number =>
            billingCycle === "annual" ? plan.price * 10 : plan.price,
        [billingCycle]
    )

    const selectPlan        = useCallback((plan: PricingPlan) => setSelectedPlan(plan), [])
    const clearSelectedPlan = useCallback(() => setSelectedPlan(null), [])
    const resetSuccess      = useCallback(() => {
        setSuccessPlan(null)
        setStatus("idle")
    }, [])

    const subscribe = useCallback(async (plan: PricingPlan) => {

        // FREE PLAN — NO PAYMENT NEEDED
        if (plan.price === 0 && plan.currency !== "Custom") {
            dispatch(showAlert({
                title:       "You're on the free plan",
                description: "No payment required. Start right away.",
            }))
            return
        }

        // MARK ONLY THIS PLAN AS PROCESSING — ALL OTHERS BECOME DISABLED
        setStatus("processing")
        setProcessingPlanId(plan.id)

        try {
            const { country } = await getUserLocation()

            const init = await initializeHostSubscription({
                    plan_slug:     plan.id,
                    billing_cycle: billingCycle,
                    country,
                    currency:      currencyCode,
                })

            if (!init.success || !init.checkout_url) {
                dispatch(showAlert({
                    title:       "Payment Error",
                    description: init.message ?? "Could not initialize payment.",
                    variant:     "destructive",
                }))
                setStatus("error")
                setProcessingPlanId(null)
                return
            }

            const PaystackPop = (await import("@paystack/inline-js")).default
            const handler     = new PaystackPop()
            const accessCode  = extractAccessCode(init.checkout_url)

            handler.resumeTransaction(accessCode, {

                onSuccess: async (transaction: { reference: string }) => {
                    const verify =  await verifyHostSubscription({
                            reference: transaction.reference,
                            save_card: true,
                            country,
                        })

                    if (!verify.success) {
                        dispatch(showAlert({
                            title:       "Verification Failed",
                            description: verify.message ?? "Payment could not be verified.",
                            variant:     "destructive",
                        }))
                        setStatus("error")
                        setProcessingPlanId(null)
                        return
                    }

                    // FLIP TO SUCCESS — STORE WHICH PLAN SUCCEEDED FOR THE SUCCESS SCREEN
                    setSelectedPlan(plan)
                    setSuccessPlan(plan)
                    setStatus("success")
                    setProcessingPlanId(null)
                },

                onCancel: () => {
                    setStatus("idle")
                    setProcessingPlanId(null)
                    dispatch(showAlert({
                        title:       "Payment cancelled",
                        description: "Your subscription was not activated.",
                        variant:     "destructive",
                    }))
                },
            })

        } catch {
            setStatus("error")
            setProcessingPlanId(null)
            dispatch(showAlert({
                title:       "Unexpected Error",
                description: "Something went wrong. Please try again.",
                variant:     "destructive",
            }))
        }

    }, [billingCycle, currencyCode, dispatch, user])

    const value = useMemo<PricingCheckoutContextType>(() => ({
        selectedPlan,
        successPlan,
        billingCycle,
        status,
        processingPlanId,
        activeCurrency: currencyCode,
        isRatesLoading,
        convertedPrice,
        effectivePrice,
        selectPlan,
        clearSelectedPlan,
        setBillingCycle,
        subscribe,
        resetSuccess,
    }), [
        selectedPlan, successPlan, billingCycle, status,
        processingPlanId, currencyCode, isRatesLoading, convertedPrice,
        effectivePrice, selectPlan, clearSelectedPlan, subscribe, resetSuccess,
    ])

    return (
        <PricingCheckoutContext.Provider value={value}>
            {children}
        </PricingCheckoutContext.Provider>
    )
}

export function usePricingCheckout() {
    const context = useContext(PricingCheckoutContext)
    if (!context) throw new Error("usePricingCheckout must be used within PricingCheckoutProvider")
    return context
}