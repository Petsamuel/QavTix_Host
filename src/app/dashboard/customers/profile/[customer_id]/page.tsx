import CustomersProfilePagContentWrapper from "@/components/page-wrappers/CustomerProfilePageContentWrapper"
import GuestProfilePage from "@/components/page-wrappers/GuestProfilePageContent"
import { notFound } from "next/navigation"
import { cookies } from "next/headers";
import { getCustomerProfile } from "@/actions/customers";

interface Props {
    params: Promise<{ customer_id: string }>
    searchParams: Promise<{ name?: string; email?: string; address?: string; avatar?: string }>
}

export default async function CustomerProfilePage({ params, searchParams }: Props) {
    const { customer_id } = await params

    // Guest buyer — no registered account, render from search params
    if (customer_id === "guest") {
        const sp = await searchParams
        return (
            <GuestProfilePage
                name={sp.name || "Guest"}
                email={sp.email || ""}
                address={sp.address || ""}
                avatar={sp.avatar || null}
            />
        )
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;

    const userID = parseInt(customer_id)
    if (isNaN(userID)) return notFound()

    const result = await getCustomerProfile(token!, { user_id: userID })

    if (!result.success || !result.data) return notFound()

    const orderHistorySlice = {
        results: result.data.order_history.results,
        count: result.data.order_history.count,
        next: result.data.order_history.next ? 1 : null,
        previous: result.data.order_history.previous ? 1 : null,
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