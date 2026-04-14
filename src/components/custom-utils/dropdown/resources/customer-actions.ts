import { CUSTOMERS_PROFILE } from "@/enums/navigation"
import { ItemAction } from "../ItemActionDropdown"

export function buildCustomerActions(
    customerId: string | number,
    router: ReturnType<typeof import("next/navigation").useRouter>,
): ItemAction[] {
    return [
        {
            id:    "view-profile",
            label: "View Customer Profile",
            icon:  "hugeicons:face-id",
            onClick: () => router.push(CUSTOMERS_PROFILE.href.replace("[profile_id]", customerId.toString())),
        },
    ]
}