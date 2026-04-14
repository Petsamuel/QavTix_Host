import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatDateTime } from "@/helper-fns/date-utils"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import TableLoader from "@/components/loaders/TableLoader"

interface Props {
    items:         EmailCampaign[]
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

const statusStyle: Record<string, string> = {
    sent:     "text-green-600 bg-green-50",
    failed:   "text-red-600 bg-red-50",
    draft:    "text-amber-600 bg-amber-50",
    sending:  "text-blue-600 bg-blue-50",
}

export default function EmailCampaignListTable({
    items, isLoading, isEmpty, isError, search,
    count, currentPage, totalPages, fetchPage, isLoadingMore,
}: Props) {

    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load campaigns.</p>
        </div>
    )

    if (isEmpty || items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:mail" className="w-8 h-8 text-brand-neutral-5" />
            <p className="text-sm text-brand-secondary-6">
                {search ? `No campaigns found for "${search}"` : "No campaigns yet."}
            </p>
        </div>
    )

    return (
        <div className="w-full space-y-4 mt-5">
            {/* Desktop */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                {["Campaign", "Event", "Recipients", "Sent Date", "Open Rate", "Click Rate", "Status"].map(h => (
                                    <th key={h} className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map(campaign => (
                                <tr key={campaign.id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 max-w-[12em]">{campaign.campaign_name}</p>
                                        <p className="text-[11px] text-brand-secondary-6 truncate max-w-[12em]">{campaign.subject}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 aspect-square rounded-md overflow-hidden shrink-0">
                                                <Image src={campaign.event_image} alt={campaign.event_name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs text-brand-secondary-9">{campaign.event_name}</p>
                                                <p className="text-[11px] text-brand-secondary-8">{campaign.event_category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-medium text-brand-secondary-9">{campaign.recipients.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{campaign.sent_at ? formatDateTime(campaign.sent_at) : "---"}</p>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-semibold text-brand-secondary-9">
                                            {campaign.open_rate !== null ? `${campaign.open_rate}%` : "—"}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-semibold text-brand-secondary-9">
                                            {campaign.click_rate !== null ? `${campaign.click_rate}%` : "—"}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <Badge className={cn("px-2 py-1 text-[11px] rounded-sm border-[0.8px] capitalize border-neutral-4", statusStyle[campaign.status] ?? "")}>
                                            {campaign.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {items.map(campaign => (
                    <div key={campaign.id} className="border-b border-neutral-4 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-brand-secondary-8 truncate">{campaign.campaign_name}</p>
                                <p className="text-[11px] text-brand-secondary-6 truncate">{campaign.subject}</p>
                            </div>
                            <Badge className={cn("px-2 py-0.5 text-[11px] rounded-sm border-[0.8px] capitalize border-neutral-4 shrink-0", statusStyle[campaign.status] ?? "")}>
                                {campaign.status}
                            </Badge>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="relative size-8 rounded-sm overflow-hidden shrink-0">
                                <Image src={campaign.event_image} alt={campaign.event_name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-xs text-brand-secondary-9">{campaign.event_name}</p>
                                <p className="text-[11px] text-brand-secondary-8">{campaign.event_category}</p>
                            </div>
                            <div className="text-[11px] text-right shrink-0">
                                <p className="text-brand-secondary-8"><span className="font-bold">Open: </span>{campaign.open_rate !== null ? `${campaign.open_rate}%` : "—"}</p>
                                <p className="text-brand-secondary-8"><span className="font-bold">Click: </span>{campaign.click_rate !== null ? `${campaign.click_rate}%` : "—"}</p>
                            </div>
                        </div>
                        <div className="flex justify-between text-[11px] border-t border-brand-neutral-2 pt-2">
                            <span className="text-brand-secondary-8"><span className="font-bold">Sent: </span>{campaign.sent_at ? formatDateTime(campaign.sent_at) : "---"}</span>
                            <span className="text-brand-secondary-8"><span className="font-bold">Recipients: </span>{campaign.recipients.toLocaleString()}</span>
                        </div>
                    </div>
                ))}
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
                className="justify-center"
            />
        </div>
    )
}