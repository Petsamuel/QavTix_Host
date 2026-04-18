import CreatePromoCodeForm from "@/components/custom-utils/promo-code/CreatePromoCodeForm"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useState } from "react"

interface AddPromoCodeProps {
    className?: string,
}

export default function AddPromoCode({
    className,
}: AddPromoCodeProps) {

    const [showAddPromoCodeModal, setShowAddPromoCodeModal] =  useState(false)

    return (
        <>
            <button
                onClick={() => setShowAddPromoCodeModal(true)}
                className={cn(
                    'flex items-center rounded justify-between text-xs md:text-sm font-bold gap-2 bg-brand-primary-1 p-1.5 transition-opacity',
                    'text-brand-primary-6 hover:text-brand-primary-7 hover:bg-brand-primary-2 transition-colors ease-in-out duration-200',
                    className
                )}
            >
                <span className={cn(
                    'w-6 aspect-square rounded flex justify-center items-center text-white',
                    'bg-brand-primary-3'
                )}>
                    <Icon icon="pajamas:export" width="16" height="16" />
                </span>
                <span>Create New</span>
            </button>

            <CreatePromoCodeForm openPromoModal={showAddPromoCodeModal} setOpenPromoModal={setShowAddPromoCodeModal} />
        </>
    )
}