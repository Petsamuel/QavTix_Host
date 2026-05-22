"use client"

import { useState } from "react"
import { useForm, Controller, useFieldArray, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { space_grotesk } from "@/lib/fonts"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setUser } from "@/lib/redux/slices/authUserSlice"
import { showAlert } from "@/lib/redux/slices/alertSlice"
import { updateHostProfile } from "@/actions/settings/profile"
import { ApiCategory } from "@/actions/filters"

import CustomInput2 from "@/components/custom-utils/inputs/CustomInput2"
import CustomSelect2 from "@/components/custom-utils/inputs/CustomSelect2"
import CustomTextArea from "@/components/custom-utils/inputs/CustomTextarea"
import ActionButton1 from "@/components/custom-utils/buttons/ActionBtn1"
import { Checkbox } from "@/components/ui/checkbox"

const BUSINESS_TYPES = [
    { value: 'llc', label: 'Limited Liability Company' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'sole proprietorship', label: 'Sole Proprietorship' },
    { value: 'nonprofit', label: 'Nonprofit Organization' },
    { value: 'cooperative', label: 'Cooperative' },
    { value: 'llp', label: 'LLP' },
]

// We use one combined schema, but make fields optional depending on type.
// For validation, we use a superRefine or just make them optional and handle it via TS.
const businessSchema = z.object({
    brandName: z.string().optional(),
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    registrationNumber: z.string().optional(),
    taxId: z.string().optional(),
    nin: z.string().min(1, "NIN is required"),
    postalCode: z.string().optional(),
    description: z.string().max(280, "Maximum 280 characters").optional(),
    relevantLinks: z.array(z.object({
        link: z.string().url("Must be a valid URL").or(z.literal(''))
    })).optional(),
    categories: z.array(z.number()).min(1, "Select at least one category"),
})

type BusinessFormValues = z.infer<typeof businessSchema>

interface Props {
    user: AuthUser
    categories: ApiCategory[]
}

export default function BusinessInfoForm({ user, categories }: Props) {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const isOrg = user.account_type === "organization"

    const defaultLinks = user.relevant_links?.length
        ? user.relevant_links.map(l => ({ link: l.url }))
        : [{ link: '' }]

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<BusinessFormValues>({
        resolver: zodResolver(businessSchema),
        defaultValues: {
            brandName: user.business_name ?? "",
            businessName: user.business_name ?? "",
            businessType: user.business_type ?? "",
            registrationNumber: user.registration_number ?? "",
            taxId: user.tax_id ?? "",
            nin: user.nin ?? "",
            postalCode: user.postal_code ?? "",
            description: user.description ?? "",
            relevantLinks: defaultLinks,
            categories: user.categories ?? [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "relevantLinks",
    })

    const watchedCategories = watch("categories") ?? []

    const toggleCategory = (categoryId: number) => {
        const updated = watchedCategories.includes(categoryId)
            ? watchedCategories.filter(id => id !== categoryId)
            : [...watchedCategories, categoryId]
        setValue("categories", updated, { shouldDirty: true, shouldValidate: true })
    }

    const onSubmit: SubmitHandler<BusinessFormValues> = async (values) => {
        const links = (values.relevantLinks ?? [])
            .filter(r => r.link)
            .map((r) => ({ url: r.link }))

        const payload = {
            business_name: isOrg ? values.businessName : values.brandName,
            nin: values.nin,
            postal_code: values.postalCode,
            description: values.description,
            relevant_links: links,
            categories: values.categories,
            ...(isOrg && {
                business_type: values.businessType,
                registration_number: values.registrationNumber,
                tax_id: values.taxId,
            }),
        }

        const res = await updateHostProfile(payload)

        if (res.success && res.data) {
            dispatch(setUser(res.data))
            setIsEditing(false)
            reset({
                ...values,
            })
            dispatch(showAlert({
                variant: "success",
                title: "Business Info Updated",
                description: "Your business information has been updated successfully.",
            }))
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Update failed",
                description: res.message || "Failed to update business info.",
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
                    Business Information {isOrg ? "(Organization)" : "(Individual)"}
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
                {/* DYNAMIC FIELDS based on Account Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    {!isOrg ? (
                        <>
                            <CustomInput2
                                required
                                label="Brand Name"
                                error={errors.brandName?.message}
                                disabled={!isEditing}
                                {...register("brandName")}
                            />
                            <CustomInput2
                                required
                                label="National Identification Number"
                                error={errors.nin?.message}
                                disabled={!isEditing}
                                {...register("nin")}
                            />
                        </>
                    ) : (
                        <>
                            <CustomInput2
                                required
                                label="Business/Organization Name"
                                error={errors.businessName?.message}
                                disabled={!isEditing}
                                {...register("businessName")}
                            />

                            <Controller
                                name="businessType"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect2
                                        label="Business Type"
                                        required
                                        options={BUSINESS_TYPES}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        error={errors.businessType?.message}
                                        disabled={!isEditing}
                                    />
                                )}
                            />

                            <CustomInput2
                                required
                                label="Business Registration Number"
                                error={errors.registrationNumber?.message}
                                disabled={!isEditing}
                                {...register("registrationNumber")}
                            />

                            <CustomInput2
                                required
                                label="Tax ID/TIN"
                                error={errors.taxId?.message}
                                disabled={!isEditing}
                                {...register("taxId")}
                            />

                            <CustomInput2
                                required
                                label="National Identification Number"
                                error={errors.nin?.message}
                                disabled={!isEditing}
                                {...register("nin")}
                            />
                        </>
                    )}

                    <CustomInput2
                        label="Postal/Zip Code (Optional)"
                        error={errors.postalCode?.message}
                        disabled={!isEditing}
                        {...register("postalCode")}
                    />

                    <div className="md:col-span-2">
                        <CustomTextArea
                            label="Headline / Description (Optional)"
                            placeholder="Let your audience meet you"
                            disabled={!isEditing}
                            {...register("description")}
                            error={errors.description?.message}
                            maxLength={280}
                        />
                        <div className="flex justify-end mt-1">
                            <span className="text-xs text-brand-neutral-6 font-medium">
                                {watch("description")?.length || 0}/280
                            </span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-brand-neutral-9 mb-2">
                        Relevant links <span className="text-brand-neutral-6">(Optional)</span>
                    </label>
                    <div className="space-y-3 md:max-w-md">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <input
                                        {...register(`relevantLinks.${index}.link`)}
                                        placeholder="https://website.com or social media link"
                                        disabled={!isEditing}
                                        className={cn(
                                            "w-full px-4 py-3 text-sm rounded-lg h-14 transition-all outline-none bg-white text-brand-neutral-9 placeholder:text-brand-secondary-5",
                                            errors.relevantLinks?.[index]?.link
                                                ? "border border-red-400 focus:border-red-500"
                                                : "border-[1.5px] border-brand-neutral-5 focus:border-[1.5px] focus:border-brand-primary hover:border-brand-neutral-6",
                                            !isEditing && "bg-brand-neutral-1 opacity-80"
                                        )}
                                    />
                                    {errors.relevantLinks?.[index]?.link && (
                                        <p className="text-xs text-red-500 mt-1">
                                            {errors.relevantLinks[index]?.link?.message}
                                        </p>
                                    )}
                                </div>
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
                                    >
                                        <Icon icon="jam:close" width="24" height="24" />
                                    </button>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => append({ link: "" })}
                                className="flex items-center gap-2 text-brand-primary hover:text-brand-primary-7 font-medium text-sm mt-2"
                            >
                                <Icon icon="stash:plus-duotone" width="20" height="20" />
                                Add another link
                            </button>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 pt-6">
                    <label className="block text-sm font-medium text-brand-neutral-9 mb-5">
                        Select event categories you host <span className="text-red-500">*</span>
                    </label>

                    {categories.length === 0 ? (
                        <div className="flex items-center gap-2 text-brand-neutral-5 text-sm py-4">
                            <Icon icon="eos-icons:three-dots-loading" className="size-6 text-brand-primary" />
                            Loading categories...
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`categories-${category.id}`}
                                        disabled={!isEditing}
                                        checked={watchedCategories.includes(category.id)}
                                        onCheckedChange={() => toggleCategory(category.id)}
                                    />
                                    <label
                                        htmlFor={`categories-${category.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {category.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {errors.categories && (
                        <p className="text-xs text-red-500 mt-1.5 ml-1">
                            {errors.categories.message}
                        </p>
                    )}
                </div>

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
            </form>
        </div>
    )
}
