'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import NotificationItem from './NotificationItem'

interface NotificationsTabProps {
    notifications: DashboardNotification[]
}

const PREVIEW_COUNT = 4

export default function NotificationsTab({ notifications }: NotificationsTabProps) {
    const hasUnread = notifications.some(n => !n.is_read)
    const preview   = notifications.slice(0, PREVIEW_COUNT)

    return (
        <div className="space-y-4 px-4">
            {hasUnread && (
                <div className="flex items-center justify-between">
                    <button className="text-xs text-brand-primary-6 hover:text-brand-primary-7 font-bold transition-colors">
                        Mark all as read
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {preview.length > 0 ? (
                    preview.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <Icon icon="hugeicons:notification-02" className="w-12 h-12 text-brand-neutral-4 mx-auto mb-3" />
                        <p className="text-sm text-brand-neutral-6">No notifications</p>
                    </div>
                )}
            </div>

            {notifications.length > PREVIEW_COUNT && (
                <Link
                    href="/dashboard/notifications"
                    className="text-xs flex items-center gap-1 text-brand-primary-6 hover:text-brand-primary-7 font-bold transition-colors"
                >
                    <span>View All Notifications</span>
                    <Icon icon="humbleicons:arrow-right" width="20" height="20" />
                </Link>
            )}
        </div>
    )
}