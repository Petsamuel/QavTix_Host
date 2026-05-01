import { NAVIGATION_LINKS } from '@/enums/navigation'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'

interface TopPerformingEventCardProps {
    event: TrendingTicket
    rank?: number
}

export default function TopPerformingEventCard({ event, rank }: TopPerformingEventCardProps) {
    const revenue = Number(event.revenue)

    return (
        <div className="shadow-[0px_5.8px_23.17px_0px_#3326AE14] py-2 space-y-1 border-b border-brand-neutral-2 last:border-0 px-3 rounded-lg">

            {/* Header Stats */}
            <div className="flex items-center gap-3 justify-between mb-3 text-[10px] text-brand-neutral-7">
                <div className="flex items-center gap-1">
                    <Icon icon="hugeicons:target-02" className="shrink-0 size-4 text-brand-accent-3" />
                    <span>
                        Conversion Rate:{' '}
                        <span className="font-medium">{event.conversion_rate}%</span>
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Icon icon="hugeicons:ticket-02" className="size-4 shrink-0 text-brand-accent-3" />
                    <span>
                        Tickets Sold:{' '}
                        <span className="font-medium">{event.tickets_sold}/{event.quantity}</span>
                    </span>
                </div>
            </div>

            {/* Event Info */}
            <div className="flex items-center gap-3 mb-3">
                <div className="relative size-6.25 rounded-sm overflow-hidden shrink-0 bg-brand-neutral-2">
                    {event.event_image ? (
                        <Image
                            src={event.event_image}
                            alt={event.event_name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Icon icon="hugeicons:image-01" className="w-5 h-5 text-brand-neutral-4" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-brand-secondary-9 truncate mb-0.5">
                        {event.event_name}
                    </h3>
                    <p className="text-[10px] text-brand-neutral-7">
                        {event.ticket_type} · {event.event_category}
                    </p>
                </div>

                {rank && (
                    <span className="text-[10px] font-bold text-brand-neutral-4 shrink-0">
                        #{rank}
                    </span>
                )}
            </div>

            {/* Revenue */}
            <div className="border-t border-brand-neutral-2 pt-1.5">
                <div className="flex text-[11px] items-center gap-5">
                    <span className="text-brand-neutral-9">Revenue Generated:</span>
                    <span className="font-medium text-[#5F9F7D]">
                        ₦{revenue.toLocaleString()}
                    </span>
                </div>
            </div>

            <Link
                href={NAVIGATION_LINKS.MY_EVENTS.href}
                className="inline-flex items-center gap-1 text-xs text-brand-primary-6 hover:text-brand-primary-7 font-semibold mt-1"
            >
                <span>View Full Report</span>
                <Icon icon="hugeicons:arrow-right-01" className="w-3 h-3" />
            </Link>
        </div>
    )
}