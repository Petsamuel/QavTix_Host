'use client'

import { cn } from '@/lib/utils'
import { TicketType } from '@/schemas/create-event.schema'
import { Icon } from '@iconify/react'

interface PricingBreakdownProps {
    ticketTypes: TicketType[]
    totalPotentialRevenue: number
    platformFee: number
    containerClassName?: string
    yourEarnings: number
    formatCurrency: (amount: number) => string
}

export const PricingBreakdown = ({
    ticketTypes,
    totalPotentialRevenue,
    platformFee,
    yourEarnings,
    containerClassName,
    formatCurrency
}: PricingBreakdownProps) => {
    return (
        <div className={cn(containerClassName, "space-y-4")}>
            {/* Individual Ticket Rows */}
            {ticketTypes.map((ticket, index) => (
                <div key={ticket.id || index} className="bg-white rounded-xl shadow-[0px_5.8px_23.17px_0px_#3326AE14] p-4 border border-brand-neutral-2">
                    <p className="text-brand-neutral-7 text-xs mb-2 capitalize">
                        {ticket.ticketType || 'Ticket Type'}:
                    </p>
                    <div className="flex items-center gap-3">
                        <Icon icon="hugeicons:user-id-verification" className="text-brand-primary-4 size-5" />
                        <p className="text-brand-secondary-8 font-medium text-xs">
                            {formatCurrency(Number(ticket.price) || 0)} × {ticket.quantity || 0} = {formatCurrency((Number(ticket.price) || 0) * (Number(ticket.quantity) || 0))}
                        </p>
                    </div>
                </div>
            ))}

            {/* Final Calculations */}
            <div className="bg-white rounded-xl shadow-[0px_5.8px_23.17px_0px_#3326AE14] p-4 border border-brand-neutral-2 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="hugeicons:note-done" className="text-brand-primary-4 size-5" />
                        <span className="text-brand-neutral-7 text-xs">Total Potential Revenue</span>
                    </div>
                    <span className="text-brand-secondary-8 font-medium text-xs">
                        {formatCurrency(totalPotentialRevenue)}
                    </span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon icon="hugeicons:note-done" className="text-brand-primary-4 size-5" />
                        <span className="text-brand-neutral-7 text-xs">Platform Fee (3%)</span>
                    </div>
                    <span className="text-brand-secondary-8 font-medium text-xs">
                        {formatCurrency(platformFee)}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                        <Icon icon="hugeicons:note-done" className="text-brand-primary-4 size-5" />
                        <span className="text-brand-neutral-7 text-xs">Your Earnings</span>
                    </div>
                    <span className="text-brand-secondary-8 font-medium text-xs">
                        {formatCurrency(yourEarnings)}
                    </span>
                </div>
            </div>
        </div>
    )
}