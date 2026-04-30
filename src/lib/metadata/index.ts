import type { Metadata } from "next"

const SITE_NAME = "QavTix"
const SITE_URL = process.env.NEXT_PUBLIC_HOST_DOMAIN ?? "https://host.qavtix.com"

export const hostSiteMetadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `Dashboard | ${SITE_NAME}`,
        template: `%s | ${SITE_NAME}`,
    },
    description: "Manage your events, track sales, engage customers, and grow your hosting business on QavTix.",
    robots: {
        index: false,
        follow: false,
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        ],
        apple: "/apple-touch-icon.png",
    },
}

// Page-specific metadata
export const HOST_PAGE_METADATA = {
    DASHBOARD: {
        title: "Dashboard",
        description: "Overview of your events, sales, and quick insights.",
    },
    MY_EVENTS: {
        title: "My Events",
        description: "Create, manage, and track all your events in one place.",
    },
    CREATE_EVENT: {
        title: "Create New Event",
        description: "Set up a new event with ticketing, promotions, and more.",
    },
    EVENT_DETAILS: {
        title: "Event Details",
        description: "View and manage detailed information about your event.",
    },
    SALES_ANALYTICS: {
        title: "Sales & Analytics",
        description: "Track revenue, attendance, and performance insights.",
    },
    CUSTOMERS: {
        title: "Customers",
        description: "View and manage all your event attendees and buyers.",
    },
    CUSTOMER_PROFILE: {
        title: "Customer Profile",
        description: "Detailed view of a customer's activity and purchase history.",
    },
    FINANCIALS: {
        title: "Financials",
        description: "Manage payouts, transactions, and financial overview.",
    },
    MARKETING_TOOLS: {
        title: "Marketing Tools",
        description: "Create promo codes, run email campaigns, and grow your reach.",
    },
    CHECK_IN_SYSTEM: {
        title: "Check-In System",
        description: "Scan tickets and manage attendee check-ins efficiently.",
    },
    SETTINGS: {
        title: "Settings",
        description: "Manage your account, security, and business preferences.",
    },
    ACCOUNT_SETTINGS: {
        title: "Account Settings",
        description: "Update your profile and personal information.",
    },
    SECURITY: {
        title: "Security",
        description: "Manage password, 2FA, and login activity.",
    },
    SUBSCRIPTION: {
        title: "Subscription & Billing",
        description: "Manage your plan and billing information.",
    },
} as const



export function generateEventMetadata(eventName: string): Metadata {
    return {
        title: `${eventName} | ${SITE_NAME}`,
        description: `Manage tickets, attendees, and analytics for ${eventName}`,
    }
}


export function generateCustomerProfileMetadata(customerName: string): Metadata {
    return {
        ...hostSiteMetadata,
        title: `${customerName} | Customer Profile | ${SITE_NAME}`,
        description: `View purchase history, events attended, and details for ${customerName}.`,
        openGraph: {
            title: `${customerName} - Customer Profile`,
            description: `Customer profile and activity on QavTix`,
        },
    }
}