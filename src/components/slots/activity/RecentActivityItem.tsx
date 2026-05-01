'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Timer02 from '../../Svg-Icons/Timer02'
import { NAVIGATION_LINKS } from '@/enums/navigation'

const ACTIVITY_ICON_MAP: Record<string, { icon: string; bgColor: string; iconColor: string }> = {
    sale: {
        icon: 'hugeicons:shopping-bag-02',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
    },
    checkin: {
        icon: 'hugeicons:tick-double-02',
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
    },
    refund: {
        icon: 'hugeicons:money-receive-02',
        bgColor: 'bg-red-50',
        iconColor: 'text-red-500',
    },
    withdrawal: {
        icon: 'hugeicons:money-send-02',
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    ticket_transfer: {
        icon: 'hugeicons:ticket-02',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
    },
}

const ACTIVITY_TYPE_LABEL: Record<string, string> = {
    sale: 'New Sale',
    checkin: 'Check-in',
    refund: 'Refund',
    withdrawal: 'Withdrawal',
    ticket_transfer: 'Ticket Transfer',
}

const DEFAULT_ICON = {
    icon: 'hugeicons:notification-02',
    bgColor: 'bg-brand-neutral-1',
    iconColor: 'text-brand-neutral-6',
}

interface RecentActivityItemProps {
    activity: DashboardActivity
}

export default function RecentActivityItem({ activity }: RecentActivityItemProps) {
    const iconConfig = ACTIVITY_ICON_MAP[activity.activity_type] ?? DEFAULT_ICON
    const typeLabel = ACTIVITY_TYPE_LABEL[activity.activity_type] ?? activity.activity_type
    const timeAgo = formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })
    const eventId = activity.metadata?.event_id

    return (
        <div className="shadow-[0px_5.8px_23.17px_0px_#3326AE14] py-2 space-y-1 border-b border-brand-neutral-2 last:border-0 px-4 rounded-lg">
            <div className="flex w-full justify-between gap-4">
                <span className="text-[11px] text-brand-neutral-7">{typeLabel}</span>
                <div className="flex items-center gap-1 text-[11px] text-brand-neutral-7">
                    <Timer02 />
                    <span>{timeAgo}</span>
                </div>
            </div>

            <div className="flex w-full gap-4">
                <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                    iconConfig.bgColor
                )}>
                    <Icon icon={iconConfig.icon} className={cn("w-5 h-5", iconConfig.iconColor)} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-brand-secondary-8 font-medium mb-0.5">
                        {activity.message}
                    </p>

                    {activity.metadata?.buyer_name && (
                        <p className="text-[11px] text-brand-neutral-6">
                            {activity.metadata.buyer_name}
                            {activity.metadata.quantity && ` · ${activity.metadata.quantity} ticket${activity.metadata.quantity > 1 ? 's' : ''}`}
                            {activity.metadata.amount && ` · ₦${Number(activity.metadata.amount).toLocaleString()}`}
                        </p>
                    )}

                    {eventId && (
                        <Link
                            href={NAVIGATION_LINKS.MY_EVENTS.href}
                            className="inline-flex items-center gap-1 text-xs text-brand-primary-6 hover:text-brand-primary-7 font-semibold mt-1"
                        >
                            View Event
                            <Icon icon="hugeicons:arrow-right-01" className="w-3 h-3" />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}