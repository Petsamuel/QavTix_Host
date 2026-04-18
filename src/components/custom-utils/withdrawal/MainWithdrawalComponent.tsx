"use client"

import { ChangeEvent, useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { quickAmounts } from "./resources/quickAmounts"
import { space_grotesk } from "@/lib/fonts"
import AddAccountBtn from "@/lib/features/finance/AddAccountBtn"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { removePayoutAccount, submitWithdrawal } from "@/actions/financials"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import ActionButton1 from "../buttons/ActionBtn1"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"
import BankLogo from "@/components/financials/BankLogo"
import { CURRENCY_SYMBOL_MAP } from "@/components-data/currencies"
import { finishConfirmAction, openConfirmation, parseConfirmationSession, resetConfirmationStatus } from "@/lib/redux/slices/confirmationSlice"
import { CONFIRMATION_ACTION_TYPES } from "@/components/modals/resources/confirmationActions"
import { Input } from "@/components/ui/input"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"

interface Props {
    availableBalance: string
    payoutAccounts:   PayoutAccountItem[]
}

export default function MainWithdrawalComponent({
    availableBalance,
    payoutAccounts,
}: Props) {

    const dispatch  = useAppDispatch()
    const isMounted = useIsMounted()
    const { user }  = useAppSelector(store => store.authUser)
    const [amount,          setAmount]          = useState("")
    const [selectedAccount, setSelectedAccount] = useState("")
    const [isSubmitting,    setIsSubmitting]    = useState(false)
    const [removingId,      setRemovingId]      = useState<string | null>(null)
    const { isConfirmed, sessionId } = useAppSelector(store => store.confirmation)

    const balance = parseFloat(availableBalance)

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "")
        setAmount(value)
    }

    const handleQuickAmount = (value: number) => setAmount(value.toString())
    const { trigger } = useRevalidate("financials")

    const handleRemoveAccount = (accountId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        dispatch(openConfirmation({
            title:       "Remove Bank Account",
            description: "Are you sure you want to remove this bank account? This action cannot be undone.",
            actionType:  CONFIRMATION_ACTION_TYPES.DELETE_PAYOUT_ACCOUNT,
            targetId:    accountId,
        }))
    }

    const handleContinue = async () => {
        if (!amount || !selectedAccount) {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Missing fields",
                description: "Please enter an amount and select a bank account.",
            }))
            return
        }

        const numericAmount = parseFloat(amount)

        if (numericAmount <= 0) {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Invalid amount",
                description: "Amount must be greater than zero.",
            }))
            return
        }

        if (numericAmount > balance) {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Insufficient balance",
                description: `You can only withdraw up to ${isMounted ? formatPrice(balance, user?.currency) : balance.toLocaleString()}.`,
            }))
            return
        }

        setIsSubmitting(true)

        const result = await submitWithdrawal({
            amount:            amount,
            payout_account_id: selectedAccount,
        })

        setIsSubmitting(false)

        if (result.success) {
            setAmount("")
            setSelectedAccount("")

            dispatch(openSuccessModal({
                title:       "Withdrawal Submitted!",
                description: "Your Payment Withdrawal was successful. Thank you for choosing QavTix.",
                variant:     "success",
            }))
            
            trigger()
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Withdrawal failed",
                description: result.message ?? "Something went wrong. Please try again.",
            }))
        }
    }

    const isDisabled = !amount || !selectedAccount || isSubmitting

    useEffect(() => {
        if (!isConfirmed || !sessionId) return

        const { actionType, parsedTargetId } = parseConfirmationSession(sessionId)

        if (actionType !== CONFIRMATION_ACTION_TYPES.DELETE_PAYOUT_ACCOUNT || !parsedTargetId) return

        const run = async () => {
            setRemovingId(parsedTargetId)

            const result = await removePayoutAccount(parsedTargetId)

            dispatch(finishConfirmAction())
            dispatch(resetConfirmationStatus())
            setRemovingId(null)

            if (result.success) {
                if (selectedAccount === parsedTargetId) setSelectedAccount("")
                dispatch(showAlert({
                    variant:     "success",
                    title:       "Account removed",
                    description: "Bank account removed successfully.",
                }))
            } else {
                dispatch(showAlert({
                    variant:     "destructive",
                    title:       "Failed to remove account",
                    description: result.message ?? "Please try again.",
                }))
            }
        }

        run()
    }, [isConfirmed, sessionId])


    return (
        <div className="w-full h-fit">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-8")}>
                    Withdrawal
                </h1>
                <AddAccountBtn />
            </div>

            {/* Balance card */}
            <div className="relative overflow-hidden bg-linear-to-br from-[#5b20dbc9] via-[#9664FF] to-purple-600 rounded-3xl p-8 mb-10">
                <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
                    <div className="absolute -top-28 -right-24 w-48 h-48 border-2 border-white rounded-full" />
                    <div className="absolute -top-24 -right-20 w-48 h-48 border-2 border-white rounded-full" />
                </div>
                <div className="relative z-10 space-y-6">
                    <p className="text-white text-sm font-medium opacity-90">Available Balance</p>
                    <h2 className={cn(space_grotesk.className, "text-white text-3xl font-bold")}>
                        {isMounted
                            ? formatPrice(parseFloat(availableBalance), user?.currency)
                            : `${availableBalance}`
                        }
                    </h2>
                </div>
            </div>

            {/* Amount input */}
            <div className="mb-6 flex gap-2 border-b border-b-neutral-5">
                <div className="border-e pe-3 pb-2 border-e-neutral-5 flex items-center">
                    <span className="text-brand-secondary-8 text-xl">
                        {isMounted && user?.currency
                            ? CURRENCY_SYMBOL_MAP[user.currency] ?? user.currency
                            : "₦"
                        }
                    </span>
                </div>
                <input
                    type="text"
                    value={amount ? parseFloat(amount).toLocaleString() : ""}
                    onChange={handleAmountChange}
                    placeholder="Enter Amount to Withdraw"
                    className="flex-1 text-base pb-2 ps-5 text-gray-700 placeholder:text-brand-secondary-3 outline-none bg-transparent"
                />
            </div>

            {/* Quick amounts */}
            <div className="flex flex-wrap gap-3 mb-8">
                {quickAmounts.map(q => (
                    <button
                        key={q}
                        onClick={() => handleQuickAmount(q)}
                        className={cn(
                            "px-4 py-3 rounded-sm text-xs transition-all",
                            amount === q.toString()
                                ? "bg-brand-primary-6 text-white shadow-md"
                                : "bg-brand-neutral-4 text-brand-secondary-4 hover:bg-brand-neutral-5"
                        )}
                    >
                        {isMounted ? formatPrice(q, user?.currency) : `₦${q.toLocaleString()}`}
                    </button>
                ))}
            </div>

            {/* Account selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-brand-secondary-9 mb-3">
                    Choose withdrawal account
                </label>

                {payoutAccounts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2 bg-brand-neutral-3 rounded-lg">
                        <Icon icon="hugeicons:bank" className="w-6 h-6 text-brand-neutral-6" />
                        <p className="text-xs text-brand-secondary-6">No accounts added yet.</p>
                        <AddAccountBtn />
                    </div>
                ) : (
                    <Select
                        value={selectedAccount}
                        onValueChange={setSelectedAccount}
                    >
                        <SelectTrigger className="w-full border-neutral-3 p-3 h-14! bg-brand-neutral-4">
                            <SelectValue placeholder="Select Bank Account" />
                        </SelectTrigger>
                        <SelectContent>
                            {payoutAccounts.map(acct => (
                                <div key={acct.id} className="relative flex items-center">
                                    <SelectItem
                                        value={acct.id}
                                        className="text-xs w-full pr-10"
                                    >
                                        <div className="flex items-center gap-3 py-1 w-full">
                                            <div className="flex items-center gap-5">
                                                <Input type="radio" readOnly checked={selectedAccount === acct.id} value={acct.id} className="size-4" />
                                                {/* Bank logo */}
                                                <div className="size-7 shrink-0">
                                                    <BankLogo bankName={acct.bank_name.toLowerCase()} />
                                                </div>
                                            </div>

                                            {/* Account details */}
                                            <div className="text-left flex-1 min-w-0">
                                                <div>
                                                    <p className="font-semibold capitalize text-xs text-brand-secondary-9 truncate">
                                                        {acct.account_name}
                                                    </p>
                                                    <p className="text-[11px] capitalize text-brand-secondary-8">
                                                        {acct.bank_name} · {acct.account_number}
                                                    </p>
                                                </div>
                                                {/* Default badge */}
                                                {acct.is_default && (
                                                    <span className="text-[10px] text-brand-primary-6 font-semibold shrink-0">
                                                        Default
                                                    </span>
                                                )}
                                            </div>

                                        </div>
                                    </SelectItem>

                                    {/* Delete button lives outside SelectItem — stopPropagation works */}
                                    <button
                                        type="button"
                                        disabled={removingId === acct.id}
                                        onClick={(e) => handleRemoveAccount(acct.id, e)}
                                        className="absolute right-2 z-10 p-1.5 bg-red-50 rounded-full transition-colors group shrink-0 disabled:opacity-40"
                                    >
                                        {removingId === acct.id ? (
                                            <Icon icon="svg-spinners:ring-resize" className="size-4 text-red-400" />
                                        ) : (
                                            <Icon
                                                icon="bytesize:trash"
                                                className="size-5 text-red-500 group-hover:text-red-600"
                                            />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <ActionButton1
                buttonText={isSubmitting ? "Processing..." : "Continue"}
                isLoading={isSubmitting}
                isDisabled={isDisabled}
                action={handleContinue}
                className="w-full rounded-md! bg-brand-primary-6!"
            />
        </div>
    )
}