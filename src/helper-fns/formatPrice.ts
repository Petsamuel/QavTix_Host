import { LOCALE_MAP, PLATFORM_CURRENCY } from "@/components-data/currencies"

export function formatPrice(
    amount:    number,
    currency?:  string,
    useSymbol: boolean = true
): string {
    const code   = currency ? currency.toUpperCase() : PLATFORM_CURRENCY
    const locale = LOCALE_MAP[code] ?? "en-US"

    return new Intl.NumberFormat(locale, {
        style:                 "currency",
        currency:              code,
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
        currencyDisplay:       useSymbol ? "symbol" : "code",
    }).format(amount)
}

export const parsePrice = (val: string | number | undefined): number | null => {
    if (val == null || val === "") return null
    const n = typeof val === "number" ? val : parseFloat(val)
    return isNaN(n) ? null : n
}