import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import UserInfo from "../../users/UserInfo"
import EventInfo from "../../event/EventInfo"
import { formatDateTime } from "@/helper-fns/date-utils"
import TableLoader from "@/components/loaders/TableLoader"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    checked_in: { label: "Checked In", color: "text-green-600" },
    pending:    { label: "Pending",    color: "text-amber-500" },
    invalid:    { label: "Invalid",    color: "text-red-500"   },
}

interface Props {
    items:         CheckInAttendee[]
    isLoading:     boolean
    isLoadingMore: boolean
    isEmpty:       boolean
    isError:       boolean
    search:        string
    count:         number
    currentPage:   number
    totalPages:    number
    fetchPage:     (page: number) => void
}

export default function AttendeeCheckInTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, count, currentPage, totalPages, fetchPage,
}: Props) {

    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load attendees.</p>
        </div>
    )

    if (isEmpty || items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="famicons:people-outline" className="w-8 h-8 text-brand-neutral-5" />
            <p className="text-sm text-brand-secondary-6">
                {search ? `No attendees found for "${search}"` : "No attendees yet."}
            </p>
        </div>
    )

    return (
        <div className="w-full space-y-4">
            {/* Desktop */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-2 border-b border-brand-neutral-3">
                            <tr>
                                {["Attendee", "Ticket ID", "Ticket Type", "Event", "Check-In Time", "Status"].map(h => (
                                    <th key={h} className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map(a => {
                                const status = STATUS_CONFIG[a.checkin_status] ?? { label: a.checkin_status, color: "text-brand-neutral-6" }
                                return (
                                    <tr key={a.issued_ticket_id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                        <td className="py-4 px-5">
                                            <UserInfo
                                                user={{ name: a.full_name, email: a.email, id: a.issued_ticket_id }}
                                                variant="desktop"
                                            />
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-6 font-mono">#{a.issued_ticket_id}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-sm font-semibold text-brand-secondary-9 whitespace-nowrap">{a.ticket_type}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <EventInfo
                                                variant="desktop"
                                                title={a.event_name}
                                                category={a.event_category}
                                                image={a.event_image}
                                            />
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {a.checked_in_at ? formatDateTime(a.checked_in_at) : "—"}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Icon icon="mdi:circle" className={cn("w-2 h-2", status.color)} />
                                                <span className={cn("text-xs font-medium capitalize", status.color)}>
                                                    {status.label}
                                                </span>
                                            </div>
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
                {items.map(a => {
                    const status = STATUS_CONFIG[a.checkin_status] ?? { label: a.checkin_status, color: "text-brand-neutral-6" }
                    return (
                        <div key={a.issued_ticket_id} className="border border-brand-neutral-3 rounded-lg p-4 bg-white space-y-3">
                            <div className="flex justify-between items-center text-xs pb-2 border-b border-brand-neutral-2">
                                <span className="text-brand-secondary-6 font-mono"><span className="font-bold text-brand-secondary-8">Ticket: </span>#{a.issued_ticket_id}</span>
                                <span className="font-semibold text-brand-secondary-9">{a.ticket_type}</span>
                            </div>
                            <div className="flex justify-between items-center gap-3">
                                <UserInfo
                                    user={{ name: a.full_name, email: a.email, id: a.issued_ticket_id }}
                                    variant="mobile"
                                    className="flex-1"
                                />
                                <div className="flex items-center gap-1 shrink-0">
                                    <Icon icon="mdi:circle" className={cn("w-2 h-2", status.color)} />
                                    <span className={cn("text-xs font-medium capitalize", status.color)}>{status.label}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-start gap-3 pt-2 border-t border-brand-neutral-2">
                                <EventInfo variant="mobile" title={a.event_name} category={a.event_category} image={a.event_image} />
                                <div className="text-right text-xs shrink-0">
                                    <span className="font-bold text-brand-secondary-8 block">Check-In:</span>
                                    <span className="text-brand-secondary-9">
                                        {a.checked_in_at ? formatDateTime(a.checked_in_at) : "—"}
                                    </span>
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