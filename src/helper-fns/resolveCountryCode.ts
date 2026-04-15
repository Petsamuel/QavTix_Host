import { Country, State } from "country-state-city";

export const resolveCountryCode = (country: string): string | null => {
    if (country.length === 2) return country;

    const match = Country.getAllCountries().find(
        c => c.name.toLowerCase() === country.toLowerCase()
    )

    return match?.isoCode ?? null;
}

/**
 * Resolves a country value to its full name.
 * If the value looks like an ISO code (< 3 chars), we look it up;
 * otherwise we assume it's already a label and return as-is.
 */
export function resolveCountryLabel(value: string): string {
    if (value.length < 3) {
        const match = Country.getCountryByCode(value.toUpperCase())
        return match?.name ?? value
    }
    return value
}

/**
 * Resolves a state value to its full name within a given country.
 * If the value looks like an ISO code (< 3 chars), we look it up;
 * otherwise we assume it's already a label and return as-is.
 */
export function resolveStateLabel(stateValue: string, countryCode: string): string {
    if (stateValue.length < 3) {
        const states = State.getStatesOfCountry(countryCode.toUpperCase())
        const match  = states.find(s => s.isoCode === stateValue.toUpperCase())
        return match?.name ?? stateValue
    }
    return stateValue
}
