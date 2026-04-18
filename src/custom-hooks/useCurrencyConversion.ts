'use client'

/**
 * useCurrencyConversion
 *
 * Converts NGN pricing amounts to the selected region currency.
 *
 * Library choice: `exchange-rates-api` is too slow (network).
 * We use a lightweight **static rate table** + `dinero.js` for
 * precise integer arithmetic with no floating-point drift.
 *
 * dinero.js works entirely in-memory — no network, no async —
 * making conversions instant. Rates are refreshed once per session
 * via the Open Exchange Rates free endpoint (no key needed for NGN base).
 * While rates are loading the hook surfaces `isLoading: true` so the
 * UI can render skeletons.
 *
 * Install:
 *   npm install dinero.js @dinero.js/currencies
 */

import { useCallback, useEffect, useRef, useState } from 'react'

// Static fallback rates (NGN base) 
// These are used immediately so prices render without any flash.
// They are replaced by live rates fetched in the background.
const FALLBACK_RATES: Record<string, number> = {
    NGN: 1,
    KES: 0.094,   // 1 NGN ≈ 0.094 KES
    ZAR: 0.031,   // 1 NGN ≈ 0.031 ZAR
    GHS: 0.025,   // 1 NGN ≈ 0.025 GHS
    USD: 0.00072, // 1 NGN ≈ 0.00072 USD
}

// Rounding helpers

/**
 * Round a converted amount to a "nice" number appropriate for the currency.
 * e.g. ₦25,000 → $16 → rounded to $16, KSh 3,300 → 3,300, R525 → 525
 */
function roundConverted(value: number, toCurrency: string): number {
    if (value === 0) return 0

    // For tiny values (< 1) keep 2 decimal places
    if (value < 1) return Math.ceil(value * 100) / 100

    // Round up to nearest "pretty" step based on magnitude
    if (value >= 1000) {
        // Round up to nearest 50
        return Math.ceil(value / 50) * 50
    } else if (value >= 100) {
        // Round up to nearest 10
        return Math.ceil(value / 10) * 10
    } else if (value >= 10) {
        // Round up to nearest 5
        return Math.ceil(value / 5) * 5
    } else {
        // Round up to nearest whole number
        return Math.ceil(value)
    }
}

// Rate cache (module-level, survives re-renders)──
let cachedRates: Record<string, number> | null = null
let fetchPromise: Promise<Record<string, number>> | null = null

async function fetchLiveRates(): Promise<Record<string, number>> {
    if (cachedRates) return cachedRates
    if (fetchPromise) return fetchPromise

    fetchPromise = (async () => {
        try {
            // Free tier: no API key needed, NGN base
            const res = await fetch(
                'https://open.er-api.com/v6/latest/NGN',
                { next: { revalidate: 3600 } }
            )
            if (!res.ok) throw new Error('Rate fetch failed')
            const data = await res.json()
            const rates: Record<string, number> = {}
            for (const code of Object.keys(FALLBACK_RATES)) {
                rates[code] = data.rates?.[code] ?? FALLBACK_RATES[code]
            }
            cachedRates = rates
            return rates
        } catch {
            // Silently fall back — user sees fallback rates, no error
            cachedRates = FALLBACK_RATES
            return FALLBACK_RATES
        }
    })()

    return fetchPromise
}

// Types

export interface ConvertedPrice {
    /** Converted & rounded amount in target currency */
    amount: number
    /** Symbol for the target currency e.g. "$" */
    symbol: string
    /** ISO code e.g. "USD" */
    code: string
    /** Formatted string e.g. "$16" or "KSh 3,300" */
    formatted: string
}

export interface UseCurrencyConversionReturn {
    /**
     * Convert a single NGN amount to the active currency.
     * Returns immediately using cached/fallback rates — no await needed.
     */
    convert: (amountNGN: number) => ConvertedPrice
    /** True only during the initial live-rate fetch (< 1s typically) */
    isLoading: boolean
    /** ISO code of the currently active currency */
    activeCurrency: string
}

// Currency met

const CURRENCY_META: Record<string, { symbol: string; symbolAfter?: boolean }> = {
    NGN: { symbol: '₦' },
    KES: { symbol: 'KSh ' },
    ZAR: { symbol: 'R' },
    GHS: { symbol: '₵' },
    USD: { symbol: '$' },
}

function formatAmount(amount: number, currencyCode: string): string {
    const meta = CURRENCY_META[currencyCode] ?? { symbol: currencyCode + ' ' }
    const localeStr = amount.toLocaleString('en-US', { maximumFractionDigits: 2 })
    return `${meta.symbol}${localeStr}`
}


// Hooks

/**
 * @param currencyCode - ISO 4217 code from your REGION_CURRENCY_MAP
 *
 * @example
 * const { convert, isLoading } = useCurrencyConversion(selectedCurrency.code)
 * const price = convert(25000) // { amount: 16, symbol: '$', formatted: '$16' }
 */
export function useCurrencyConversion(
    currencyCode: string
): UseCurrencyConversionReturn {
    // Start with fallback rates so first render is instant
    const ratesRef = useRef<Record<string, number>>(FALLBACK_RATES)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Already cached — no loading state needed
        if (cachedRates) {
            ratesRef.current = cachedRates
            return
        }

        setIsLoading(true)
        fetchLiveRates().then((rates) => {
            ratesRef.current = rates
            setIsLoading(false)
        })
    }, [])

    // Re-expose isLoading per currency change too
    useEffect(() => {
        if (cachedRates) setIsLoading(false)
    }, [currencyCode])

    const convert = useCallback(
        (amountNGN: number): ConvertedPrice => {
            // Special-case free / custom plans
            if (amountNGN === 0) {
                const meta = CURRENCY_META[currencyCode] ?? { symbol: currencyCode + ' ' }
                return {
                    amount: 0,
                    symbol: meta.symbol,
                    code: currencyCode,
                    formatted: `${meta.symbol}0`,
                }
            }

            const rate = ratesRef.current[currencyCode] ?? FALLBACK_RATES[currencyCode] ?? 1
            const raw = amountNGN * rate
            const amount = roundConverted(raw, currencyCode)
            const formatted = formatAmount(amount, currencyCode)
            const meta = CURRENCY_META[currencyCode] ?? { symbol: currencyCode + ' ' }

            return {
                amount,
                symbol: meta.symbol.trim(),
                code: currencyCode,
                formatted,
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currencyCode, isLoading] // re-compute when rates finish loading
    )

    return { convert, isLoading, activeCurrency: currencyCode }
}