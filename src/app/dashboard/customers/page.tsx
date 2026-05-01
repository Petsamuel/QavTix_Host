import { getCustomers } from "@/actions/customers";
import CustomersPagePw from "@/components/page-wrappers/CustomersPagePw";
import { cookies } from "next/headers";

export default async function CustomersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("host_access_token")?.value;

    const customersResult = await getCustomers(token!)

    if (!customersResult.success || !customersResult.data) {
        throw new Error("Failed to load customers data")
    }

    return (
        <CustomersPagePw customersData={customersResult.data!} />
    )
}