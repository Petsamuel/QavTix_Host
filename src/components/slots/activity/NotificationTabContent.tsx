'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import NotificationItem from './NotificationItem'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { markNotificationsAsRead } from '@/actions/dashboard/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import { cn } from '@/lib/utils'
import { useTransition } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useState, useEffect } from 'react'

interface NotificationsTabProps {
    notifications: DashboardNotification[]
}

const PREVIEW_COUNT = 4

const FILTER_OPTIONS: { label: string; value: ActivityType }[] = [
    { label: "Sales", value: "sale" },
    { label: "Check-ins", value: "checkin" },
    { label: "Refunds", value: "refund" },
    { label: "Withdrawals", value: "withdrawal" },
    { label: "System", value: "system" },
]

export default function NotificationsTab({ notifications }: NotificationsTabProps) {
    const hasUnread = notifications.some(n => !n.is_read)
    const pathName = usePathname()
    const showAll = pathName.includes("/all-activities")
    const preview = showAll ? notifications : notifications.slice(0, PREVIEW_COUNT)
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [isFiltering, startFiltering] = useTransition()

    const filterValue = searchParams.get('notification_type') || ""
    const [optimisticFilter, setOptimisticFilter] = useState(filterValue)
    const isCompletelyEmpty = notifications.length === 0 && !filterValue

    // Keep optimistic value in sync with URL when not actively filtering
    useEffect(() => {
        if (!isFiltering) {
            setOptimisticFilter(filterValue)
        }
    }, [filterValue, isFiltering])

    const handleFilterChange = (v: string) => {
        const newValue = v === filterValue ? "" : v;
        setOptimisticFilter(newValue); // Update UI immediately

        const params = new URLSearchParams(searchParams.toString());
        if (newValue) {
            params.set('notification_type', newValue);
        } else {
            params.delete('notification_type');
        }
        startFiltering(() => {
            router.push(`${pathName}?${params.toString()}`, { scroll: false });
        })
    }

    const handleMarkAllRead = () => {
        startTransition(async () => {
            await markNotificationsAsRead()
        })
    }

    return (
        <div className="space-y-4 px-4">
            {!isCompletelyEmpty && (
                <div className="flex items-center justify-between">
                    <Select
                        value={optimisticFilter}
                        onValueChange={handleFilterChange}
                    >
                        <SelectTrigger
                            className={cn(
                                "border-brand-neutral-8 font-medium disabled:cursor-not-allowed disabled:opacity-65 text-xs w-fit bg-white rounded-lg border-neutral-4 hover:border-brand-neutral-5 focus:border-brand-primary-6",
                            )}
                        >
                            <Icon icon="hugeicons:sliders-horizontal" width="24" height="24" className="shrink-0" />
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent className='z-999'>
                            {FILTER_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasUnread && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={isPending}
                            className="text-xs text-brand-primary-6 hover:text-brand-primary-7 font-bold transition-colors disabled:opacity-50"
                        >
                            {isPending ? "Marking..." : "Mark all as read"}
                        </button>
                    )}
                </div>
            )}

            <div className="space-y-3">
                {isFiltering ? (
                    Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
                        <Skeleton key={i} className="h-[72px] bg-brand-neutral-4 w-full rounded-xl" />
                    ))
                ) : preview.length > 0 ? (
                    preview.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <Icon icon="hugeicons:notification-02" className="w-12 h-12 text-brand-neutral-6 mx-auto mb-3" />
                        <p className="text-sm text-brand-neutral-7">No notifications</p>
                    </div>
                )}
            </div>

            {!isCompletelyEmpty && notifications.length >= 10 && !pathName.includes("/all-activities") && (
                <Link
                    href="/dashboard/all-activities"
                    className="text-xs flex items-center gap-1 text-brand-primary-6 hover:text-brand-primary-7 font-bold transition-colors"
                >
                    <span>View All Notifications</span>
                    <Icon icon="humbleicons:arrow-right" width="20" height="20" />
                </Link>
            )}
        </div>
    )
}