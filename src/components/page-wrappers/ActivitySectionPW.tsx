'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import RecentActivityTab from '../slots/activity/ActivityTabContent'
import NotificationsTab from '../slots/activity/NotificationTabContent'

type TabType = 'activity' | 'notifications'

interface ActivitySectionPWProps {
    activities: DashboardActivity[]
    notifications: DashboardNotification[]
    follower_count: number
}

export default function ActivitySectionPW({
    activities,
    notifications,
    follower_count
}: ActivitySectionPWProps) {
    const [activeTab, setActiveTab] = useState<TabType>('activity')

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-neutral-2 overflow-hidden w-full">
            <div className="border-b border-brand-neutral-3">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('activity')}
                        className={cn(
                            "flex-1 px-6 py-4 text-sm md:text-[13px] font-bold transition-colors relative",
                            activeTab === 'activity'
                                ? "text-brand-primary-6"
                                : "text-brand-neutral-6 hover:text-neutral-8"
                        )}
                    >
                        Recent Activity
                        {activeTab === 'activity' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-6" />
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={cn(
                            "flex-1 px-6 py-4 text-sm md:text-[13px] font-bold transition-colors relative",
                            activeTab === 'notifications'
                                ? "text-brand-primary-6"
                                : "text-brand-neutral-6 hover:text-neutral-8"
                        )}
                    >
                        Notifications
                        {activeTab === 'notifications' && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-6" />
                        )}
                    </button>
                </div>
            </div>

            <div className="py-3 w-full">
                {activeTab === 'activity' ? (
                    <RecentActivityTab activities={activities} follower_count={follower_count} />
                ) : (
                    <NotificationsTab notifications={notifications} />
                )}
            </div>
        </div>
    )
}