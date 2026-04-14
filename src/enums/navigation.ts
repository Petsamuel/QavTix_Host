export const NAVIGATION_LINKS = {
    DASHBOARD: {
        href: "/dashboard",
        icon: "hugeicons:dashboard-square-01",
        label: "Dashboard"
    },
    MY_EVENTS: {
        href: "/dashboard/events",
        icon: "hugeicons:calendar-03",
        label: "My Events"
    },
    SALE_AND_ANALYTICS: {
        href: "/dashboard/sales-analytics",
        icon: "hugeicons:analytics-up",
        label: "Sales & Analytics"
    },
    CUSTOMERS: {
        href: "/dashboard/customers",
        icon: "hugeicons:user-multiple-02",
        label: "Customers"
    },
    FINANCIALS: {
        href: "/dashboard/financials",
        icon: "hugeicons:coins-01",
        label: "Financials"
    },
    MARKETING_TOOLS: {
        href: "/dashboard/marketing-tools",
        icon: "hugeicons:invoice-03",
        label: "Marketing Tools"
    },
    CHECK_IN_SYSTEM: {
        href: "/dashboard/checkin-system",
        icon: "hugeicons:add-to-list",
        label: "Check-In System"
    },
    SETTINGS: {
        href: "/dashboard/settings",
        icon: "hugeicons:security-lock",
        label: "Settings"
    },
} as const

export const SETTINGS_SUB_LINKS = [
    {
        href:  "/dashboard/settings/account",
        label: "Account",
    },
    {
        href:  "/dashboard/settings/security",
        label: "Security",
    },
    {
        href:  "/dashboard/settings/subscription",
        label: "Manage Subscription",
    },
] as const

export const CUSTOMERS_PROFILE = {
    href: `${NAVIGATION_LINKS.CUSTOMERS.href}/profile/[profile_id]`,
    label: "Customer Profile"
} as const;

export const CREATE_EVENT = {
    href: `${NAVIGATION_LINKS.MY_EVENTS.href}/create`,
    label: "Create Event"
} as const;


export const EXPLORE_EVENT_LINK = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/events` as const;
