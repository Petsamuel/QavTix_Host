'use client'

import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

const NOTIFICATION_DOT_COLOR: Record<string, string> = {
    sale: 'bg-blue-600',
    refund: 'bg-red-500',
    checkin: 'bg-green-500',
    withdrawal: 'bg-emerald-500',
    ticket_transfer: 'bg-purple-500',
    system: 'bg-blue-500',
}

interface NotificationItemProps {
    notification: DashboardNotification
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    const dotColor = NOTIFICATION_DOT_COLOR[notification.notification_type] ?? 'bg-blue-500'
    const isUnread = !notification.is_read
    const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })

    return (
        <div className={cn(
            "rounded-[16px] shadow-[0px_4px_16px_rgba(0,0,0,0.04)] border p-4 mb-3 flex flex-col gap-2 transition-colors",
            isUnread ? "bg-brand-primary-1 border-brand-primary-2/50 hover:bg-brand-primary-2/50" : "bg-white border-brand-neutral-2 hover:border-brand-neutral-3 hover:bg-brand-neutral-50"
        )}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", dotColor)} />
                    <span className="text-xs font-medium text-brand-neutral-7">{notification.title}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-brand-neutral-6">
                    <Icon icon="hugeicons:clock-01" className="w-3.5 h-3.5 text-orange-400" />
                    <span>{timeAgo}</span>
                </div>
            </div>
            <p className="text-[13px] font-semibold text-brand-secondary-9">
                {notification.message}
            </p>
        </div>
    )
}