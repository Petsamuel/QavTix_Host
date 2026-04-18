"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@iconify/react"
import { format, parseISO } from "date-fns"
import PaginationControls from "../tools/PaginationControl"
import { getFinancials } from "@/actions/financials"
import { payoutStatusConfig } from "../resources/status-config"
import TableLoader from "@/components/loaders/TableLoader"


interface Props {
    initialData:    WithdrawalHistoryPaginated
    externalDate:   DatePreset | null
    onCards:        (cards: FinancialCards) => void
    onCardsError:   () => void
    onCardsLoading: (loading: boolean) => void
    onCardsSuccess: () => void
}

export default function PayoutHistoryTable({
    initialData,
    externalDate,
    onCards,
    onCardsError,
    onCardsLoading,
    onCardsSuccess,
}: Props) {

    const [items,       setItems]       = useState<WithdrawalHistoryItem[]>(initialData.results)
    const [count,       setCount]       = useState(initialData.count)
    const [totalPages,  setTotalPages]  = useState(initialData.total_pages)
    const [currentPage, setCurrentPage] = useState(initialData.page)
    const [isLoading,   setIsLoading]   = useState(false)
    const [isError,     setIsError]     = useState(false)

    const isFetching    = useRef(false)

    const lastFetchedKey = useRef(externalDate) 
    const initialized = useRef(false)

    const fetchData = useCallback(async (page: number, isFilterChange = false) => {
        if (isFetching.current) return
        isFetching.current = true

        setIsLoading(true)
        if (isFilterChange) onCardsLoading(true)

        const result = await getFinancials({
            date_range: externalDate || undefined,
            page,
        })

        isFetching.current = false
        setIsLoading(false)
        if (isFilterChange) onCardsLoading(false)

        if (!result.success || !result.data) {
            setIsError(true)
            if (isFilterChange) onCardsError()
            return
        }

        const { cards, withdrawal_history: wh } = result.data

        setItems(wh.results)
        setCount(wh.count)
        setTotalPages(wh.total_pages)
        setCurrentPage(wh.page)
        setIsError(false)
        lastFetchedKey.current = externalDate

        if (isFilterChange) {
            onCards(cards)
            onCardsSuccess()
        }
    }, [externalDate])

    // Re-fetch when external date changes (skip first render)
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            return
        }

        if (externalDate !== lastFetchedKey.current) {
            lastFetchedKey.current = externalDate
            fetchData(1, true)
        }
        fetchData(1, true)
    }, [externalDate, fetchData])

    const fetchPage = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
        fetchData(page)
    }

    // Loading
    if (isLoading) return <TableLoader />

    // Error
    if (isError) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="lucide:wifi-off" className="w-8 h-8 text-red-400" />
            <p className="text-sm text-brand-secondary-6">Failed to load payment history.</p>
        </div>
    )

    // Empty
    if (items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Icon icon="hugeicons:wallet-done-01" className="w-8 h-8 text-brand-neutral-5" />
            <p className="text-sm text-brand-secondary-6">No payout history yet.</p>
        </div>
    )

    return (
        <div className="w-full space-y-4">

            {/* Desktop table */}
            <div className="hidden md:block overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-brand-neutral-3 border-b border-brand-neutral-3">
                            <tr>
                                {["Payment ID", "Bank Account", "Amount", "Payout Date", "Status"].map(h => (
                                    <th key={h} className="text-left py-4 px-5 text-sm font-semibold text-brand-secondary-8 capitalize whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-neutral-2">
                            {items.map(payout => {
                                const status = payoutStatusConfig[payout.status] ?? { label: payout.status, color: "" }
                                return (
                                    <tr key={payout.id} className="hover:bg-brand-neutral-3/70 transition-colors">
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-9 truncate max-w-32">
                                                {payout.id}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <div className="min-w-44">
                                                <p className="font-bold text-xs text-brand-secondary-9">
                                                    {payout.payout_account.account_name}
                                                </p>
                                                <p className="text-[11px] text-brand-secondary-8">
                                                    {payout.payout_account.bank_name} · {payout.payout_account.account_number}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs font-semibold text-brand-secondary-9 whitespace-nowrap">
                                                ₦{parseFloat(payout.amount).toLocaleString()}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <p className="text-xs text-brand-secondary-8 whitespace-nowrap">
                                                {format(parseISO(payout.created_at), "MMM d, yyyy | h:mm a")}
                                            </p>
                                        </td>
                                        <td className="py-4 px-5">
                                            <Badge className={cn(
                                                "px-3 py-1 rounded-md border-[0.8px] capitalize border-neutral-4 text-xs",
                                                status.color
                                            )}>
                                                {status.label}
                                            </Badge>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {items.map(payout => {
                    const status = payoutStatusConfig[payout.status] ?? { label: payout.status, color: "" }
                    return (
                        <div key={payout.id} className="border-b border-brand-neutral-5 p-4 space-y-2">

                            {/* Payment ID + status */}
                            <div className="flex justify-between items-center border-b border-brand-neutral-2 pb-2">
                                <span className="text-xs text-brand-secondary-9 truncate max-w-40">
                                    <span className="font-bold">ID: </span>{payout.id}
                                </span>
                                <Badge className={cn(
                                    "px-2 py-0.5 rounded-sm text-[11px] border-[0.8px] capitalize border-neutral-4",
                                    status.color
                                )}>
                                    {status.label}
                                </Badge>
                            </div>

                            {/* Bank info */}
                            <div>
                                <p className="font-bold text-xs text-brand-secondary-9">
                                    {payout.payout_account.account_name}
                                </p>
                                <p className="text-xs text-brand-secondary-8">
                                    {payout.payout_account.bank_name} · {payout.payout_account.account_number}
                                </p>
                            </div>

                            {/* Amount + date */}
                            <div className="flex justify-between items-center border-t border-brand-neutral-2 pt-2">
                                <div className="flex gap-1 items-center text-xs text-brand-secondary-9">
                                    <Icon icon="hugeicons:sale-tag-02" className="w-4 h-4 text-brand-primary-6" />
                                    <span className="font-bold">Amount: </span>
                                    <span>₦{parseFloat(payout.amount).toLocaleString()}</span>
                                </div>
                                <p className="text-[10px] text-brand-secondary-8">
                                    {format(parseISO(payout.created_at), "MMM d, yyyy")}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Pagination */}
            <PaginationControls
                currentPage={currentPage}
                isLoadingMore={isLoading}
                totalPages={totalPages}
                totalItems={count}
                startIndex={(currentPage - 1) * 10 + 1}
                endIndex={Math.min(currentPage * 10, count)}
                hasNextPage={currentPage < totalPages}
                hasPreviousPage={currentPage > 1}
                onNextPage={() => fetchPage(currentPage + 1)}
                onPreviousPage={() => fetchPage(currentPage - 1)}
            />
        </div>
    )
}