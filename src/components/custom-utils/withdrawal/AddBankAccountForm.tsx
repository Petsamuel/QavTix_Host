"use client"

import { AnimatedDialog } from "../dialogs/AnimatedDialog"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { DialogTitle } from "@/components/ui/dialog"
import { addAccountSchema, AddAccountSchemaType } from "@/schemas/add-account.schema"
import CustomInput1 from "../inputs/CustomInput1"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { openSuccessModal } from "@/lib/redux/slices/successModalSlice"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { getPaystackBanksClient as getPaystackBanks, verifyAccountNumber } from "@/actions/payout/client"
import SearchableSelect from "../inputs/CustomSearchableSelect"
import ActionButton1 from "../buttons/ActionBtn1"
import { addPayoutAccount } from "@/actions/financials"
import { BankOption } from "@/actions/payout"

interface Props {
    openAddAccountModal: boolean
    setOpenAddAccountModal: Dispatch<SetStateAction<boolean>>
}

export default function AddBankAccountForm({
    openAddAccountModal,
    setOpenAddAccountModal,
}: Props) {

    const dispatch = useAppDispatch()
    const { user } = useAppSelector(store => store.authUser)

    // Determine if user is Nigerian based on their currency
    const isNigerian = user?.currency?.toUpperCase() === "NGN"

    const [banks, setBanks] = useState<BankOption[]>([])
    const [banksLoading, setBanksLoading] = useState(false)
    const [verifyState, setVerifyState] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [verifyMessage, setVerifyMessage] = useState("")

    const {
        control,
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AddAccountSchemaType>({
        resolver: zodResolver(addAccountSchema),
        defaultValues: {
            bank_code: "",
            bank_name: "",
            account_number: "",
            account_name: "",
            is_default: false,
        },
    })

    const bankCode = watch("bank_code")
    const accountNumber = watch("account_number")
    const accountNumReady = accountNumber?.length === 10

    // Load Nigerian banks on mount if user is Nigerian
    useEffect(() => {
        if (!isNigerian) return
        setBanksLoading(true)
        getPaystackBanks("nigeria").then(result => {
            setBanksLoading(false)
            if (result.success && result.data) setBanks(result.data)
        })
    }, [isNigerian])

    // Auto-verify for Nigerian users when 10 digits + bank selected
    useEffect(() => {
        if (!isNigerian || !bankCode || !accountNumReady) return

        setVerifyState("loading")
        setVerifyMessage("")
        setValue("account_name", "")

        const timeout = setTimeout(() => {
            verifyAccountNumber(accountNumber, bankCode, "nigeria").then(result => {
                if (result.success && result.account_name) {
                    setValue("account_name", result.account_name, { shouldValidate: true })
                    setVerifyState("success")
                    setVerifyMessage(result.account_name)
                } else {
                    setVerifyState("error")
                    setVerifyMessage(result.message ?? "Could not verify account number")
                }
            })
        }, 300)

        return () => clearTimeout(timeout)
    }, [accountNumber, bankCode, isNigerian, accountNumReady])

    const onSubmit = async (data: AddAccountSchemaType) => {
        const result = await addPayoutAccount({
            bank_name: data.bank_name,
            account_name: data.account_name,
            account_number: data.account_number,
            is_default: data.is_default,
            bank_code: data.bank_code,
        })

        if (result.success) {
            reset()
            setVerifyState("idle")
            setOpenAddAccountModal(false)
            dispatch(openSuccessModal({
                title: "Submission Successful!",
                description: "Your bank account is being verified. We’ll let you know when it’s done.",
                variant: "success"
            }))
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Failed to add account",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    const handleClose = () => {
        reset()
        setVerifyState("idle")
        setOpenAddAccountModal(false)
    }

    return (
        <AnimatedDialog className="md:max-w-[25em]" open={openAddAccountModal} onOpenChange={handleClose}>
            <div>
                <div className="flex justify-center items-center flex-col text-center mb-6">
                    <DialogTitle className="font-semibold text-brand-secondary-9">
                        Add Bank Account
                    </DialogTitle>
                    <p className="text-sm text-brand-secondary-6 mt-2">
                        Fill out the form to add a new bank account
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {isNigerian ? (
                        <Controller
                            name="bank_code"
                            control={control}
                            render={({ field }) => (
                                <SearchableSelect
                                    label="Bank Name"
                                    required
                                    options={banks.map(b => ({ value: b.value, label: b.label }))}
                                    value={field.value}
                                    onValueChange={(val) => {
                                        field.onChange(val)
                                        const bank = banks.find(b => b.value === val)
                                        if (bank) setValue("bank_name", bank.name)
                                        setValue("account_name", "")
                                        setVerifyState("idle")
                                    }}
                                    placeholder={banksLoading ? "Loading banks..." : "Select bank"}
                                    searchPlaceholder="Search bank..."
                                    disabled={banksLoading}
                                    error={errors.bank_code?.message}
                                />
                            )}
                        />
                    ) : (
                        <CustomInput1
                            label="Bank Name"
                            required
                            placeholder="Enter bank name"
                            error={errors.bank_name?.message}
                            {...register("bank_name")}
                        />
                    )}

                    {/* Account number */}
                    <div>
                        <CustomInput1
                            label="Account Number"
                            required
                            placeholder={isNigerian ? "Enter 10-digit account number" : "Enter account number"}
                            maxLength={isNigerian ? 10 : 20}
                            error={errors.account_number?.message}
                            {...register("account_number")}
                        />

                        {/* Verify status — Nigerian users only */}
                        {isNigerian && bankCode && (
                            <div className={cn(
                                "flex items-center gap-2 mt-2 text-xs",
                                verifyState === "success" && "text-green-600",
                                verifyState === "error" && "text-red-500",
                                verifyState === "loading" && "text-brand-secondary-6",
                            )}>
                                {verifyState === "loading" && (
                                    <>
                                        <Icon icon="svg-spinners:ring-resize" className="w-3.5 h-3.5" />
                                        <span>Verifying account...</span>
                                    </>
                                )}
                                {verifyState === "success" && (
                                    <>
                                        <Icon icon="lucide:check-circle" className="w-3.5 h-3.5" />
                                        <span>{verifyMessage}</span>
                                    </>
                                )}
                                {verifyState === "error" && (
                                    <>
                                        <Icon icon="lucide:alert-circle" className="w-3.5 h-3.5" />
                                        <span>{verifyMessage}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Account name — auto-filled for Nigerian, manual for others */}
                    <CustomInput1
                        label="Account Name"
                        required
                        placeholder="Account holder name"
                        readOnly={isNigerian && verifyState === "success"}
                        error={errors.account_name?.message}
                        className={cn(
                            isNigerian && verifyState === "success" && "bg-brand-neutral-3 text-brand-secondary-6"
                        )}
                        {...register("account_name")}
                    />

                    {/* Manual review notice for non-Nigerian */}
                    {!isNigerian && (
                        <p className="text-xs text-brand-secondary-6 bg-brand-neutral-2 rounded-lg px-3">
                            Account details will be manually reviewed before activation.
                        </p>
                    )}

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3.5 rounded-[30px] border-2 border-brand-secondary-3 font-medium text-sm hover:bg-brand-neutral-2 transition-all duration-150"
                        >
                            Cancel
                        </button>
                        <ActionButton1
                            buttonText={isSubmitting ? "Saving..." : "Confirm"}
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                            buttonType="submit"
                            className="flex-1 py-3.5 rounded-[30px] text-sm"
                        />
                    </div>
                </form>
            </div>
        </AnimatedDialog>
    )
}