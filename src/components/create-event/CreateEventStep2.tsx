import { useForm, Controller, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomInput2 from "../custom-utils/inputs/CustomInput2";
import { Label } from "../ui/label";
import { Step2FormData, step2Schema } from "@/schemas/create-event.schema";
import AdditionalImagesUpload from "../custom-utils/inputs/FileUpload2";
import { FeaturedImageUpload } from "../custom-utils/inputs/FileUpload1";
import { Button } from "../ui/button";
import { Plus, Trash2 } from "lucide-react";
import CustomTextArea from "../custom-utils/inputs/CustomTextarea";
import { VideoUpload } from "../custom-utils/inputs/VideoUpload";
import PhoneNumberInput from "../custom-utils/inputs/CustomPhoneInput";
import MultiStepFormButtonDuo from "../custom-utils/buttons/MultiStepFormButtonDuo";
import { useEventCreation } from "@/contexts/create-event/CreateEventProvider";
import { useStepper } from "@/contexts/create-event/StepperProvider";
import { useAppSelector } from "@/lib/redux/hooks";


export default function CreateEventStep2() {

    const { updateStep, eventData } = useEventCreation()
    const { goToNextStep } = useStepper()
    const { user } = useAppSelector(store => store.authUser)

    const {
        control,
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Step2FormData>({
        resolver: zodResolver(step2Schema),
        // Restore previously saved data when navigating back
        defaultValues: {
            shortDescription:      eventData?.detailsMedia?.shortDescription      ?? "",
            fullDescription:       eventData?.detailsMedia?.fullDescription       ?? "",
            organizerDisplayName:  user?.business_name  ?? "",
            organizerDescription:  user?.description  ?? "",
            publicEmail:           eventData?.detailsMedia?.publicEmail           ?? "",
            phoneNumber:           eventData?.detailsMedia?.phoneNumber           ?? "",
            featuredImage:         eventData?.detailsMedia?.featuredImage         ?? undefined,
            additionalImages:      eventData?.detailsMedia?.additionalImages      ?? [],
            eventVideo:            eventData?.detailsMedia?.eventVideo            ?? undefined,
            socialMediaLinks:      eventData?.detailsMedia?.socialMediaLinks      ?? [],
        },
    })

    const { fields, append, remove } = useFieldArray({ control, name: "socialMediaLinks" })


    const handleStep2Submit: SubmitHandler<Step2FormData> = (data) => {
        updateStep("detailsMedia", data)
        goToNextStep()
    }

    const shortDescLen = watch("shortDescription")?.length ?? 0
    const fullDescLen  = watch("fullDescription")?.length  ?? 0

    return (
        <form
            className="relative flex flex-col min-h-full"
            onSubmit={handleSubmit(handleStep2Submit)}
            data-testid="create-event-step-2-form"
        >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-14 lg:gap-20">

                {/* Left: Descriptions + Media ─── */}
                <section className="space-y-12" data-testid="section-descriptions">
                    <div className="space-y-6">
                        <h3 className="text-brand-secondary-8 font-bold text-sm md:text-base">Event Description</h3>

                        <CustomInput2
                            label="Short Description"
                            placeholder="Enter Short Description"
                            {...register("shortDescription")}
                            helperText={`${shortDescLen}/160 characters max`}
                            required
                            error={errors.shortDescription?.message}
                            data-testid="input-short-description"
                        />

                        <CustomTextArea
                            label="Full Description"
                            placeholder="Includes agenda, performers, dress code..."
                            {...register("fullDescription")}
                            helperText={`${fullDescLen}/5000 characters max`}
                            required
                            error={errors.fullDescription?.message}
                            data-testid="textarea-full-description"
                        />
                    </div>

                    <div className="space-y-8" data-testid="section-media">
                        <div className="space-y-2.5">
                            <Label className="text-brand-secondary-9">
                                Featured Image <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                control={control}
                                name="featuredImage"
                                render={({ field }) => (
                                    <FeaturedImageUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.featuredImage?.message as string}
                                        data-testid="upload-featured-image"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-brand-secondary-9">Additional Images</Label>
                            <Controller
                                control={control}
                                name="additionalImages"
                                render={({ field }) => (
                                    <AdditionalImagesUpload
                                        value={field.value as (File | string)[]}
                                        onChange={field.onChange}
                                        maxImages={10}
                                        error={errors.additionalImages?.message}
                                        data-testid="upload-additional-images"
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <Label className="text-brand-secondary-9">Event Video <span className="text-brand-secondary-5 font-normal">(Optional)</span></Label>
                            <Controller
                                control={control}
                                name="eventVideo"
                                render={({ field }) => (
                                    <VideoUpload
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.eventVideo?.message}
                                        data-testid="upload-event-video"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </section>

                {/* Divider */}
                <div className="flex items-center justify-center" aria-hidden>
                    <div className="w-full lg:w-[1.5px] h-[1.5px] lg:h-full border-t-[1.5px] lg:border-t-0 lg:border-l-[1.5px] border-dashed border-brand-secondary-3 opacity-50" />
                </div>

                {/* Right: Organizer Info */}
                <section className="space-y-12" data-testid="section-organizer">
                    <div className="space-y-6">
                        <h3 className="text-brand-secondary-8 font-bold text-sm md:text-base">Organizer Information</h3>

                        <CustomInput2
                            label="Display Name"
                            placeholder="Dominic Evans"
                            {...register("organizerDisplayName")}
                            readOnly
                            error={errors.organizerDisplayName?.message}
                            data-testid="input-organizer-display-name"
                        />

                        <CustomTextArea
                            label="Organizer Description (Optional)"
                            placeholder="Enter Description"
                            {...register("organizerDescription")}
                            helperText={`${watch("organizerDescription")?.length ?? 0}/5000 characters max`}
                            error={errors.organizerDescription?.message}
                            data-testid="textarea-organizer-description"
                        />

                        <CustomInput2
                            label="Public Email"
                            placeholder="Enter email address"
                            {...register("publicEmail")}
                            error={errors.publicEmail?.message}
                            data-testid="input-public-email"
                        />

                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <PhoneNumberInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    error={errors.phoneNumber?.message}
                                    defaultCountry="NG"
                                    data-testid="input-phone-number"
                                />
                            )}
                        />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-6" data-testid="section-social-links">
                        <Label className="text-brand-secondary-9">
                            Social Media Links <span className="text-brand-secondary-5 font-normal">(Optional)</span>
                        </Label>

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex gap-3 items-center animate-in fade-in slide-in-from-top-2"
                                    data-testid={`social-link-row-${index}`}
                                >
                                    <div className="flex-1">
                                        <CustomInput2
                                            label=""
                                            placeholder="https://instagram.com/..."
                                            {...register(`socialMediaLinks.${index}.url`)}
                                            error={errors.socialMediaLinks?.[index]?.url?.message}
                                            data-testid={`input-social-link-${index}`}
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:bg-red-50 mt-1"
                                        aria-label={`Remove social link ${index + 1}`}
                                        data-testid={`btn-remove-social-link-${index}`}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => append({ id: crypto.randomUUID(), platform: "custom", url: "" })}
                                className="w-full h-14 rounded-lg border-2 border-dashed border-brand-secondary-3 text-brand-secondary-5 flex items-center justify-center gap-2 hover:bg-neutral-50 hover:border-brand-secondary-4 transition-all text-sm font-medium"
                                data-testid="btn-add-social-link"
                            >
                                <Plus className="size-4" />
                                Add more Links
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-20 mt-10">
                <div />
                <div />
                <div>
                    <MultiStepFormButtonDuo />
                </div>
            </div>
        </form>
    )
}