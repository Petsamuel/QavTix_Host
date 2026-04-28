import { getCustomerProfile } from "@/actions/customers"
import CustomersProfilePagContentWrapper from "@/components/page-wrappers/CustomerProfilePageContentWrapper"
import { notFound } from "next/navigation"
import { cookies } from "next/headers";

interface Props {
    params: Promise<{ customer_id: string }>
}

export default async function CustomerProfilePage({ params }: Props) {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;

    const userID = parseInt((await params).customer_id)

    const result = await getCustomerProfile(token, { user_id: userID })

    if (!result.success || !result.data) return notFound()

    const orderHistorySlice = {
        results:     result.data.order_history.results,
        count:       result.data.order_history.count,
        next:        result.data.order_history.next ? 1 : null,
        previous:    result.data.order_history.previous ? 1 : null,
        total_pages: Math.ceil(result.data.order_history.count / 10),
    }

    return (
        <CustomersProfilePagContentWrapper
            userID={userID}
            profile={result.data.profile}
            cards={result.data.cards}
            initialChart={result.data.revenue_chart}
            initialOrders={orderHistorySlice}
        />
    )
}