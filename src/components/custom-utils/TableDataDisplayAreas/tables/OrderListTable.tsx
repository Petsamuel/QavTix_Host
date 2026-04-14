import Image from "next/image"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"
import { formatDateTime } from "@/helper-fns/date-utils"
import PaginationControls from "../tools/PaginationControl"
import TableLoader from "@/components/loaders/TableLoader"

interface OrderListTableProps {
    items:         CustomerOrder[]
    isLoading:     boolean
    isLoadingMore: boolean
    hasNext:       boolean
    count:         number
    onLoadMore:    () => void
    isEmpty:       boolean
    isError:       boolean
    search:        string
    currentPage:   number
    totalPages:    number
    fetchPage:     (page: number) => void
}

const statusStyle: Record<string, string> = {
    completed: "text-postive-default bg-green-50",
    pending:   "text-amber-600 bg-amber-50",
    cancelled: "text-brand-secondary-4 bg-brand-secondary-1",
}

export default function OrderListTable({
    items, isLoading, isLoadingMore, isEmpty, isError,
    search, count, currentPage, totalPages, fetchPage,
}: OrderListTableProps) {

    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load orders.</p>
        </div>
    )

    if (isEmpty || items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:package-open" className="w-8 h-8 text-brand-neutral-5" />
            <p className="text-sm text-brand-secondary-6">
                {search ? `No orders found for "${search}"` : "No orders yet."}
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
                                {["Event ID", "Event", "Purchase Date", "Quantity", "Amount", "Status"].map(h => (
                                    <th key={h} className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map(order => (
                                <tr key={order.order_id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-9 truncate max-w-24">{order.event_id}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-10 aspect-square rounded-md overflow-hidden shrink-0">
                                                <Image src={order.event_image} alt={order.event_name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-xs text-brand-secondary-9">{order.event_name}</p>
                                                <p className="text-[11px] text-brand-secondary-8">{order.event_category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs text-brand-secondary-8 whitespace-nowrap">{formatDateTime(order.purchase_date)}</p>
                                    </td>
                                    <td className="py-4 px-5 text-center">
                                        <p className="text-xs font-semibold text-brand-secondary-9">{order.quantity}</p>
                                    </td>
                                    <td className="py-4 px-5">
                                        <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                            ₦{parseFloat(order.amount).toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <Badge className={cn("p-2 rounded-md border-[0.8px] capitalize border-neutral-4", statusStyle[order.status] ?? "")}>
                                            {order.status}
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
                {items.map(order => (
                    <div key={order.order_id} className="border-b border-brand-neutral-5 p-4 space-y-2.5">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-1 items-center text-brand-secondary-9 text-[11px]">
                                <span className="font-bold">Amount:</span>
                                <span>₦{parseFloat(order.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex gap-1 items-center text-brand-secondary-9 text-[11px]">
                                <span className="font-bold">Qty:</span>
                                <span>{order.quantity}</span>
                            </div>
                            <Badge className={cn("p-1 text-[11px] rounded-sm capitalize border-[0.8px] border-neutral-4", statusStyle[order.status] ?? "")}>
                                {order.status}
                            </Badge>
                        </div>
                        <div className="flex gap-2 justify-between">
                            <div className="flex items-start gap-2">
                                <div className="relative size-12 rounded-lg overflow-hidden shrink-0">
                                    <Image src={order.event_image} alt={order.event_name} fill className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-xs text-brand-secondary-9 mb-1">{order.event_name}</h3>
                                    <p className="text-xs text-brand-neutral-6">{order.event_category}</p>
                                </div>
                            </div>
                            <div className="flex flex-col text-brand-secondary-8 shrink-0">
                                <span className="text-xs font-bold">Purchase Date:</span>
                                <span className="text-xs">{formatDateTime(order.purchase_date)}</span>
                            </div>
                        </div>
                        <p className="text-xs text-brand-secondary-9">
                            <span className="font-bold">Event ID: </span>{order.event_id}
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
            />
        </div>
    )
}