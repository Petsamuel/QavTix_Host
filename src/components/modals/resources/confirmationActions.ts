export const CONFIRMATION_ACTION_TYPES = {
    DELETE_PAYOUT_ACCOUNT: 'DELETE_PAYOUT_ACCOUNT',
} as const

export type ConfirmationActionType = keyof typeof CONFIRMATION_ACTION_TYPES