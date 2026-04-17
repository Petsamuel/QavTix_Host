"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDateTime } from "@/helper-fns/date-utils"
import UserInfo from "../../users/UserInfo"
import EventInfo from "../../event/EventInfo"
import PaginationControls from "../tools/PaginationControl"
import TableLoader from "@/components/loaders/TableLoader"
import { Icon } from "@iconify/react"

interface SalesPaymentsTableProps {
    transactions:  Transaction[]
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

export default function SalesPaymentsTable({
    transactions,
    count,
    currentPage,
    fetchPage, 
    hasNext,
    isEmpty,
    isError,
    isLoading,
    isLoadingMore,
    totalPages,
    search
}: SalesPaymentsTableProps) {


    if (isLoading) return <TableLoader />

    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load orders.</p>
        </div>
    )

    if (isEmpty || transactions.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:package-open" className="w-8 h-8 text-brand-neutral-5" />
            <p className="text-sm text-brand-secondary-6">
                {search ? `No orders found for "${search}"` : "No orders yet."}
            </p>
        </div>
    )


    return (
        <div className="w-full space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Payment ID</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Purchased By</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Event</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Purchase Date</th>
                                <th className="text-center py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Quantity</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Amount</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-5 bg-white">
                            {transactions.map((payment) => {
                                
                                return (
                                    <tr 
                                        key={payment.payment_id} 
                                        className={cn(
                                            "hover:bg-brand-accent-2/5 transition-colors cursor-pointer",
                                        )}
                                    >
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 font-medium">{payment.payment_id}</p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <UserInfo user={{ email: payment.purchased_by.email, name: payment.purchased_by.full_name, id: payment.payment_id }} variant="desktop" />
                                        </td>
                                        <td className="py-4 px-5 min-w-40">
                                            <EventInfo title={payment.event.name} {...payment.event} />
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {formatDateTime(payment.purchase_date)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5 text-center">
                                            <p className="text-xs font-semibold text-brand-secondary-9">
                                                {payment.quantity}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                                ₦{payment.amount.toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <Badge className={cn(
                                                "p-1.5 rounded-md text-[11px] border-[0.8px] capitalize border-neutral-4",
                                                payment.status === "successful" || payment.status === "completed" ? "text-postive-default bg-green-50" :
                                                payment.status === "failed" || payment.status === "cancelled" ? "text-brand-secondary-4 bg-brand-secondary-1" : ""
                                            )}>
                                                {payment.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards - unchanged as per your request */}
            <div className="md:hidden grid grid-cols-1 gap-3">
                {transactions.map((payment) => {
                    
                    return (
                        <div 
                            key={payment.payment_id} 
                            className={cn(
                                "border border-brand-neutral-3 rounded-lg p-2",
                            )}
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between gap-2 flex-wrap items-center text-xs text-brand-secondary-9 pb-2 border-b border-brand-neutral-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">Payment ID:</span>
                                        <span className="font-normal">{payment.payment_id}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold">Amount:</span>
                                            <span className="font-normal">₦{payment.amount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-bold">Qty:</span>
                                            <span className="font-normal">{payment.quantity}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <UserInfo user={{ email: payment.purchased_by.email, name: payment.purchased_by.full_name, id: payment.payment_id }} variant="desktop" />
                                    <Badge className={cn(
                                        "p-1 text-[11px] rounded-sm border-[0.8px] capitalize border-neutral-4 shrink-0",
                                        payment.status === "successful" ? "text-postive-default bg-green-50" :
                                        payment.status === "cancelled" ? "text-brand-secondary-4 bg-brand-secondary-1" : ""
                                    )}>
                                        {payment.status}
                                    </Badge>
                                </div>

                                <div className="flex items-start justify-between gap-3 pt-2 border-t border-brand-neutral-2">
                                    <EventInfo title={payment.event.name} {...payment.event} />
                                    <div className="flex flex-col text-right text-xs text-brand-secondary-9 shrink-0">
                                        <span className="font-bold">Purchase Date:</span>
                                        <span className="font-normal">
                                            {formatDateTime(payment.purchase_date)}
                                        </span>
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