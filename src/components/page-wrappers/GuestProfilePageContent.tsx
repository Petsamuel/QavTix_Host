"use client"

import { Icon } from "@iconify/react"
import Link from "next/link"
import { NAVIGATION_LINKS } from "@/enums/navigation"
import { useAppSelector } from "@/lib/redux/hooks"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"

import CustomersProfilePageMetricCardsContainer from "../cards/CustomerProfilePageMetricsCardContainer"
import { CustomerProfileDetailsCard } from "../cards/CustomerProfileDetailsCard"
import { UserRevenueChart } from "../charts/UserRevenueChart"
import OrderListTable from "../custom-utils/TableDataDisplayAreas/tables/OrderListTable"
import DataDisplayTableWrapper from "../custom-utils/TableDataDisplayAreas/DataDisplayTableWrapper"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"

interface Props {
    name: string
    email: string
    address: string
    avatar: string | null
}

export default function GuestProfilePage({ name, email, address, avatar }: Props) {
    const { user } = useAppSelector(store => store.authUser)
    const currency = user?.currency || ""

    const mockProfile: CustomerProfile = {
        user_id: 0,
        full_name: name,
        email: email,
        phone_number: "",
        country: "",
        state: "",
        city: "",
        gender: "",
        dob: "",
        profile_picture: avatar,
        registration_date: "",
        first_purchase_date: "",
        last_purchase_date: "",
    }

    const mockCards: CustomerProfileCards = {
        total_spent: "0",
        total_spent_change: 0,
        tickets_bought: 0,
        tickets_bought_change: 0,
        refund_count: 0,
        refund_count_change: 0,
        last_order_value: "0",
        last_order_value_change: 0,
    }

    return (
        <main className="pb-10">
            {/* Top filter bar */}
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <Link
                        href={NAVIGATION_LINKS.CUSTOMERS.href}
                        className="inline-flex items-center gap-1.5 text-xs text-brand-secondary-6 hover:text-brand-primary-6 transition-colors"
                    >
                        <Icon icon="hugeicons:arrow-left-01" className="w-4 h-4" />
                        Back to Customers
                    </Link>
                </div>
                <ExportButton1
                    label="Export Orders"
                    onExport={() => {}}
                    disabled
                />
            </div>

            {/* Guest notice banner */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8">
                <Icon icon="lucide:info" className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-relaxed">
                    This buyer checked out as a <span className="font-semibold">guest</span> and does not have a registered QavTix account.
                    Only basic purchase information is available.
                </p>
            </div>

            {/*  KPI cards  */}
            <div className="mb-8 opacity-70 pointer-events-none grayscale-[30%]">
                <CustomersProfilePageMetricCardsContainer
                    cards={mockCards}
                    currency={currency}
                />
            </div>

            {/* Profile card & Revenue chart */}
            <div className="grid grid-cols-1 md:grid-cols-[20em_1fr] gap-4 gap-y-7 my-10">
                <CustomerProfileDetailsCard customer={mockProfile} isGuest />
                
                <div className="min-w-0 opacity-70 pointer-events-none grayscale-[30%]">
                    <UserRevenueChart
                        userID={0}
                        initialData={[]}
                        isGuest
                    />
                </div>
            </div>

            {/* Order history */}
            <div className="opacity-70 pointer-events-none grayscale-[30%]">
                <h3 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg mb-4")}>
                    Order History
                </h3>
                <DataDisplayTableWrapper
                    filters={{}}
                    filterOptions={[]}
                    setFilters={() => {}}
                    showSearch
                    searchPlaceholder="Search by event name..."
                    onSearch={() => {}}
                    isLoading={false}
                >
                    <OrderListTable
                        items={[]}
                        isLoading={false}
                        isLoadingMore={false}
                        hasNext={false}
                        count={0}
                        onLoadMore={() => {}}
                        isEmpty={true}
                        isError={false}
                        search={""}
                        currentPage={1}
                        totalPages={1}
                        fetchPage={() => {}}
                    />
                </DataDisplayTableWrapper>
            </div>
        </main>
    )
}
