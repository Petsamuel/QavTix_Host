export const successModalVariantConfig = {
    delete: {
        icon: "🗑️",
        type: "emoji"
    },
    success: {
        icon: "🎉",
        type: "emoji"
    },
    account_deleted: {
        icon: "/images/vectors/uas-icon.svg",
        type: "image"
    }
}

export type SuccessModalVariant = keyof typeof successModalVariantConfig;