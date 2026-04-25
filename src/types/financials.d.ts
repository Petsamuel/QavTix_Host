interface FinancialCards {
    total_revenue: string
    total_payout: string
    available_balance: string
    next_payout_date: string
}

interface PayoutAccount {
    id: string
    bank_name: string
    account_name: string
    account_number: string
}

interface WithdrawalHistoryItem {
    id: string
    amount: string
    status: string
    created_at: string
    updated_at: string
    payout_account: PayoutAccount
}

interface WithdrawalHistoryPaginated {
    results: WithdrawalHistoryItem[]
    count: number
    total_pages: number
    page: number
    next: string | null
    previous: string | null
}

interface FinancialData {
    cards: FinancialCards
    withdrawal_history: WithdrawalHistoryPaginated
}

interface GetFinancialsResult {
    success: boolean
    data?: FinancialData
    message?: string
}

interface FinancialsParams {
    date_range?: 'day' | 'week' | 'month' | 'year'
    start_date?: string
    end_date?: string
    page?: number
}


interface PayoutAccountItem {
    id: string
    bank_name: string
    account_name: string
    account_number: string
    is_default: boolean
    created_at: string
}

interface WithdrawPayload {
    amount: string
    payout_account_id: string
}

interface WithdrawResult {
    success: boolean
    message?: string
}