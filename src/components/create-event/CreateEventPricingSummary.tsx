'use client'

import { useFormContext } from 'react-hook-form'
import { Step3FormData } from '@/schemas/create-event.schema'
import { PricingBreakdown } from './PricingBreakdown'
import { useAppSelector } from '@/lib/redux/hooks'

export default function CreateEventPricingSummary() {
    const { watch } = useFormContext<Step3FormData>()
    const ticketTypes = watch('ticketTypes') || []

    const currency = useAppSelector(store => store.authUser.user?.currency) || 'NGN'

    const totalPotentialRevenue = ticketTypes.reduce((acc, ticket) => {
        const price = Number(ticket.price) || 0
        const qty = Number(ticket.quantity) || 0
        return acc + (price * qty)
    }, 0)

    const platformFee = totalPotentialRevenue * 0.03
    const yourEarnings = totalPotentialRevenue - platformFee

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency,
            maximumFractionDigits: 0,
        }).format(amount).replace('NGN', '₦')
    }

    return (
        <div className="bg-white rounded-2xl drop-shadow-xs border border-brand-neutral-2 overflow-hidden w-full max-w-md">
            {/* Header */}
            <div className="border-b border-brand-neutral-3">
                <div className="relative inline-block px-6 pt-8 pb-3">
                    <h3 className="text-brand-primary-6 text-sm font-bold">
                        Sample Pricing Summary
                    </h3>
                    <span className="absolute bottom-0 left-6 right-0 h-0.75 bg-brand-primary-6" />
                </div>
            </div>

            <PricingBreakdown 
                ticketTypes={ticketTypes}
                totalPotentialRevenue={totalPotentialRevenue}
                platformFee={platformFee}
                containerClassName='p-5'
                yourEarnings={yourEarnings}
                formatCurrency={formatCurrency}
            />
        </div>
    )
}