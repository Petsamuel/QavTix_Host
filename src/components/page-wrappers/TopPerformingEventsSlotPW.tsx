'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'
import TopPerformingEventCard from '../slots/top-performing-events/TopPerformingEventItem'

interface TopPerformingEventsSlotPWProps {
    eventsData: TrendingTicket[]
}

const PREVIEW_COUNT = 4

export default function TopPerformingEventsSlotPW({ eventsData }: TopPerformingEventsSlotPWProps) {
    const preview = eventsData.slice(0, PREVIEW_COUNT)

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-neutral-2 overflow-hidden w-full">
            <div className="border-b border-brand-neutral-3">
                <div className="px-6 py-4">
                    <h2 className="text-sm md:text-[13px] font-bold text-brand-primary-6">
                        Top Performing Events
                    </h2>
                </div>
            </div>

            <div className="py-4 space-y-3 w-full px-4">
                {preview.length > 0 ? (
                    preview.map((event, index) => (
                        <TopPerformingEventCard
                            key={event.ticket_id}
                            event={event}
                            rank={index + 1}
                        />
                    ))
                ) : (
                    <div className="py-12 text-center text-sm text-brand-neutral-7">
                        No top performing events yet.
                    </div>
                )}
            </div>

            {eventsData.length > PREVIEW_COUNT && (
                <div className="px-4 pb-4">
                    <Link
                        href="/dashboard/events"
                        className="text-xs flex items-center gap-1 text-brand-primary-6 hover:text-brand-primary-7 font-bold transition-colors"
                    >
                        <span>View Full Report</span>
                        <Icon icon="humbleicons:arrow-right" width="20" height="20" />
                    </Link>
                </div>
            )}
        </div>
    )
}