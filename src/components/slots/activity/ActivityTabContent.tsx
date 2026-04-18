'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import RecentActivityItem from './RecentActivityItem'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select'
import Link from 'next/link'

interface RecentActivityTabProps {
    activities: DashboardActivity[]
}

const FILTER_OPTIONS: { label: string; value: ActivityType }[] = [
    { label: "Sales",        value: "sale"            },
    { label: "Check-ins",    value: "checkin"         },
    { label: "Refunds",      value: "refund"          },
    { label: "Withdrawals",  value: "withdrawal"      },
]

const PREVIEW_COUNT = 4

export default function RecentActivityTab({ activities }: RecentActivityTabProps) {
    const [filterValue, setFilterValue] = useState<string>("")

    const filtered = filterValue
        ? activities.filter(a => a.activity_type === filterValue)
        : activities

    const preview = filtered.slice(0, PREVIEW_COUNT)

    return (
        <div className="space-y-2 w-full">
            <div className="flex items-center justify-between px-4">
                <Select
                    value={filterValue}
                    onValueChange={(v) => setFilterValue(v === filterValue ? "" : v)}
                >
                    <SelectTrigger
                        className={cn(
                            "border-brand-neutral-8 font-medium disabled:cursor-not-allowed disabled:opacity-65 text-xs w-fit bg-white rounded-lg border-neutral-4 hover:border-brand-neutral-5 focus:border-brand-primary-6",
                        )}
                    >
                        <Icon icon="hugeicons:sliders-horizontal" width="24" height="24" className="shrink-0" />
                        <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        {FILTER_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 px-4">
                {preview.length > 0 ? (
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

            {filtered.length > PREVIEW_COUNT && (
                <div className="px-4 pt-1 pb-2">
                    <Link
                        href="/dashboard/activity"
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