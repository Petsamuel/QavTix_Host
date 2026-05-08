"use client"

import { useState, useRef } from "react"
import { DateRange } from "react-day-picker"
import { useAppSelector } from "@/lib/redux/hooks"
import MetricCardsContainer1 from "../cards/MetricCardsContainer1"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import MainWithdrawalComponent from "../custom-utils/withdrawal/MainWithdrawalComponent"
import PayoutHistoryTable from "../custom-utils/TableDataDisplayAreas/tables/PayoutHistory"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { mapFinancialCards } from "@/helper-fns/mapToStatCards"
import MetricsContainerLoader from "../loaders/MetricsContainerLoader"
import { useOnRevalidate } from "@/custom-hooks/UseRevalidate"
import { getFinancialsClient, getPayoutAccountsClient } from "@/actions/financials"

import FinancialPageLoader from "../loaders/FinancialPageLoader"
import DateRangePresetFilter from "../custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"

interface Props {
    initialCards: FinancialCards
    initialHistory: WithdrawalHistoryPaginated
    payoutAccounts: PayoutAccountItem[]
}

export default function FinancialsPageContentWrapper({
    initialCards,
    initialHistory,
    payoutAccounts: initialPayoutAccounts,
}: Props) {
    const { user } = useAppSelector(store => store.authUser)
    const currency = user?.currency || ""

    const [datePreset, setDatePreset] = useState<DatePreset | null>(null)

    const cardsRef = useRef<FinancialCards>(initialCards)
    const [cards, _setCards] = useState<FinancialCards>(initialCards)
    const [history, setHistory] = useState<WithdrawalHistoryPaginated>(initialHistory)
    const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccountItem[]>(initialPayoutAccounts)
    const [pageLoading, setPageLoading] = useState(false)
    const [cardsLoading, setCardsLoading] = useState(false)
    const [cardsError, setCardsError] = useState(false)

    const setCards = (next: FinancialCards) => {
        cardsRef.current = next
        _setCards(next)
    }

    useOnRevalidate("financials", async () => {
        setPageLoading(true)

        const [financialsResult, accountsResult] = await Promise.all([
            getFinancialsClient(),
            getPayoutAccountsClient(),
        ])

        setPageLoading(false)

        if (financialsResult.success && financialsResult.data) {
            setCards(financialsResult.data.cards)
            setHistory(financialsResult.data.withdrawal_history)
            setCardsError(false)
        } else {
            _setCards(cardsRef.current)
            setCardsError(true)
        }

        if (accountsResult.success && accountsResult.data) {
            setPayoutAccounts(accountsResult.data)
        }
    })

    const metrics = mapFinancialCards(cards, currency)

    if (pageLoading) return <FinancialPageLoader />

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <DateRangePresetFilter value={datePreset} onChange={setDatePreset} />
                <ExportButton1 showFormatSelector />
            </div>

            <div className="mb-8">
                {cardsLoading ? (
                    <MetricsContainerLoader />
                ) : (
                    <div>
                        <MetricCardsContainer1 metrics={metrics} />
                        {cardsError && (
                            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500">
                                <Icon icon="lucide:alert-triangle" className="w-3.5 h-3.5" />
                                <span>Could not refresh stats — showing last available data</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[22em_1fr] gap-6 mt-10 shadow-[0px_5.8px_23.17px_0px_#3326AE14] bg-white rounded-xl p-4 md:p-5">
                <MainWithdrawalComponent
                    availableBalance={cards.available_balance}
                    payoutAccounts={payoutAccounts}
                />
                <div className="min-w-0 border-t-[1.5px] md:border-t-0 md:border-l-[1.5px] border-dashed border-brand-neutral-5 pt-6 md:pt-0 md:ps-4">
                    <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                        Payment History
                    </h3>
                    <PayoutHistoryTable
                        initialData={history}
                        externalDate={datePreset}
                        onCards={setCards}
                        onCardsError={() => {
                            _setCards(cardsRef.current)
                            setCardsError(true)
                        }}
                        onCardsLoading={setCardsLoading}
                        onCardsSuccess={() => setCardsError(false)}
                    />
                </div>
            </div>
        </main>
    )
}