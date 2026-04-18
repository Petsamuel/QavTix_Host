import { z } from "zod"

export const createPromoCodeSchema = z.object({
    promo_code: z
        .string()
        .min(1, "Promo code is required")
        .max(20, "Promo code must be 20 characters or less")
        .regex(/^[A-Z0-9]+$/, "Promo code must contain only uppercase letters and numbers"),
    
    discount: z
        .number()
        .min(1, "Discount must be at least 1%")
        .max(100, "Discount cannot exceed 100%"),
    
    usage_limit: z
        .number("Invalid input")
        .min(1, "Usage limit is required"),
    
    valid_until: z
        .date({
            error: "Expiry date is required",
        })
        .refine((date) => date > new Date(), {
            message: "Expiry date must be in the future",
        }),
    
    event_id: z
        .string()
        .min(1, "Please select an event"),
})

export type CreatePromoCodeSchemaType = z.infer<typeof createPromoCodeSchema>