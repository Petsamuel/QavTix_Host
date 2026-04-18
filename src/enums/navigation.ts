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

export const EDIT_DRAFT_EVENT = {
    href: `${NAVIGATION_LINKS.MY_EVENTS.href}/edit-draft/[event_id]`,
    label: "Edit Draft Event"
} as const;


export const EXPLORE_EVENT_LINK = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/events` as const;
export const EVENT_DETAILS_LINK = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/events/details/[event_id]/` as const;
export const FAQ_PAGE = `${process.env.NEXT_PUBLIC_APP_DOMAIN}/faq/` as const;

export const CONTACT_LINKS = {
  LAGOS: {
    LOCATION: {
      icon: "hugeicons:location-06",
      text: "Lagos, Nigeria.",
      href: null
    },
    EMAIL: {
      icon: "mynaui:mail",
      text: "info@qavtix.com",
      href: "mailto:info@qavtix.com"
    },
    PHONE: {
      icon: "fluent-mdl2:phone",
      text: "+234 812 345 6789",
      href: "tel:+2348123456789"
    }
  } as const,


  ABUJA: {
    LOCATION: {
      icon: "hugeicons:location-06",
      text: "Abuja, Nigeria.",
      href: null
    },
    EMAIL: {
      icon: "mynaui:mail",
      text: "info@qavtix.com",
      href: "mailto:info@qavtix.com"
    },
    PHONE: {
      icon: "fluent-mdl2:phone",
      text: "+234 812 345 6789",
      href: "tel:+2348123456789"
    }
  },


  LAGOS_MAPEMBED: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.62283084026!2d3.281290!3d6.524379!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1234567890',
  ABUJA_MAPEMBED: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.02587508693!2d7.398574!3d9.057650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0baf7da48d0d%3A0x99a8fe4168c50bc8!2sAbuja%2C%20Nigeria!5e0!3m2!1sen!2s!4v1234567890'


} as const