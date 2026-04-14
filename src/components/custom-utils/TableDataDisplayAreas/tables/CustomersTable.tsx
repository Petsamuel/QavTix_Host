import { Icon } from "@iconify/react"
import { customerListStatusConfig } from "../resources/status-config"
import { cn } from "@/lib/utils"
import PaginationControls from "../tools/PaginationControl"
import { formatDateTime } from "@/helper-fns/date-utils"
import UserInfo from "../../users/UserInfo"
import EmptyTicketsState from "../empty-state"
import { v4 as randomUUID} from "uuid"
import TableLoader from "@/components/loaders/TableLoader"
import { useEffect, useState } from "react"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import ItemActionDropdown from "../../dropdown/ItemActionDropdown"
import { buildCustomerActions } from "../../dropdown/resources/customer-actions"
import { useRouter } from "next/navigation"

interface CustomersTableProps {
    items:          Customer[]
    isLoading:      boolean
    isLoadingMore:  boolean
    hasNext:        boolean
    count:          number
    onLoadMore:     () => void
    isEmpty:        boolean
    isError:        boolean
    search:         string
    // Pagination
    currentPage:    number
    totalPages:     number
    fetchPage:      (page: number) => void
}

export default function CustomersTable({
    items,
    isLoading,
    isLoadingMore,
    isError,
    search,
    currentPage,
    totalPages,
    fetchPage,
    count,
}: CustomersTableProps) {

    if (isLoading) {
        return (
            <TableLoader className="my-0" />
        )
    }

    if (isError) {
        return (
            <div className="w-full flex flex-col items-center justify-center py-20 gap-2">
                <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
                <p className="text-sm text-brand-secondary-6">Failed to load customers.</p>
            </div>
        )
    }

    if (!items.length) {
        if (search) return (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="p-3 rounded-full bg-brand-neutral-2">
                    <Icon icon="mage:search" className="size-6 text-brand-neutral-6" />
                </div>
                <p className="text-sm font-medium text-brand-secondary-8">
                    No results for &ldquo;{search}&rdquo;
                </p>
                <p className="text-xs text-brand-secondary-5">
                    Try a different query or clear the search
                </p>
            </div>
        )

        return (
            <div className="my-10">
                <EmptyTicketsState
                    title="No Customers"
                    text="You don't have any customers yet"
                />
            </div>
        )
    }

    const isMounted = useIsMounted()
    const router = useRouter()

    return (
        <div className="w-full space-y-4">
            {/* Desktop Table */}
            <div className="hidden md:block border border-brand-neutral-2 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Status</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Profile Info</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Address</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Attended</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Total Spend</th>
                                <th className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">Last Purchase</th>
                                <th className="w-12 py-4 px-4" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2 bg-white">
                            {items.map((customer) => {
                                const status = customerListStatusConfig[customer.status as keyof typeof customerListStatusConfig]

                                return (
                                    <tr
                                        key={`${randomUUID()}-${customer.user_id}`}
                                        className="hover:bg-brand-neutral-3/70 transition-colors"
                                    >
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-1 whitespace-nowrap">
                                                <Icon icon="mdi:circle" className={cn("w-2 h-2", status?.color)} />
                                                <span className={cn("text-xs font-medium", status?.color)}>
                                                    {status?.label}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            {
                                                isMounted &&
                                                <UserInfo user={{...customer, id: customer.user_id as number || randomUUID()}} variant="desktop" />
                                            }
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-6 min-w-37 max-w-37">
                                                {customer.address}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <p className="text-sm font-medium text-brand-secondary-9 whitespace-nowrap">
                                                {customer.events_attended}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                                {customer.total_spent}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {formatDateTime(customer.last_purchase_date)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <ItemActionDropdown actions={buildCustomerActions(customer.user_id || "", router)} />
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
                {items.map((customer) => {
                    const status = customerListStatusConfig[customer.status as keyof typeof customerListStatusConfig]

                    return (
                        <div
                            key={`${randomUUID()}-${customer.user_id}`}
                            className="border border-brand-neutral-3 rounded-lg p-3"
                        >
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                                    <div className={cn(
                                        "flex items-center gap-1 px-2 py-0.5 rounded-full bg-opacity-10",
                                        status?.color
                                    )}>
                                        <Icon icon="mdi:circle" className={cn("w-1.5 h-1.5", status?.color)} />
                                        <span className={cn("text-xs font-medium capitalize", status?.color)}>
                                            {status?.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-brand-secondary-9">
                                        <span className="flex items-center gap-1">
                                            <span className="font-bold capitalize">Spent:</span>
                                            {customer.total_spent}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="font-bold capitalize">Attended:</span>
                                            {customer.events_attended}
                                        </span>
                                    </div>
                                </div>

                                <div className="shrink-0">
                                    <ItemActionDropdown actions={buildCustomerActions(customer.user_id || "", router)} />
                                </div>
                            </div>

                            <div className="flex items-start flex-wrap justify-between gap-3 mb-4">
                                {
                                    isMounted &&
                                    <UserInfo user={{...customer, id: customer.user_id as number || randomUUID()}} variant="mobile" className="shrink-0" />
                                }
                                <div className="flex flex-col gap-1 text-[11px] text-brand-secondary-9">
                                    <span className="font-bold">Last Purchase:</span>
                                    <span>{formatDateTime(customer.last_purchase_date)}</span>
                                </div>
                            </div>

                            <p className="text-[11px] text-brand-secondary-6">{customer.address}</p>
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