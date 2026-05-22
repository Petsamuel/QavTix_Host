"use client"

import { useState } from "react"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { countries, getStates } from "@/components-data/location"
import { resolveCountryLabel, resolveStateLabel } from "@/helper-fns/resolveCountryCode"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser } from "@/lib/redux/slices/authUserSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { updateHostProfile } from "@/actions/settings/profile"

import CustomInput2 from "@/components/custom-utils/inputs/CustomInput2"
import CustomSelect2 from "@/components/custom-utils/inputs/CustomSelect2"
import PhoneNumberInput from "@/components/custom-utils/inputs/CustomPhoneInput"
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1"
import ProfileImageArea from "./ProfileImageArea"
import { Icon } from "@iconify/react"

const generalSchema = z.object({
    fullName: z.string().min(2, "Full Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Phone number is required"),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    profileImage: z.any().optional(),
    bannerImage: z.any().optional(),
})

type GeneralFormValues = z.infer<typeof generalSchema>

interface Props {
    user: AuthUser
}

export default function GeneralInfoForm({ user }: Props) {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)

    // Pre-resolve country to code if possible
    const initialCountryCode = user.country
        ? countries.find(v =>
            v.label.toLowerCase() === user.country?.toLowerCase() ||
            v.value.toLowerCase() === user.country?.toLowerCase() ||
            v.label.toLowerCase().trim().includes(user.country.toLocaleLowerCase().trim())
        )?.value || user.country || ""
        : ""

    let initialStateCode = user.state ?? ""
    if (initialCountryCode && initialStateCode) {
        const stateList = getStates(initialCountryCode)
        // Normalise common FCT aliases so the dropdown resolves correctly
        const normalised = initialStateCode.toUpperCase()
        const fctAliases = ["FCT", "ABUJA", "FEDERAL CAPITAL TERRITORY"]
        if (initialCountryCode === "NG" && fctAliases.includes(normalised)) {
            initialStateCode = "FC"
        } else {
            const match = stateList.find(s =>
                s.label.toLowerCase() === initialStateCode.toLowerCase() ||
                s.value.toLowerCase() === initialStateCode.toLowerCase()
            )
            if (match) {
                initialStateCode = match.value
            }
        }
    }

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<GeneralFormValues>({
        resolver: zodResolver(generalSchema),
        defaultValues: {
            fullName: user.full_name ?? "",
            email: user.email ?? "",
            phone: user.phone_number ?? "",
            country: initialCountryCode,
            state: initialStateCode,
            city: user.city ?? "",
            profileImage: user.profile_picture ?? null,
            bannerImage: user.profile_banner ?? null,
        },
    })

    const currentCountry = watch("country")

    const onSubmit: SubmitHandler<GeneralFormValues> = async (values) => {
        let profileUrl = user.profile_picture
        let bannerUrl = user.profile_banner

        try {
            if (values.profileImage && values.profileImage instanceof File) {
                const res = await uploadToCloudinary(values.profileImage, "qavtix-hosts/profiles")
                profileUrl = res.secure_url
            }
            if (values.bannerImage && values.bannerImage instanceof File) {
                const res = await uploadToCloudinary(values.bannerImage, "qavtix-hosts/banners")
                bannerUrl = res.secure_url
            }
        } catch (error) {
            dispatch(showAlert({
                variant: "destructive",
                title: "Upload failed",
                description: "Failed to upload images. Please try again.",
            }))
            return
        }

        const payload = {
            full_name: values.fullName,
            phone_number: values.phone,
            city: values.city,
            state: resolveStateLabel(values.state, values.country),
            profile_picture: profileUrl,
            profile_banner: bannerUrl,
            ...(!user.country && { country: resolveCountryLabel(values.country) }),
        }

        const res = await updateHostProfile(payload)

        if (res.success && res.data) {
            dispatch(setUser(res.data))
            setIsEditing(false)
            reset({
                ...values,
                profileImage: profileUrl,
                bannerImage: bannerUrl,
            })
            dispatch(showAlert({
                variant: "success",
                title: "Profile Updated",
                description: "Your general information has been updated successfully.",
            }))
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Update failed",
                description: res.message || "Failed to update profile.",
            }))
        }
    }

    const handleCancel = () => {
        reset()
        setIsEditing(false)
    }

    return (
        <div className="w-full max-w-4xl relative">
            <div className="flex items-center justify-between mb-8">
                <h2 className={cn(space_grotesk.className, "text-brand-secondary-8 font-bold text-lg")}>
                    General Information
                </h2>

                {!isEditing && (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center md:bg-brand-primary-1 p-2 rounded-lg justify-between text-xs font-bold gap-2 transition-opacity text-brand-primary-5 hover:text-brand-primary-7"
                    >
                        <span className="size-11 md:size-7 aspect-square rounded-md flex justify-center items-center text-white bg-brand-primary-3">
                            <Icon icon="hugeicons:pencil-edit-01" width="30" className="md:w-4.5" />
                        </span>
                        <span className="sr-only md:not-sr-only">Edit Info</span>
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <ProfileImageArea
                    profileImage={watch("profileImage")}
                    bannerImage={watch("bannerImage")}
                    onProfileChange={(f) => setValue("profileImage", f, { shouldDirty: true })}
                    onBannerChange={(f) => setValue("bannerImage", f, { shouldDirty: true })}
                    isEditing={isEditing}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <CustomInput2
                        required
                        label="Full Name"
                        error={errors.fullName?.message}
                        disabled={!isEditing}
                        {...register("fullName")}
                    />

                    <CustomInput2
                        required
                        label="Email Address"
                        disabled
                        className="pointer-events-none opacity-80"
                        error={errors.email?.message}
                        {...register("email")}
                    />

                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <PhoneNumberInput
                                label="Phone Number"
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.phone?.message}
                                showRequired
                                disabled={!isEditing}
                                defaultCountry="NG"
                            />
                        )}
                    />

                    <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label={`Country ${user.country ? "(Not editable)" : ""}`}
                                options={countries}
                                value={field.value}
                                required
                                onValueChange={field.onChange}
                                error={errors.country?.message}
                                disabled={!isEditing || !!user.country}
                                className={cn(!!user.country && "pointer-events-none opacity-80")}
                            />
                        )}
                    />

                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label="State"
                                options={getStates(currentCountry)}
                                value={field.value}
                                required
                                onValueChange={field.onChange}
                                error={errors.state?.message}
                                disabled={!isEditing}
                            />
                        )}
                    />

                    <CustomInput2
                        required
                        label="City"
                        error={errors.city?.message}
                        disabled={!isEditing}
                        {...register("city")}
                    />

                    {isEditing && (
                     <div className="md:col-span-2 flex gap-6 mt-14 animate-in slide-in-from-bottom-2 duration-300">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="w-full md:min-w-[12em] md:w-fit rounded-[8em] border border-brand-neutral-6 bg-brand-neutral-4 text-sm font-medium text-brand-secondary-6 hover:bg-brand-neutral-3 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <ActionButton1
                            buttonText={isSubmitting ? "Saving..." : "Save Changes"}
                            className="w-full md:w-57.5 text-sm! px-2!"
                            iconPosition="right"
                            buttonType="submit"
                            icon={isSubmitting ? "eos-icons:three-dots-loading" : "gravity-ui:arrow-right"}
                            isDisabled={isSubmitting || !isDirty}
                            isLoading={isSubmitting}
                        />
                    </div>
                    )}
                </div>
            </form>
        </div>
    )
}
