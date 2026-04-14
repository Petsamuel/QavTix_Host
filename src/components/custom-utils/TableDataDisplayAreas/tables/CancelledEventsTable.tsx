import { usePagination } from "@/custom-hooks/PaginationHook"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import { mockUpcomingEvents } from "@/components-data/demo-data"
import { Icon } from "@iconify/react"
import EventInfo from "../../event/EventInfo"
import { Checkbox } from "@/components/ui/checkbox"
import { Dispatch, SetStateAction } from "react"
import { myEventsStatusConfig } from "../resources/status-config"
import EventsItemsDropdown from "../../dropdown/ItemActionDropdown"
import { endedEventActions } from "../../dropdown/resources/events-actions"

interface EventsManagementTableProps {
    setSelectedEvents: Dispatch<SetStateAction<string[]>>
    selectedEvents: string[]
}

export default function CancelledEventsTable({ 
    setSelectedEvents, 
    selectedEvents 
}: EventsManagementTableProps) {

    const pagination = usePagination(mockUpcomingEvents, 5)

    const isAllSelected = pagination.currentItems.length > 0 && 
        pagination.currentItems.every(event => selectedEvents.includes(event.id))

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedEvents([])
        } else {
            const allIds = pagination.currentItems.map(e => e.id)
            setSelectedEvents(allIds)
        }
    }

    const handleSelectEvent = (eventId: string) => {
        setSelectedEvents(prev => {
            if (prev.includes(eventId)) {
                return prev.filter(id => id !== eventId)
            } else {
                return [...prev, eventId]
            }
        })
    }

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden!">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="w-12 py-4 px-4">
                                    <Checkbox
                                        checked={isAllSelected}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event Name</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Date & Time</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Location</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Tickets Sold</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Revenue</th>
                                <th className="w-12 py-4 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-5 bg-white">
                            {pagination.currentItems.map((event) => {
                                const isSelected = selectedEvents.includes(event.id)                                
                                return (
                                    <tr 
                                        key={event.id} 
                                        className={cn(
                                            "hover:bg-brand-neutral-3/70 transition-colors cursor-pointer",
                                            isSelected && "bg-brand-primary-1 hover:bg-brand-primary-1"
                                        )}
                                        onClick={() => handleSelectEvent(event.id)}
                                    >
                                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => handleSelectEvent(event.id)}
                                            />
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Icon icon="mdi:circle" className={cn('w-2 h-2 text-brand-secondary-7')} />
                                                <span className={cn('text-xs font-medium text-brand-secondary-7')}>
                                                    Cancelled
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <EventInfo 
                                                variant="desktop"
                                                category={event.category}
                                                image={event.image}
                                                title={event.title}
                                            />
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex flex-col text-xs text-brand-secondary-9">
                                                <span>{event.date} | {event.time}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-[11px] text-brand-secondary-6 max-w-[15em]">
                                                {event.location}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <div className="flex flex-col text-[11px]">
                                                <span className="text-brand-secondary-9">
                                                    {event.ticketsSold}/{event.totalTickets}
                                                </span>
                                                <span className="text-brand-secondary-6">
                                                    <span className="font-bold">Views:</span> {event.ticketsSold * 4} | <span className="font-bold">Saves:</span> {Math.floor(event.ticketsSold / 2)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-bold text-brand-secondary-9 whitespace-nowrap">
                                                ₦{event.revenue.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                                            <EventsItemsDropdown actions={endedEventActions} eventId="" />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {pagination.currentItems.map((event) => {
                    const isSelected = selectedEvents.includes(event.id)
                    const status = myEventsStatusConfig[event.status as keyof typeof myEventsStatusConfig] || myEventsStatusConfig['draft']
                    
                    return (
                        <div 
                            key={event.id} 
                            className={cn(
                                "border-b border-brand-neutral-5 py-3",
                                isSelected && "bg-brand-primary-1 border-brand-primary-3"
                            )}
                        >
                            <div className="space-y-3">
                                {/* First Row - Status, Saves, Views, Menu */}
                                <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-neutral-2">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            checked={isSelected}
                                            onCheckedChange={() => handleSelectEvent(event.id)}
                                        />
                                        <div className="flex items-center gap-1 whitespace-nowrap">
                                            <Icon icon="mdi:circle" className={cn('w-2 h-2 text-brand-secondary-7')} />
                                            <span className={cn('text-[11px] font-medium text-brand-secondary-7')}>
                                                Cancelled
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold">Saves:</span>
                                        <span>{Math.floor(event.ticketsSold / 2)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold">Views:</span>
                                        <span>{event.ticketsSold * 4}</span>
                                    </div>
                                    <EventsItemsDropdown actions={endedEventActions} eventId="" />
                                </div>

                                {/* Second Row - EventInfo & Date/Time */}
                                <div className="flex items-start justify-between gap-3">
                                    <EventInfo 
                                        variant="mobile"
                                        category={event.category}
                                        image={event.image}
                                        title={event.title}
                                    />
                                    <div className="flex flex-col text-xs text-brand-secondary-9">
                                        <span className="font-bold">Date & Time</span>
                                        <span>{event.time} | {event.date}</span>
                                    </div>
                                </div>

                                {/* Third Row - Tickets Sold & Revenue */}
                                <div className="flex justify-between items-center text-xs pt-2 border-t border-brand-neutral-2">
                                    <div className="flex items-center gap-1 text-brand-secondary-9">
                                        <span className="font-bold">Tickets Sold:</span>
                                        <span className="font-normal">{event.ticketsSold}/{event.totalTickets}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-brand-secondary-9">
                                        <span className="font-bold">Revenue:</span>
                                        <span className="font-semibold">₦{event.revenue.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Fourth Row - Location */}
                                <div className="text-[11px] text-brand-secondary-6">
                                    <div className="flex items-start gap-1">
                                        <Icon icon="lucide:map-pin" className="w-3 h-3 mt-0.5 shrink-0" />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                endIndex={pagination.endIndex}
                startIndex={pagination.startIndex}
                totalItems={mockUpcomingEvents.length}
                className="justify-center"
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
                onNextPage={pagination.nextPage}
                onPreviousPage={pagination.previousPage}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
            />
        </div>
    )
}