"use client"

import { changePassword } from "@/actions/settings/client"
import PasswordInput from "@/components/custom-utils/inputs/PasswordInput"
import PasswordStrengthIndicator from "@/components/custom-utils/security/PasswordStrengthIndicator"
import { space_grotesk } from "@/lib/fonts"
import { useAppDispatch } from "@/lib/redux/hooks"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { cn } from "@/lib/utils"
import { passwordSchema, PasswordSchema } from "@/schemas/security.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Icon } from "@iconify/react"
import { SubmitHandler, useForm } from "react-hook-form"
import ActionButton1 from "../custom-utils/buttons/ActionBtn1"



export default function SecurityPageClient() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
    })

    const dispatch = useAppDispatch()

    const onSubmit: SubmitHandler<PasswordSchema> = async (data) => {
        const result = await changePassword(data.currentPassword, data.newPassword)

        if (result.success) {
            reset()
            dispatch(showAlert({
                variant:     "success",
                title:       "Password updated",
                description: "Your password has been changed successfully.",
            }))
        } else {
            dispatch(showAlert({
                variant:     "destructive",
                title:       "Password update failed",
                description: result.message ?? "Please check your current password and try again.",
            }))
        }
    }
    const newPassword = watch("newPassword")

    return (
        <main className="pb-16">
            <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 text-lg font-bold mt-4 mb-10")}>Password</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
                <PasswordInput
                    label="Current Password"
                    placeholder="........."
                    required
                    {...register('currentPassword')}
                    error={errors.currentPassword?.message}
                />
                <PasswordInput
                    label="New Password"
                    placeholder=".........."
                    autoComplete="new-password"
                    required
                    {...register('newPassword')}
                    error={errors.newPassword?.message}
                />
                <PasswordInput
                    label="Confirm Password"
                    placeholder="............."
                    autoComplete="new-password"
                    required
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                />

                <PasswordStrengthIndicator password={newPassword} />




                <ActionButton1
                    buttonText={isSubmitting ? "Updating..." : "Update Password"}
                    className="rounded-lg w-full"
                    iconPosition="right"
                    buttonType="submit"
                    icon={isSubmitting ? "eos-icons:three-dots-loading" : "gravity-ui:arrow-right"}
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                />
            </form>
        </main>
    )
}