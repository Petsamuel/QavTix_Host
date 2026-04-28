'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { AnimatedDialog } from '@/components/custom-utils/dialogs/AnimatedDialog'
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { space_grotesk } from '@/lib/fonts'
import RecentActivityTab from '../slots/activity/ActivityTabContent'
import NotificationsTab from '../slots/activity/NotificationTabContent'
import { getDashboardFeedClient as getDashboardFeed } from '@/actions/dashboard/client'

type TabType = 'activity' | 'notifications'

interface Props {
    initialActivities?: DashboardActivity[]
    initialNotifications?: DashboardNotification[]
    initialPage?: number
    initialHasMore?: boolean
}

export default function AllActivityNotificationsModal({
    initialActivities = [],
    initialNotifications = [],
    initialPage = 1,
    initialHasMore = false,
}: Props) {
    const router = useRouter()

    const [open, setOpen] = useState(true)
    const [activeTab, setActiveTab] = useState<TabType>('activity')

    const [activities, setActivities] = useState<DashboardActivity[]>(initialActivities)
    const [notifications, setNotifications] = useState<DashboardNotification[]>(initialNotifications)
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [hasMore, setHasMore] = useState(initialHasMore)
    const [isPending, startTransition] = useTransition()

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => router.back(), 300)
    }

    const handleLoadMore = () => {
        startTransition(async () => {
            const res = await getDashboardFeed({ page: currentPage + 1 })
            if (res.success && res.data) {
                setActivities(prev => [...prev, ...res.data!.activities])
                setNotifications(prev => [...prev, ...res.data!.notifications])
                setCurrentPage(currentPage + 1)
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
            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-brand-neutral-2">
                <DialogHeader>
                    <DialogTitle className={cn(space_grotesk.className, "text-lg font-bold text-brand-secondary-9")}>
                        {isActivityTab ? "All Activity" : "All Notifications"}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-brand-neutral-7">
                        {isActivityTab
                            ? "Full log of recent activity across your account"
                            : "All your recent notifications"
                        }
                    </DialogDescription>
                </DialogHeader>

                <button
                    onClick={handleClose}
                    className="text-brand-neutral-7/80 hover:text-brand-neutral-6"
                    aria-label="Close modal"
                >
                    <Icon icon="line-md:close-circle-filled" className="size-6" />
                </button>
            </div>

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
                    activities.length > 0
                        ? <RecentActivityTab activities={activities} />
                        : <EmptyState icon="hugeicons:clock-01" message="No activity found" />
                ) : (
                    notifications.length > 0
                        ? <NotificationsTab notifications={notifications} />
                        : <EmptyState icon="hugeicons:notification-02" message="No notifications yet" />
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
            {hasMore && !isPending && (
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