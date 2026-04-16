export const DASHBOARD_OVERVIEW_ENDPOINT = "host/dashboard/overview/"
export const HOST_UPCOMING_EVENTS_ENDPOINT = "host/events/management"
export const EVENTS_ENDPOINT = "host/events/management"
export const DASHBOARD_FEED_ENDPOINT = "host/dashboard/feed/"

export const CATEGORIES_ENDPOINT = "public/categories"

export const CUSTOMERS_ENDPOINT = "host/customers"
export const CUSTOMER_DETAILS_ENDPOINT = "host/customers/[user_id]"
export const CUSTOMER_LIST_DOWNLOAD_ENDPOINT = "host/customers/export/"

export const FINANCIALS_ENDPOINT = "host/financial/overview"
export const PAYOUT_LIST_ENDPOINT = "host/payouts/list"
export const REMOVE_PAYOUT_ENDPOINT = "host/payouts/remove/[payout_id]/"
export const PAYOUT_ADD_ENDPOINT = "host/payouts/add/"
export const WITHDRAWAL_ENDPOINT = "host/withdraw/"


export const EVENT_DELETE = "host/events/delete/[event_id]"
export const EVENT_UPDATE = "host/events/[event_id]/update"

export const SALES_ANALYTICS_CARDS_ENDPOINT = "host/sales/cards"
export const SALES_ANALYTICS_GRAPHS_ENDPOINT = "host/sales/graphs"



export const FEATURED_PLAN_VERIFY_ENDPOINT = "payments/featured/complete/"
export const FEATURED_PLAN_INITIATE_ENDPOINT = "payments/featured/initiate/"


export const CHECKIN_OVERVIEW_ENDPOINT = "host/checkin/overview"
export const CHECKIN_ATTENDEES_ENDPOINT = "host/checkin/attendees/"
export const CHECKIN_SCAN_ENDPOINT = "host/checkin/scan/"


export const HOST_PLAN_CHECKOUT_ENDPOINT = "payments/plans/subscribe/"
export const HOST_PLAN_CHECKOUT_VERIFY_ENDPOINT = "payments/plans/complete/"


export const ADD_PAYMENT_CARD = "payments/cards/initiate/"
export const ADD_PAYMENT_CARD_CONFIRM = "payments/cards/confirm/"

export const GET_SUBSCRIPTION_ENDPOINT    = "host/subscription/status/"
export const TOGGLE_AUTO_RENEW_ENDPOINT   = "host/auto-renew/toggle/"
export const RENEW_SUBSCRIPTION_ENDPOINT  = "host/subscription/renew/"
export const CANCEL_SUBSCRIPTION_ENDPOINT = "payments/plans/cancel/"


export const PROMO_CODES_ENDPOINT = "host/promo-codes"
export const CREATE_PROMO_CODES_ENDPOINT = "host/promo-codes/create/"
export const AFFILIATE_LINKS_HOST_ENDPOINT = "host/affiliates"
export const EMAIL_CAMPAIGNS_ENDPOINT = "host/campaigns"
export const SINGLE_SMS_ENDPOINT = "host/campaigns/send-single-sms/"
export const SEND_EMAIL_CAMPAIGNS_ENDPOINT = "host/campaigns/send/"
export const SINGLE_EMAIL_ENDPOINT = "host/campaigns/send-single/"

export const PAYMENT_METHODS_ENDPOINT = "payments/cards/"
export const CHANGE_PASSWORD_ENDPOINT = "host/security/change-password/"
export const GET_PRIVACY_SETTINGS_ENDPOINT = "host/privacy/settings"
export const SET_PRIVACY_SETTINGS_ENDPOINT = "host/privacy/activity/sharing"
export const DOWNLOAD_DATA_ENDPOINT = "host/privacy/data/download/"
export const DELETE_ACCOUNT_ENDPOINT = "host/privacy/account/delete"
export const CANCEL_PLAN_ENDPOINT = "payments/host-plans/cancel/"

export const LOGIN_ENDPOINT = "auth/login/"
export const GET_PROFILE_ENDPOINT = "host/profile/"