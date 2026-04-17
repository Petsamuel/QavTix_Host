import { cn }              from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import { Icon }           from "@iconify/react"
import EventInfo          from "../../event/EventInfo"
import Link               from "next/link"
import { draftStatusConfig } from "../resources/status-config"
import { formatDateTime }    from "@/helper-fns/date-utils"
import TableLoader           from "@/components/loaders/TableLoader"
import EmptyTicketsState     from "../empty-state"
import { EDIT_DRAFT_EVENT } from "@/enums/navigation"

interface DraftedEventsTableProps {
    items:         OrganizerEvent[]
    isLoading:     boolean
    isLoadingMore: boolean
    isEmpty:       boolean
    isError:       boolean
    search:        string
    count:         number
    currentPage:   number
    totalPages:    number
    fetchPage:     (page: number) => void
    onDelete:      (id: string, name?: string) => void
    onPublish?:    (id: string, name?: string) => void
    deletingId:    string | null
}

export default function DraftedEventsTable({
    items, isLoading, isLoadingMore, isEmpty, isError, search,
    count, currentPage, totalPages, fetchPage,
    onDelete, onPublish, deletingId,
}: DraftedEventsTableProps) {

    const status = draftStatusConfig["unpublished" as keyof typeof draftStatusConfig]

    if (isLoading) return <TableLoader className="my-0" />

    if (isError) return (
        <div className="w-full flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load drafts.</p>
        </div>
    )

    if (isEmpty || !items.length) {
        if (search) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">No results for &ldquo;{search}&rdquo;</p>
                <p className="text-xs text-brand-secondary-5">Try a different query or clear the search</p>
            </div>
        )
        return (
            <div className="my-10">
                <EmptyTicketsState title="No Drafts" text="You don't have any draft events" />
            </div>
        )
    }

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Event Name</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Date & Time</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Location</th>
                                <th className="text-center py-4 px-5 text-sm font-semibold text-brand-secondary-8 whitespace-nowrap">Actions</th>
                                <th className="w-12 py-4 px-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map((event) => {
                                const isDeleting = deletingId === event.id
                                return (
                                    <tr key={event.id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Icon icon={status.icon} className={cn("w-2 h-2", status.color)} />
                                                <span className={cn("text-xs font-medium", status.color)}>{status.label}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <EventInfo variant="desktop" category={event.category} image={event.event_image?.image_url ?? ""} title={event.title} />
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-9 whitespace-nowrap">{formatDateTime(event.start_datetime)}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-[11px] text-brand-secondary-6 max-w-[15em]">{event.event_location}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="flex items-center justify-center gap-3">
                                                <Link
                                                    href={EDIT_DRAFT_EVENT.href.replace("[event_id]", event.id)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                                                >
                                                    Continue Editing
                                                    <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                                                </Link>
                                                {onPublish && (
                                                    <button
                                                        onClick={() => onPublish(event.id, event.title)}
                                                        className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                                                    >
                                                        <Icon icon="lucide:globe" className="w-4 h-4" />
                                                        Publish
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => onDelete(event.id, event.title)}
                                                disabled={isDeleting}
                                                className={cn(
                                                    "p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors",
                                                    isDeleting && "opacity-50 cursor-not-allowed"
                                                )}
                                            >
                                                {isDeleting
                                                    ? <Icon icon="eos-icons:three-dots-loading" className="size-4 text-red-600" />
                                                    : <Icon icon="streamline-ultimate:bin-1"     className="size-4 text-red-600" />
                                                }
                                            </button>
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
                    const isDeleting = deletingId === event.id
                    return (
                        <div key={event.id} className="border border-brand-neutral-3 rounded-lg p-4 bg-white">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 flex-wrap justify-between text-xs pb-2 border-b border-brand-neutral-2">
                                    <div className="flex items-center gap-1">
                                        <Icon icon={status.icon} className={cn("w-2 h-2", status.color)} />
                                        <span className={cn("font-medium", status.color)}>{status.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {onPublish && (
                                            <button
                                                onClick={() => onPublish(event.id, event.title)}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                                            >
                                                <Icon icon="lucide:globe" className="w-3.5 h-3.5" />
                                                Publish
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(event.id, event.title)}
                                            disabled={isDeleting}
                                            className={cn(
                                                "p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors",
                                                isDeleting && "opacity-50 cursor-not-allowed"
                                            )}
                                        >
                                            {isDeleting
                                                ? <Icon icon="eos-icons:three-dots-loading" className="w-4 h-4 text-red-600" />
                                                : <Icon icon="streamline-ultimate:bin-1"     className="w-4 h-4 text-red-600" />
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-start justify-between gap-3">
                                    <EventInfo variant="mobile" category={event.category} image={event.event_image?.image_url ?? ""} title={event.title} />
                                    <div className="flex flex-col text-xs text-brand-secondary-9">
                                        <span className="font-bold">Date & Time</span>
                                        <span>{formatDateTime(event.start_datetime)}</span>
                                    </div>
                                </div>
                                <div className="text-[11px] text-brand-secondary-6">
                                    <div className="flex items-start gap-1">
                                        <Icon icon="lucide:map-pin" className="w-3 h-3 mt-0.5 shrink-0" />
                                        <span>{event.event_location}</span>
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <Link
                                        href={EDIT_DRAFT_EVENT.href.replace("[event_id]", event.id)}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-primary-6 hover:text-brand-primary-7 transition-colors"
                                    >
                                        Continue Editing
                                        <Icon icon="lucide:arrow-right" className="w-4 h-4" />
                                    </Link>
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