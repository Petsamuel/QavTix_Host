import TableLoader from "@/components/loaders/TableLoader"
import { Icon } from "@iconify/react"
import EventInfo from "../../event/EventInfo"
import PaginationControls from "../tools/PaginationControl"

interface Props {
    items:         AffiliateLink[]
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

export default function AffiliateLeaderboardTable({
    items, isLoading, isEmpty, isError, search,
    count, currentPage, totalPages, fetchPage, isLoadingMore,
}: Props) {

    const getRankBadge = (rank: number) => {
        if (rank === 1) return "🥇"
        if (rank === 2) return "🥈"
        if (rank === 3) return "🥉"
        return rank
    }

    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load affiliates.</p>
        </div>
    )

    if (isEmpty || items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="famicons:people-outline" className="w-8 h-8 text-brand-neutral-5" />
            <p className="text-sm text-brand-secondary-6">
                {search ? `No affiliates found for "${search}"` : "No affiliates yet."}
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
                                {["Rank", "Affiliate", "Event", "Clicks", "Sales", "Conv. Rate", "Earnings"].map(h => (
                                    <th key={h} className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map(affiliate => (
                                <tr key={affiliate.id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <span className="text-xl">{getRankBadge(affiliate.rank)}</span>
                                    </td>
                                    <td className="py-4 px-5">
                                        <div>
                                            <p className="text-xs font-semibold text-brand-secondary-9">{affiliate.affiliate_name}</p>
                                            <p className="text-[11px] text-brand-secondary-6">{affiliate.affiliate_email}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <EventInfo variant="desktop" category={affiliate.category} image={affiliate.event_image} title={affiliate.event_name} />
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-9">{affiliate.clicks.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold text-brand-secondary-9">{affiliate.sales}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-9">{affiliate.conversion_rate}%</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold text-brand-secondary-9">
                                            ₦{parseFloat(affiliate.total_earnings).toLocaleString()}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {items.map(affiliate => (
                    <div key={affiliate.id} className="border-b border-brand-neutral-5 p-4 space-y-3">
                        <div className="flex justify-between text-[11px] pb-2 border-b border-brand-neutral-2">
                            <span className="text-brand-secondary-9"><span className="font-bold">Sales: </span>{affiliate.sales}</span>
                            <span className="text-brand-secondary-9"><span className="font-bold">Revenue: </span>₦{parseFloat(affiliate.total_earnings).toLocaleString()}</span>
                            <span className="text-brand-secondary-9"><span className="font-bold">Conv: </span>{affiliate.conversion_rate}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-lg shrink-0">{getRankBadge(affiliate.rank)}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-brand-secondary-9 truncate">{affiliate.affiliate_name}</p>
                                <p className="text-[11px] text-brand-secondary-6 truncate">{affiliate.affiliate_email}</p>
                            </div>
                            <div className="text-[11px] text-brand-secondary-9 shrink-0 text-right">
                                <span className="font-bold">Clicks: </span>{affiliate.clicks.toLocaleString()}
                            </div>
                        </div>
                        <EventInfo variant="mobile" category={affiliate.category} image={affiliate.event_image} title={affiliate.event_name} />
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