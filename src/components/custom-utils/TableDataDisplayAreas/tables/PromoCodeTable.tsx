import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { formatDate } from "@/helper-fns/date-utils"
import EventInfo from "../../event/EventInfo"
import PaginationControls from "../tools/PaginationControl"
import TableLoader from "@/components/loaders/TableLoader"

interface Props {
    items:         PromoCode[]
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

export default function PromoCodeListTable({
    items, isLoading, isEmpty, isError, search,
    count, currentPage, totalPages, fetchPage, isLoadingMore,
}: Props) {

    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load promo codes.</p>
        </div>
    )

    if (isEmpty || items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="hugeicons:discount-01" className="w-8 h-8 text-brand-neutral-5" />
            <p className="text-sm text-brand-secondary-6">
                {search ? `No promo codes found for "${search}"` : "No promo codes yet."}
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
                                {["Status", "Promo Code", "Event", "Discount", "Usage", "Revenue Impact", "Expiry Date"].map(h => (
                                    <th key={h} className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map(promo => (
                                <tr key={promo.id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-1 whitespace-nowrap">
                                            <Icon icon="mdi:circle" className={cn("w-2 h-2", promo.status === "ended" ? "text-red-600" : "text-green-600")} />
                                            <span className={cn("text-xs font-medium capitalize", promo.status === "ended" ? "text-red-600" : "text-green-600")}>
                                                {promo.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-bold text-brand-secondary-9">{promo.code}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <EventInfo
                                            variant="desktop"
                                            category={promo.event_category}
                                            image={promo.event_image}
                                            title={promo.event_name}
                                        />
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                            {promo.discount_percentage}%
                                        </p>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                            {promo.usage_count}/{promo.usage_limit}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold text-red-600 whitespace-nowrap">
                                            ₦{Math.abs(parseFloat(promo.revenue_impact)).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                            {formatDate(new Date(promo.expiry_date), "MMM d, yyyy | h:mm a")}
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
                {items.map(promo => (
                    <div key={promo.id} className="border-b border-brand-neutral-5 p-4 space-y-2.5">
                        <div className="flex flex-wrap gap-x-2 justify-between items-center text-[11px]">
                            <div className="flex items-center gap-1">
                                <Icon icon="mdi:circle" className={cn("w-2 h-2", promo.status === "ended" ? "text-red-600" : "text-green-600")} />
                                <span className={cn("font-medium capitalize", promo.status === "ended" ? "text-red-600" : "text-green-600")}>{promo.status}</span>
                            </div>
                            <span className="text-brand-secondary-9"><span className="font-bold">Impact: </span>₦{Math.abs(parseFloat(promo.revenue_impact)).toLocaleString()}</span>
                            <span className="text-brand-secondary-9"><span className="font-bold">Usage: </span>{promo.usage_count}/{promo.usage_limit}</span>
                        </div>
                        <div className="flex items-start gap-2 justify-between">
                            <EventInfo variant="mobile" category={promo.event_category} image={promo.event_image} title={promo.event_name} />
                            <div className="text-xs text-brand-secondary-9 text-right shrink-0">
                                <p className="font-bold">{promo.code}</p>
                                <p className="text-brand-neutral-6">{promo.discount_percentage}% off</p>
                            </div>
                        </div>
                        <p className="text-xs text-brand-secondary-8">
                            <span className="font-bold">Expiry: </span>{formatDate(new Date(promo.expiry_date), "MMM d, yyyy | h:mm a")}
                        </p>
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