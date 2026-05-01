"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { setDefaultPaymentMethod } from "@/actions/payment/client"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"


const BrandIcon = ({ brand }: { brand: string }) => {
    const logos: Record<string, string> = {
        visa:       "/images/vectors/visa.svg",
        mastercard: "/images/vectors/mastercard.svg",
        verve:      "/images/vectors/verve.svg",
        amex:      "/images/vectors/amex.svg",
    }
    const src = logos[brand.toLowerCase().trim()]

    if (!src) {
        return (
            <div className="w-8 h-8 rounded-md bg-brand-neutral-3 flex items-center justify-center">
                <Icon icon="ph:credit-card" className="size-4 text-brand-neutral-6" />
            </div>
        )
    }

    return (
        <div className="w-8 h-8 rounded-md bg-white border border-brand-neutral-3 flex items-center justify-center overflow-hidden shadow-sm">
            <img src={src} alt={brand} className="h-4 w-auto object-contain" />
        </div>
    )
}

interface Props {
    open:         boolean
    onOpenChange: (open: boolean) => void
    methods:      PaymentMethod[]
    onSaved:      (methods: PaymentMethod[]) => void
}

export default function ChangeDefaultCardModal({ open, onOpenChange, methods, onSaved }: Props) {

    const dispatch   = useAppDispatch()
    const currentDefault = methods.find(m => m.is_default)

    const [selectedId, setSelectedId] = useState<string>(
        String(currentDefault?.id ?? methods[0]?.id ?? "")
    )
    const [isSaving,   setIsSaving]   = useState(false)

    const handleSave = async () => {
        const id = parseInt(selectedId)
        if (isNaN(id) || id === currentDefault?.id) {
            onOpenChange(false)
            return
        }

        setIsSaving(true)
        const result = await setDefaultPaymentMethod(id)
        setIsSaving(false)

        if (result.success) {
            const updated = methods.map(m => ({ ...m, is_default: m.id === id }))
            onSaved(updated)
            onOpenChange(false)
            dispatch(showAlert({
                variant:     "default",
                title:       "Default card updated",
                description: `Card ending in ${methods.find(m => m.id === id)?.last4} is now your default.`,
            }))
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Could not update default card",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return (
        <AnimatedDialog
                open={open}
                showCloseButton={false}
                onOpenChange={onOpenChange}
                className='md:max-w-xs! py-2'
            >
                <DialogHeader className="text-center flex justify-center items-center">
                    <DialogTitle className="text-base font-bold text-brand-secondary-9">
                        Select Default Card
                    </DialogTitle>
                    <DialogDescription className="text-xs text-center text-brand-secondary-6">
                        Choose your default card for quick payments
                    </DialogDescription>
                </DialogHeader>

                <RadioGroup
                    value={selectedId}
                    onValueChange={setSelectedId}
                    className="space-y-3 mt-6"
                >
                    {methods.map(method => {
                        const expiry = `${String(method.exp_month).padStart(2, "0")}/${method.exp_year}`
                        const isSelected = selectedId === String(method.id)

                        return (
                            <Label
                                key={method.id}
                                htmlFor={String(method.id)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                                    "shadow-[0px_5.02px_20.08px_0px_#3326AE14]",
                                    isSelected
                                        ? "border-brand-primary-4 bg-brand-primary-1/30"
                                        : "border-brand-neutral-3 hover:bg-brand-neutral-1"
                                )}
                            >
                                <BrandIcon brand={method.brand} />

                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-brand-secondary-9 font-mono tracking-wider">
                                        **** **** **** {method.last4}
                                    </p>
                                    <p className="text-[10px] text-brand-secondary-5 mt-0.5">{expiry}</p>
                                </div>

                                <RadioGroupItem
                                    value={String(method.id)}
                                    id={String(method.id)}
                                    className="border-[1.5px] shrink-0 data-[state=checked]:border-brand-primary-6 data-[state=checked]:text-brand-primary-6"
                                />
                            </Label>
                        )
                    })}
                </RadioGroup>
    
                <DialogFooter className="mt-6 justify-center flex-row gap-3 sm:gap-3">
                    <ActionButton1 
                        action={handleSave}
                        isDisabled={isSaving}
                        isLoading={isSaving}
                        buttonText="Save Changes"
                        buttonType="button"
                        className="w-full"
                    />
                </DialogFooter>
            </AnimatedDialog>
    )
}