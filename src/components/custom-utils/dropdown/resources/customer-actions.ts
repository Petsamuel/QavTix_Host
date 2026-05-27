import { CUSTOMERS_PROFILE } from "@/enums/navigation"
import { ItemAction } from "../ItemActionDropdown"

export function buildCustomerActions(
    customer: { user_id: number | null; name: string; email: string; address: string; profile_picture: string | null },
    router: ReturnType<typeof import("next/navigation").useRouter>,
): ItemAction[] {
    return [
        {
            id:    "view-profile" as const,
            label: "View Customer Profile",
            icon:  "hugeicons:face-id",
            onClick: () => {
                if (customer.user_id) {
                    router.push(CUSTOMERS_PROFILE.href.replace("[profile_id]", customer.user_id.toString()))
                } else {
                    // Guest buyer — no registered account, pass basic info as query params
                    const params = new URLSearchParams()
                    params.set("name", customer.name || "Guest")
                    params.set("email", customer.email || "")
                    params.set("address", customer.address || "")
                    if (customer.profile_picture) params.set("avatar", customer.profile_picture)
                    router.push(`${CUSTOMERS_PROFILE.href.replace("[profile_id]", "guest")}?${params.toString()}`)
                }
            },
        },
    ]
}