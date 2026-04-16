"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { eventPerformanceConfig } from "../resources/status-config"
import PaginationControls from "../tools/PaginationControl"


interface UpcomingEventsTableProps {
    items:         UpcomingEvent[]
    count:         number
    hasNext:       boolean
    isLoading:     boolean
    isLoadingMore: boolean
    onLoadMore:    () => void
    currentPage:   number
    totalPages:    number
    startIndex:    number
    endIndex:      number
    onFetchPage:   (page: number) => void
}

export default function UpcomingEventsTable({
    items, count, hasNext, isLoadingMore,
    isLoading, onLoadMore,
    currentPage, totalPages, startIndex, endIndex, onFetchPage,
}: UpcomingEventsTableProps) {

    if (isLoading && items.length === 0) {
        return (
            <div className="py-16 text-center text-sm text-brand-neutral-6">
                Loading events...
            </div>
        )
    }

    if (!isLoading && items.length === 0) {
        return (
            <div className="py-16 text-center">
                <Icon icon="hugeicons:calendar-02" className="w-12 h-12 text-brand-neutral-4 mx-auto mb-3" />
                <p className="text-sm text-brand-neutral-6">No events found</p>
            </div>
        )
    }

    return (
        <div className={cn("w-full space-y-4 transition-opacity duration-200", isLoading && "opacity-50 pointer-events-none")}>

            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                        <tr>
                            <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Performance</th>
                            <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Event Name</th>
                            <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Date & Time</th>
                            <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Location</th>
                            <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Tickets Sold</th>
                            <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Revenue</th>
                            <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-neutral-2">
                        {items.map((event) => {
                            const statusKey = event.performance as keyof typeof eventPerformanceConfig
                            const status    = eventPerformanceConfig[statusKey]
                            const dateLabel = format(new Date(event.start_datetime), "MMM dd, yyyy")
                            const timeLabel = format(new Date(event.start_datetime), "h:mm a")

                            return (
                                <tr key={event.id} className="hover:bg-brand-neutral-3 transition-colors border-b border-b-brand-neutral-5/90">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-1">
                                            <Icon icon="mdi:circle" className={cn("w-2 h-2", status.color)} />
                                            <span className={cn("text-xs font-medium whitespace-nowrap", status.color)}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 aspect-square rounded-md overflow-hidden shrink-0 bg-brand-neutral-2">
                                                {event.event_image?.image_url ? (
                                                    <Image
                                                        src={event.event_image?.image_url}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Icon icon="hugeicons:image-01" className="w-4 h-4 text-brand-neutral-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs text-brand-secondary-9">{event.title}</p>
                                                <p className="text-[11px] text-brand-secondary-8">{event.category}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-4">
                                        <p className="text-xs text-brand-secondary-8">{dateLabel} | {timeLabel}</p>
                                    </td>

                                    <td className="py-4 px-4">
                                        <p className="text-xs text-brand-secondary-6 max-w-50">{event.event_location}</p>
                                    </td>

                                    <td className="py-4 px-4">
                                        <p className="text-xs text-brand-secondary-9">
                                            {event.tickets_sold} of {event.tickets_listed} ({event.tickets_sold_percentage}%)
                                        </p>
                                    </td>

                                    <td className="py-4 px-4">
                                        <p className="text-sm font-medium text-brand-secondary-10">
                                            ₦{event.tickets_total_revenue.toLocaleString()}
                                        </p>
                                    </td>

                                    <td className="py-4 px-4">
                                        <Link href={`/events/${event.id}`}>
                                            <Button size="icon" variant="ghost" className="size-10 rounded-full bg-brand-primary-1 hover:bg-brand-primary-2">
                                                <span className="bg-brand-primary-4 rounded size-5 flex items-center justify-center text-white">
                                                    <Icon icon="iconamoon:edit-light" width="24" height="24" />
                                                </span>
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {items.map((event) => {
                    const statusKey = event.performance as keyof typeof eventPerformanceConfig
                    const status    = eventPerformanceConfig[statusKey]
                    const dateLabel = format(new Date(event.start_datetime), "MMM dd, yyyy")
                    const timeLabel = format(new Date(event.start_datetime), "h:mm a")

                    return (
                        <div key={event.id} className="border-b border-brand-neutral-5 w-full pb-4">
                            <div className="flex items-center gap-1 mb-3 justify-between text-[11px]">
                                <span className="flex items-center gap-0.5">
                                    <Icon icon="mdi:circle" className={cn("w-2 h-2", status.color)} />
                                    <span className={cn("font-medium", status.color)}>{status.label}</span>
                                </span>
                                <span className="font-bold text-brand-secondary-9">
                                    Tickets:{" "}
                                    <span className="font-normal">
                                        {event.tickets_sold}/{event.tickets_listed} ({event.tickets_sold_percentage}%)
                                    </span>
                                </span>
                                <Link href={`/events/${event.id}`}>
                                    <Button size="icon" variant="ghost" className="size-8 rounded-full bg-brand-primary-1 hover:bg-brand-primary-2">
                                        <span className="bg-brand-primary-4 rounded size-4 flex items-center justify-center text-white">
                                            <Icon icon="iconamoon:edit-light" width="24" height="24" />
                                        </span>
                                    </Button>
                                </Link>
                            </div>

                            <div className="flex justify-between items-start gap-4 w-full">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 aspect-square rounded-md overflow-hidden shrink-0 bg-brand-neutral-2">
                                        {event.event_image?.image_url ? (
                                            <Image
                                                src={event.event_image?.image_url}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Icon icon="hugeicons:image-01" className="w-4 h-4 text-brand-neutral-4" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-xs text-brand-secondary-9">{event.title}</p>
                                        <p className="text-[11px] text-brand-secondary-8">{event.category}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-brand-neutral-7 text-right max-w-32">{event.event_location}</p>
                            </div>

                            <div className="flex mt-2 justify-between items-center text-[11px] text-brand-secondary-9">
                                <p>{dateLabel} | {timeLabel}</p>
                                <div className="flex items-center gap-1">
                                    <span className="font-bold">Revenue:</span>
                                    <span>₦{event.tickets_total_revenue.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={count}
                currentPage={currentPage}
                isLoadingMore={isLoadingMore}
                totalPages={totalPages}
                hasNextPage={hasNext}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => onFetchPage(currentPage + 1)}
                onPreviousPage={() => onFetchPage(currentPage - 1)}
            />

            <p className="text-xs text-brand-neutral-5 text-right">
                Showing {startIndex}–{endIndex} of {count} events
            </p>
        </div>
    )
}