import { getCustomers } from "@/actions/customers";
import CustomersPagePw from "@/components/page-wrappers/CustomersPagePw";

export default async function CustomersPage(){

    const customersResult = await getCustomers()

    if (!customersResult.success || !customersResult.data) {
        throw new Error("Failed to load customers data")
    }

    return (
        <CustomersPagePw customersData={customersResult.data!} />
    )
}