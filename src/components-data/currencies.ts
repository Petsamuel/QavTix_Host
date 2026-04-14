// Top currencies by region — ISO 4217 codes + Intl locale for formatting
// Add new entries here as the platform expands to new markets.

export const PLATFORM_CURRENCY = "NGN"

export interface CurrencyMeta {
    code:   string   // ISO 4217
    name:   string
    locale: string   // BCP 47 locale for Intl.NumberFormat
    region: "africa" | "europe" | "americas" | "asia-pacific"
}

export const CURRENCIES: CurrencyMeta[] = [

    // Africa
    { code: "NGN", name: "Nigerian Naira",  locale: "en-NG",  region: "africa" },
    { code: "GHS", name: "Ghanaian Cedi",   locale: "en-GH",  region: "africa" },
    { code: "KES", name: "Kenyan Shilling", locale: "sw-KE",  region: "africa" },
    { code: "ZAR", name: "South African Rand",locale: "en-ZA",  region: "africa" },     
    // Americas
    { code: "USD", name: "US Dollar", locale: "en-US",  region: "americas" },
]

// Fast O(1) locale lookup — used by formatPrice
export const LOCALE_MAP: Record<string, string> = Object.fromEntries(
    CURRENCIES.map(c => [c.code, c.locale])
)

// Convenience — get all codes as a union-friendly array
export const CURRENCY_CODES = CURRENCIES.map(c => c.code)


export const MIN_WITHDRAWAL = {
  NGN: 150000,   // Nigeria (₦150,000)
  USD: 100,      // United States ($100)
  ZAR: 1800,     // South Africa (~$95–100)
  KES: 15000,    // Kenya (~$100)
  GHS: 1300      // Ghana (~$100)
}


export const CURRENCY_SYMBOL_MAP: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    GHS: "₵",
    KES: "KSh",
    ZAR: "R",
    EUR: "€",
    GBP: "£",
}

export function getCurrencySymbol(code?: string): string {
    if (!code) return "$"
    return CURRENCY_SYMBOL_MAP[code.toUpperCase()] ?? code.toUpperCase()
}