'use client'

import { useState, useTransition } from 'react'
import { Icon } from '@iconify/react'
import RecentActivityItem from './RecentActivityItem'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface RecentActivityTabProps {
    activities: DashboardActivity[]
    follower_count?: number
}

const FILTER_OPTIONS: { label: string; value: ActivityType }[] = [
    { label: "Sales", value: "sale" },
    { label: "Check-ins", value: "checkin" },
    { label: "Refunds", value: "refund" },
    { label: "Payouts", value: "withdrawal" },
]

const PREVIEW_COUNT = 4

export default function RecentActivityTab({ activities, follower_count }: RecentActivityTabProps) {
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()

    const filterValue = searchParams.get('activity_type') || ""

    const [isFiltering, startFiltering] = useTransition()

    const isCompletelyEmpty = activities.length === 0 && !filterValue
    const showAll = pathName.includes("/all-activities")
    const preview = showAll ? activities : activities.slice(0, PREVIEW_COUNT)

    const handleFilterChange = (v: string) => {
        const newValue = v === filterValue ? "" : v;
        const params = new URLSearchParams(searchParams.toString());
        if (newValue) {
            params.set('activity_type', newValue);
        } else {
            params.delete('activity_type');
        }
        startFiltering(() => {
            router.push(`${pathName}?${params.toString()}`, { scroll: false });
        })
    }

    return (
        <div className="space-y-2 w-full">
            <div className="flex items-center px-4 justify-between">
                <Select
                    value={filterValue}
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
                <Badge className='bg-brand-accent-1 text-brand-accent-7'>
                    {follower_count} Followers
                </Badge>
            </div>

            <div className="space-y-2 px-4">
                {isFiltering ? (
                    Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
                        <Skeleton key={i} className="h-[72px] bg-brand-neutral-4 w-full rounded-xl" />
                    ))
                ) : preview.length > 0 ? (
                    preview.map((activity) => (
                        <RecentActivityItem key={activity.id} activity={activity} />
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <Icon icon="hugeicons:clock-01" className="w-12 h-12 text-brand-neutral-6 mx-auto mb-3" />
                        <p className="text-sm text-brand-neutral-7">No recent activity</p>
                    </div>
                )}
            </div>

            {!isCompletelyEmpty && activities.length > PREVIEW_COUNT && !pathName.includes("/all-activities") && (
                <div className="px-4 pt-1 pb-2">
                    <Link
                        href="/dashboard/all-activities"
                        className="text-xs flex items-center gap-1 text-brand-primary-6 hover:text-brand-primary-7 font-bold transition-colors"
                    >
                        <span>View All Activity</span>
                        <Icon icon="humbleicons:arrow-right" width="20" height="20" />
                    </Link>
                </div>
            )}
        </div>
    )
}