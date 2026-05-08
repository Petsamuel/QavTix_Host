import { useIsMounted } from "./UseIsMounted"
import { formatPrice } from "@/helper-fns/formatPrice"

/**
 * A hook that provides a hydration-safe version of formatPrice.
 * It will automatically hide currency symbols until the component is mounted
 * on the client, preventing hydration mismatches.
 */
export function useFormatPrice() {
    const isMounted = useIsMounted()

    return (amount: number, currency?: string, useSymbol: boolean = true) => {
        return formatPrice(amount, currency, useSymbol, isMounted)
    }
}
