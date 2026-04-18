import { cn }               from "@/lib/utils"
import PaginationControls  from "../tools/PaginationControl"
import { Icon }            from "@iconify/react"
import EventInfo           from "../../event/EventInfo"
import { Checkbox }        from "@/components/ui/checkbox"
import { Dispatch, SetStateAction } from "react"
import { liveEventsStatusConfig }   from "../resources/status-config"
import EventsItemDropdown  from "../../dropdown/ItemActionDropdown"
import { formatDateTime }   from "@/helper-fns/date-utils"
import TableLoader          from "@/components/loaders/TableLoader"
import EmptyTicketsState    from "../empty-state"
import { buildEndedEventActions, buildLiveEventActions } from "../../dropdown/resources/events-actions"
import { useRouter } from "next/navigation"


interface MyLiveEventsTableProps {
    items:          OrganizerEvent[]
    isLoading:      boolean
    isLoadingMore:  boolean
    isEmpty:        boolean
    isError:        boolean
    search:         string
    count:          number
    currentPage:    number
    totalPages:     number
    fetchPage:      (page: number) => void
    selectedEvents:    string[]
    setSelectedEvents: Dispatch<SetStateAction<string[]>>
}

export default function MyLiveEventsTable({
    items,
    isLoading,
    isLoadingMore,
    isEmpty,
    isError,
    search,
    count,
    currentPage,
    totalPages,
    fetchPage,
    selectedEvents,
    setSelectedEvents,
}: MyLiveEventsTableProps) {

    const router = useRouter()

    const isAllSelected =
        items.length > 0 && items.every(e => selectedEvents.includes(e.id))

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedEvents([])
        } else {
            setSelectedEvents(items.map(e => e.id))
        }
    }

    const handleSelectEvent = (id: string) => {
        setSelectedEvents(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    if (isLoading) return <TableLoader className="my-0" />

    if (isError) return (
        <div className="w-full flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load events.</p>
        </div>
    )

    if (isEmpty || !items.length) {
        if (search) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">
                    No results for &ldquo;{search}&rdquo;
                </p>
                <p className="text-xs text-brand-secondary-5">Try a different query or clear the search</p>
            </div>
        )
        return (
            <div className="my-10">
                <EmptyTicketsState title="No Live Events" text="You don't have any live events yet" />
            </div>
        )
    }

    const status = liveEventsStatusConfig["selling-fast" as keyof typeof liveEventsStatusConfig]
        ?? liveEventsStatusConfig["selling-fast"]

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="w-12 py-4 px-4">
                                    <Checkbox checked={isAllSelected} onCheckedChange={handleSelectAll} />
                                </th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Event Name</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Date & Time</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Location</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Tickets Sold</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Revenue</th>
                                <th className="w-12 py-4 px-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map((event) => {
                                const isSelected = selectedEvents.includes(event.id)
                                return (
                                    <tr
                                        key={event.id}
                                        onClick={() => handleSelectEvent(event.id)}
                                        className={cn(
                                            "hover:bg-brand-neutral-3/70 transition-colors cursor-pointer",
                                            isSelected && "bg-brand-primary-1 hover:bg-brand-primary-1"
                                        )}
                                    >
                                        <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                                            <Checkbox checked={isSelected} onCheckedChange={() => handleSelectEvent(event.id)} />
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Icon icon="mdi:circle" className={cn("w-2 h-2", status.color)} />
                                                <span className={cn("text-xs font-medium", status.color)}>{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <EventInfo
                                                variant="desktop"
                                                category={event.category}
                                                image={event.event_image?.image_url ?? ""}
                                                title={event.title}
                                            />
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-9 whitespace-nowrap">
                                                {formatDateTime(event.start_datetime)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-[11px] text-brand-secondary-6 max-w-[15em]">{event.event_location}</p>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <div className="flex flex-col text-[11px]">
                                                <span className="text-brand-secondary-9">
                                                    {event.tickets_sold}/{event.tickets_listed}
                                                </span>
                                                <span className="text-brand-secondary-6">
                                                    <span className="font-bold">Views:</span> {event.views_count} | <span className="font-bold">Saves:</span> {event.saves_count}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-bold text-brand-secondary-9 whitespace-nowrap">
                                                {event.tickets_total_revenue.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4" onClick={e => e.stopPropagation()}>
                                            {
                                                event.status === "draft" ?
                                                <p className="text-[10px]">See action on draft tab</p>
                                                :
                                                <EventsItemDropdown
                                                    eventName={event.title}
                                                    eventID={event.id} 
                                                    actions={
                                                        event.status !== "cancelled" && event.status !== "ended" && event.status !== "banned" && event.status !== "sold-out" ?
                                                        buildLiveEventActions(event.id, event.is_featured, router)
                                                        :
                                                        buildEndedEventActions(event.id, router)
                                                    } 
                                                />
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {items.map((event) => {
                    const isSelected = selectedEvents.includes(event.id)
                    return (
                        <div
                            key={event.id}
                            className={cn(
                                "border border-brand-neutral-3 rounded-lg p-2",
                                isSelected && "bg-brand-primary-1 border-brand-primary-3"
                            )}
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs pb-2 border-b border-brand-neutral-2">
                                    <div className="flex items-center gap-3">
                                        <Checkbox checked={isSelected} onCheckedChange={() => handleSelectEvent(event.id)} />
                                        <div className="flex items-center gap-1">
                                            <Icon icon="mdi:circle" className={cn("w-2 h-2", status.color)} />
                                            <span className={cn("font-medium", status.color)}>{status.label}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold">Saves:</span>
                                        <span>{event.saves_count}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold">Views:</span>
                                        <span>{event.views_count}</span>
                                    </div>
                                    {
                                        event.status === "draft" ?
                                        null
                                        :
                                        <EventsItemDropdown
                                            eventName={event.title}
                                            eventID={event.id} 
                                            actions={
                                                event.status !== "cancelled" && event.status !== "ended" && event.status !== "banned" && event.status !== "sold-out" ?
                                                buildLiveEventActions(event.id, event.is_featured, router)
                                                :
                                                buildEndedEventActions(event.id, router)
                                            } 
                                        />
                                    }
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <EventInfo
                                        variant="mobile"
                                        category={event.category}
                                        image={event.event_image?.image_url ?? ""}
                                        title={event.title}
                                    />
                                    <div className="flex flex-col text-xs text-brand-secondary-9">
                                        <span className="font-bold">Date & Time</span>
                                        <span>{formatDateTime(event.start_datetime)}</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs pt-2 border-t border-brand-neutral-2">
                                    <div className="flex items-center gap-1 text-brand-secondary-9">
                                        <span className="font-bold">Tickets Sold:</span>
                                        <span>{event.tickets_sold}/{event.tickets_listed}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-brand-secondary-9">
                                        <span className="font-bold">Revenue:</span>
                                        <span className="font-semibold">{event.tickets_total_revenue.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-[11px] text-brand-secondary-6">
                                    <div className="flex items-start gap-1">
                                        <Icon icon="lucide:map-pin" className="w-3 h-3 mt-0.5 shrink-0" />
                                        <span>{event.event_location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={count}
                startIndex={(currentPage - 1) * 10 + 1}
                endIndex={Math.min(currentPage * 10, count)}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
                isLoadingMore={isLoadingMore}
            />
        </div>
    )
}