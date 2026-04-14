'use client'

import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

const NOTIFICATION_DOT_COLOR: Record<string, string> = {
    sale:            'bg-blue-500',
    refund:          'bg-red-500',
    checkin:         'bg-green-500',
    withdrawal:      'bg-emerald-500',
    ticket_transfer: 'bg-purple-500',
}

interface NotificationItemProps {
    notification: DashboardNotification
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    const dotColor = NOTIFICATION_DOT_COLOR[notification.notification_type] ?? 'bg-blue-500'
    const isUnread = !notification.is_read
    const timeAgo  = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })

    return (
        <div className={cn(
            "flex items-start gap-3 py-4 border-b border-brand-neutral-2 last:border-0 px-4 -mx-4 rounded-lg transition-colors cursor-pointer",
            isUnread ? "bg-blue-50/50 hover:bg-blue-50" : "hover:bg-brand-neutral-1"
        )}>
            <div className="flex items-center pt-1">
                {isUnread && (
                    <div className={cn("w-2 h-2 rounded-full", dotColor)} />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-[11px] text-brand-neutral-7 mb-1">
                    {notification.title}
                </p>
                <p className={cn(
                    "text-xs mb-0.5",
                    isUnread ? "text-brand-secondary-8 font-medium" : "text-brand-neutral-8 font-normal"
                )}>
                    {notification.message}
                </p>
            </div>

            <div className="flex items-center gap-1 text-xs text-brand-neutral-7 shrink-0">
                <Icon icon="hugeicons:clock-01" className="w-3.5 h-3.5 text-orange-400" />
                <span>{timeAgo}</span>
            </div>
        </div>
    )
}