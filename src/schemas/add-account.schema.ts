import { z } from "zod"

export const addAccountSchema = z.object({
    bank_code:      z.string().optional(),
    bank_name:      z.string().min(1, "Bank name is required"),
    account_number: z.string()
        .min(6,  "Enter a valid account number")
        .max(20, "Enter a valid account number")
        .regex(/^\d+$/, "Only numbers allowed"),
    account_name:   z.string().min(1, "Account name is required"),
    is_default:     z.boolean().optional(),
})

export type AddAccountSchemaType = z.infer<typeof addAccountSchema>