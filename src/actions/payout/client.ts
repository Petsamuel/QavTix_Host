"use server";

import { handleApiError } from "@/helper-fns/handleApiErrors"

export interface BankOption {
    label: string
    value: string  // bank code
    name: string
    country: string
}

export interface VerifyResult {
    success: boolean
    account_name?: string
    message?: string
}

// Country → Paystack country slug
const SUPPORTED_VERIFY_COUNTRIES = ["nigeria"] as const

const COUNTRY_SLUGS: Record<string, string> = {
    nigeria: "nigeria",
    ghana: "ghana",
    kenya: "kenya",
    southafrica: "south africa",
}

// Cache key per country
const bankCache = new Map<string, BankOption[]>()

export async function getPaystackBanks(
    country: string = "nigeria"
): Promise<{ success: boolean; data?: BankOption[]; message?: string }> {
    try {
        const slug = COUNTRY_SLUGS[country.toLowerCase().replace(/\s/g, "")] ?? country

        // Return from in-memory cache if available
        if (bankCache.has(slug)) {
            return { success: true, data: bankCache.get(slug) }
        }

        const res = await fetch(
            `https://api.paystack.co/bank?country=${encodeURIComponent(slug)}&perPage=100&use_cursor=false`,
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
            }
        )

        const json = await res.json()
        if (!res.ok || !json.status) return { success: false, message: "Could not load banks" }

        const seen = new Set<string>()
        const banks: BankOption[] = []

        for (const b of json.data as any[]) {
            if (seen.has(b.code)) continue
            seen.add(b.code)
            banks.push({ label: b.name, value: b.code, name: b.name, country: slug })
        }

        bankCache.set(slug, banks)
        return { success: true, data: banks }

    } catch {
        return { success: false, message: "Could not load banks" }
    }
}

export async function verifyAccountNumber(
    accountNumber: string,
    bankCode: string,
    country: string = "nigeria",
): Promise<VerifyResult> {
    if (!SUPPORTED_VERIFY_COUNTRIES.includes(country.toLowerCase() as any)) {
        return { success: false, message: "auto_verify_unsupported" }
    }

    try {
        const res = await fetch(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
                cache: "no-store",
            }
        )

        const json = await res.json()
        if (!res.ok || !json.status) {
            return { success: false, message: json.message ?? "Could not verify account" }
        }

        return { success: true, account_name: json.data.account_name }

    } catch {
        return { success: false, message: "Verification failed. Please try again." }
    }
}
