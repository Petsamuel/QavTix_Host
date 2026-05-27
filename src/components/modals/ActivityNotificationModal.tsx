'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import { AnimatedDialog } from '@/components/custom-utils/dialogs/AnimatedDialog'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import RecentActivityTab from '../slots/activity/ActivityTabContent'
import NotificationsTab from '../slots/activity/NotificationTabContent'
import { getDashboardFeed } from '@/actions/dashboard/client'

type TabType = 'activity' | 'notifications'

interface Props {
    initialActivities?: DashboardActivity[]
    initialNotifications?: DashboardNotification[]
    initialPage?: number
    initialHasMore?: boolean
    follower_count?: number
}

export default function AllActivityNotificationsModal({
    initialActivities = [],
    initialNotifications = [],
    initialPage = 1,
    initialHasMore = false,
    follower_count = 0,
}: Props) {
    const router = useRouter()

    const [open, setOpen] = useState(true)
    const [activeTab, setActiveTab] = useState<TabType>('activity')

    const [activities, setActivities] = useState<DashboardActivity[]>(initialActivities)
    const [notifications, setNotifications] = useState<DashboardNotification[]>(initialNotifications)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isPending, startTransition] = useTransition()

    const searchParams = useSearchParams()

    useEffect(() => {
        setActivities(initialActivities)
        setNotifications(initialNotifications)
        setCurrentPage(initialPage)
        setHasMore(initialHasMore)
    }, [initialActivities, initialNotifications, initialPage, initialHasMore])

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => router.back(), 300)
    }

    const handleLoadMore = () => {
        startTransition(async () => {
            const params: any = { page: currentPage + 1 }
            if (searchParams.get('activity_type')) params.activity_type = searchParams.get('activity_type')
            if (searchParams.get('notification_type')) params.notification_type = searchParams.get('notification_type')
            
            const res = await getDashboardFeed(params)
            if (res.success && res.data) {
                if (res.data.activities?.length === 0 && res.data.notifications?.length === 0) {
                    setHasMore(false)
                } else {
                    setActivities(prev => [...prev, ...(res.data!.activities || [])])
                    setNotifications(prev => [...prev, ...(res.data!.notifications || [])])
                    setCurrentPage(currentPage + 1)
                }
            }
        })
    }

    const isActivityTab = activeTab === 'activity'

    return (
        <AnimatedDialog
            open={open}
            onOpenChange={(v) => { if (!v) handleClose() }}
            showCloseButton={false}
            className="md:max-w-md"
            childrenContainerStyles="px-0"
        >
            {/* Tabs */}
            <div className="border-b border-brand-neutral-3">
                <div className="flex">
                    {(['activity', 'notifications'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "flex-1 px-6 py-4 text-sm font-bold transition-colors relative",
                                activeTab === tab
                                    ? "text-brand-primary-6"
                                    : "text-brand-neutral-6 hover:text-neutral-8"
                            )}
                        >
                            {tab === 'activity' ? 'Recent Activity' : 'Notifications'}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-6" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2 px-6 pb-2 pt-3">
                {isActivityTab ? (
                    <RecentActivityTab activities={activities} follower_count={follower_count} />
                ) : (
                    <NotificationsTab notifications={notifications} />
                )}
            </div>

            {/* Load more skeleton */}
            {isPending && (
                <div className="space-y-2 px-6 pb-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 w-full rounded-lg bg-brand-neutral-5 animate-pulse" />
                    ))}
                </div>
            )}

            {/* Load more button — shared across both tabs since data comes from one endpoint */}
            {hasMore && !isPending && (isActivityTab ? activities.length > 0 : notifications.length > 0) && (
                <div className="px-6 pb-4 pt-1">
                    <button
                        onClick={handleLoadMore}
                        disabled={isPending}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold",
                            "border border-brand-neutral-3 text-brand-primary-6",
                            "hover:bg-brand-neutral-1 transition-colors",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        <span>Load More</span>
                        <Icon icon="hugeicons:arrow-down-01" className="w-4 h-4" />
                    </button>
                </div>
            )}
        </AnimatedDialog>
    )
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
    return (
        <div className="py-16 text-center">
            <Icon icon={icon} className="w-12 h-12 text-brand-neutral-6 mx-auto mb-3" />
            <p className="text-sm text-brand-neutral-7">{message}</p>
        </div>
    )
}