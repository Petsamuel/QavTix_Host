"use client"

import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import PaymentCard from "../cards/PaymentCard"
import ChangeDefaultCardModal from "../modals/ChangeDefaultPaymentMethod"
import AddPaymentCard from "@/lib/features/add-payment-card"
import { getPaymentMethods } from "@/actions/payment/index"
import { getAuthToken } from "@/helper-fns/getAuthToken"


interface Props {
    initialMethods: PaymentMethod[]
}


export default function PaymentMethodsPanel({ initialMethods }: Props) {

    const [methods,     setMethods]     = useState<PaymentMethod[]>(initialMethods)
    const [showModal,   setShowModal]   = useState(false)

    useEffect(() => {
        setMethods(initialMethods)
    }, [initialMethods])

    const handleRefetch = async () => {
        const token = await getAuthToken()
        const res = await getPaymentMethods(token)
        if (res.success && res.data) {
            setMethods(res.data)
        }
    }

    const defaultMethod = methods.find(m => m.is_default)
    const otherMethods  = methods.filter(m => !m.is_default)

    return (
        <main className="w-full pt-8 pb-16 space-y-10">
            <div className="flex justify-between items-center">
                <h2 className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>
                    Payment Method
                </h2>
                <div className="md:self-center md:ms-6">
                    <AddPaymentCard onSuccess={handleRefetch} />
                </div>
            </div>

            {methods.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                    <div className="p-3 rounded-full bg-brand-neutral-2">
                        <Icon icon="ph:credit-card" className="size-6 text-brand-neutral-6" />
                    </div>
                    <p className="text-sm font-medium text-brand-secondary-8">No payment methods</p>
                    <p className="text-xs text-brand-secondary-5">Add a card to manage your payments.</p>
                </div>
            ) : (
                <div className="flex flex-col flex-wrap md:flex-row gap-8 lg:gap-12 items-start">
                    {/* Default card — larger, vibrant */}
                    {defaultMethod && (
                        <div className="w-full lg:w-auto space-y-3">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-secondary-5">
                                Default Card
                            </p>
                            <div className="w-full lg:w-68">
                                <PaymentCard method={defaultMethod} variant="default" />
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex mt-8 items-center gap-1.5 text-sm font-bold text-brand-primary-6 hover:text-brand-primary-7 transition-colors group"
                            >
                                Change Default Card
                                <Icon icon="zondicons:arrow-right"  className="size-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    )}

                    {otherMethods.length > 0 && (
                        <div className="w-full lg:w-auto space-y-3">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-secondary-5">
                                Others
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {otherMethods.map(method => (
                                    <div key={method.id} className="w-full sm:w-76">
                                        <PaymentCard method={method} variant="other" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}

            <ChangeDefaultCardModal
                open={showModal}
                onOpenChange={setShowModal}
                methods={methods}
                onSaved={setMethods}
            />
        </main>
    )
}