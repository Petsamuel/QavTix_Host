const BANK_DOMAINS: Record<string, string> = {
    // Nigeria - Tier 1
    "access bank":              "accessbankplc.com",
    "access":                   "accessbankplc.com",
    "gtbank":                   "gtbank.com",
    "guaranty trust bank":      "gtbank.com",
    "guaranty trust":           "gtbank.com",
    "gt bank":                  "gtbank.com",
    "zenith bank":              "zenithbank.com",
    "zenith":                   "zenithbank.com",
    "first bank":               "firstbanknigeria.com",
    "first bank nigeria":       "firstbanknigeria.com",
    "uba":                      "ubagroup.com",
    "united bank for africa":   "ubagroup.com",
    // Nigeria - Tier 2
    "ecobank":                  "ecobank.com",
    "fidelity bank":            "fidelitybank.ng",
    "fidelity":                 "fidelitybank.ng",
    "fcmb":                     "fcmb.com",
    "first city monument bank": "fcmb.com",
    "stanbic ibtc":             "stanbicibtc.com",
    "stanbic ibtc bank":        "stanbicibtc.com",
    "union bank":               "unionbankng.com",
    "sterling bank":            "sterlingbank.com",
    "sterling":                 "sterlingbank.com",
    "wema bank":                "wemabank.com",
    "wema":                     "wemabank.com",
    "keystone bank":            "keystonebankng.com",
    "polaris bank":             "polarisbanklimited.com",
    "heritage bank":            "heritagebankplc.com",
    "unity bank":               "unitybankng.com",
    // Nigeria - Fintechs
    "opay":                     "opayweb.com",
    "palmpay":                  "palmpay.com",
    "moniepoint":               "moniepoint.com",
    "monie point":              "moniepoint.com",
    "kuda":                     "kuda.com",
    "kuda bank":                "kuda.com",
    "carbon":                   "getcarbon.co",
    "fairmoney":                "fairmoney.africa",
    "vbank":                    "vbank.ng",
    "vfd":                      "vbank.ng",
    "providus bank":            "providusbank.com",
    "providus":                 "providusbank.com",
    "rubies bank":              "rubies.bank",
    "rubies":                   "rubies.bank",
    // Ghana
    "gcb bank":                 "gcbbank.com.gh",
    "absa ghana":               "absa.com.gh",
    "stanbic ghana":            "stanbicbank.com.gh",
    "zenith bank ghana":        "zenithbank.com.gh",
    "cal bank":                 "calbank.net",
    "fidelity bank ghana":      "fidelitybank.com.gh",
    "mtn momo":                 "mtn.com.gh",
    "mtn":                      "mtn.com",
    // Kenya
    "equity bank":              "equitybank.co.ke",
    "kcb bank":                 "kcbgroup.com",
    "kcb":                      "kcbgroup.com",
    "cooperative bank":         "co-opbank.co.ke",
    "ncba bank":                "ncbagroup.com",
    "ncba":                     "ncbagroup.com",
    "absa kenya":               "absa.co.ke",
    "mpesa":                    "safaricom.co.ke",
    "safaricom":                "safaricom.co.ke",
    "family bank":              "familybank.co.ke",
    // South Africa
    "fnb":                      "fnb.co.za",
    "first national bank":      "fnb.co.za",
    "absa":                     "absa.co.za",
    "standard bank":            "standardbank.co.za",
    "nedbank":                  "nedbank.co.za",
    "capitec":                  "capitecbank.co.za",
    "capitec bank":             "capitecbank.co.za",
    "discovery bank":           "discovery.co.za",
    "tyme bank":                "tymebank.co.za",
    // Global
    "wise":                     "wise.com",
    "revolut":                  "revolut.com",
    "paypal":                   "paypal.com",
    "stripe":                   "stripe.com",
    "cashapp":                  "cash.app",
    "cash app":                 "cash.app",
}

const resolveDomain = (bankName: string): string | null => {
    const key = bankName.toLowerCase().trim()
    if (BANK_DOMAINS[key]) return BANK_DOMAINS[key]
    const partialMatch = Object.keys(BANK_DOMAINS).find(
        k => key.includes(k) || k.includes(key)
    )
    return partialMatch ? BANK_DOMAINS[partialMatch] : null
}

export const getBrandFetchLogoUrl = (bankName: string): string | null => {
    const domain    = resolveDomain(bankName)
    const clientId  = process.env.NEXT_PUBLIC_BRAND_FETCH_CLIENT_ID
    if (!domain || !clientId) return null
    return `https://cdn.brandfetch.io/domain/firstbanknigeria.com/w/400/h/400?c=${clientId}`
}

export const getBankConvLogoUrl = (bankName: string): string | null => {
    const domain = resolveDomain(bankName)
    if (!domain) return null
    return `https://logo.bankconv.com/${domain}`
}

export const getNigerianBankLogoUrl = (bankName: string): string | null => {
    const domain = resolveDomain(bankName)
    if (!domain) return null
    return `https://nigerianbanklogos.xyz/docs/${domain}`
}