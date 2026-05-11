import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
import { Plus, Info } from "lucide-react";
import CustomInput2 from "../custom-utils/inputs/CustomInput2";
import CustomSelect2 from "../custom-utils/inputs/CustomSelect2";
import { Step1FormData, step1Schema } from "@/schemas/create-event.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomDateTimeInput } from "../custom-utils/inputs/CustomDateTimeInput";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import { EVENT_CATEGORIES, POPULAR_TAGS } from "@/lib/features/create-event/resources/constants";
import MultiSelectTags from "../custom-utils/inputs/MultiSelectTags";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { countries, getStates } from "@/components-data/location";
import ActionButton1 from "../custom-utils/buttons/ActionBtn1";
import { useEventCreation } from "@/contexts/create-event/CreateEventProvider";
import { useStepper } from "@/contexts/create-event/StepperProvider";
import { useEffect } from "react";
import { generateMapLink } from "@/helper-fns/generateMapLink";
import { writeEventDraft, useStepDraftSync } from "@/custom-hooks/UseEventDraftPersist";
import MultiStepFormButtonDuo from "../custom-utils/buttons/MultiStepFormButtonDuo";

export default function CreateEventStep1() {

    const { updateStep, eventData, categories, hasDraftAvailable, isEditMode, isDuplicate } = useEventCreation()
    const { goToNextStep } = useStepper()

    const {
        control,
        formState: { errors },
        setValue,
        watch,
        register,
        handleSubmit,
    } = useForm<Step1FormData>({
        resolver: yupResolver(step1Schema, { abortEarly: false }) as any,
        // Restore previously saved data if user navigates back
        defaultValues: {
            eventTitle: eventData.basicInformation?.eventTitle ?? "",
            eventCategory: eventData.basicInformation?.eventCategory ?? "",
            additionalTags: eventData.basicInformation?.additionalTags ?? [],
            eventType: eventData.basicInformation?.eventType ?? "single",
            locationType: eventData.basicInformation?.locationType ?? "physical",
            startDateTime: eventData.basicInformation?.startDateTime ?? "",
            endDateTime: eventData.basicInformation?.endDateTime ?? "",
            dates: eventData.basicInformation?.dates ?? [{ startDateTime: "", endDateTime: "" }],
            venueName: eventData.basicInformation?.venueName ?? "",
            address: eventData.basicInformation?.address ?? "",
            country: eventData.basicInformation?.country ?? "",
            state: eventData.basicInformation?.state ?? "",
            city: eventData.basicInformation?.city ?? "",
            postalCode: eventData.basicInformation?.postalCode ?? "",
            onlineLink: eventData.basicInformation?.onlineLink ?? "",
        },
    })

    useStepDraftSync({
        stepKey: "basicInformation",
        control,
        enabled: !hasDraftAvailable && !isEditMode,
        eventData,
        hasMinimumData: !!watch('eventTitle')?.trim(),
    })

    const eventType = watch("eventType")
    const locationType = watch("locationType")
    const selectedTags = watch("additionalTags") || []

    const { fields, append, remove } = useFieldArray({ control, name: "dates" })

    const handleStep1Submit: SubmitHandler<Step1FormData> = (data) => {
        updateStep("basicInformation", {
            ...data,
            startDateTime: data.startDateTime!,
            endDateTime: data.endDateTime!,
        })

        if (!isEditMode && !isDuplicate) {
            writeEventDraft({
                ...eventData,
                basicInformation: data,
            })
        }
        goToNextStep()
    }

    const country = watch("country")
    const state = watch("state")
    const venueName = watch("venueName")
    const address = watch("address")
    const city = watch("city")

    const isLocationReadyForMap = () => {
        if (locationType !== "physical") return false;
        return (
            (venueName && city) ||
            (address && city) ||
            (venueName && address)
        )
    }

    const handleFindOnMap = () => {
        const url = generateMapLink({ venueName, address, city, state, country })

        window.open(url, "_blank")
    }

    // Clear recurring dates array when switching back to single
    useEffect(() => {
        if (eventType !== "recurring") {
            setValue("dates", [])
        } else if (fields.length === 0) {
            append({ startDateTime: "", endDateTime: "" })
        }
    }, [eventType])

    return (
        <form
            className="space-y-10 md:pb-20"
            onSubmit={handleSubmit(handleStep1Submit)}
            data-testid="create-event-step-1-form"
        >
            {/* Event Basics */}
            <section data-testid="section-event-basics">
                <h3 className="text-brand-secondary-8 mb-5 font-bold text-sm md:text-base">Event Basics</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    <CustomInput2
                        label="Event Title"
                        placeholder="E.g: Burna Boy Live in Concert 2025"
                        {...register("eventTitle")}
                        required
                        error={errors.eventTitle?.message}
                        data-testid="input-event-title"
                    />

                    <Controller
                        name="eventCategory"
                        defaultValue=""
                        control={control}
                        render={({ field }) => (
                            <CustomSelect2
                                label="Event Category"
                                options={categories.map(c => ({ label: c.name, value: c.id.toString() }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                required
                                error={errors.eventCategory?.message}
                                data-testid="select-event-category"
                            />
                        )}
                    />

                    <div className="space-y-2" data-testid="input-additional-tags">
                        <label className="text-sm font-medium text-brand-secondary-9 block">
                            Additional Tags <span className="text-brand-secondary-5 font-normal">(up to 5)</span>
                        </label>
                        <MultiSelectTags
                            options={POPULAR_TAGS}
                            selected={selectedTags}
                            onChange={(v) => setValue("additionalTags", v)}
                            placeholder="Select event tags..."
                            maxDisplay={3}
                        />
                        {errors.additionalTags && (
                            <p className="text-xs text-red-500 mt-1.5 ml-1" role="alert">
                                {errors.additionalTags?.message}
                            </p>
                        )}
                    </div>
                </div>
            </section>

            {/* Date & Time */}
            <section className="space-y-5" data-testid="section-date-time">
                <h3 className="text-brand-secondary-8 font-bold text-sm md:text-base">Date & Time</h3>

                <Controller
                    control={control}
                    name="eventType"
                    render={({ field }) => (
                        <RadioGroup
                            {...field}
                            onValueChange={field.onChange}
                            className="w-fit flex gap-6"
                            data-testid="radio-event-type"
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="single"
                                    id="eventType-r1"
                                    className={cn(
                                        "size-5 border-2 cursor-pointer transition-colors",
                                        "border-brand-secondary-3",
                                        "data-[state=checked]:border-brand-primary-6",
                                        "focus-visible:ring-brand-primary-6"
                                    )}
                                    circleIconClass="size-3 text-brand-primary-6 fill-brand-primary-6"
                                    data-testid="radio-event-type-single"
                                />
                                <Label htmlFor="eventType-r1" className="cursor-pointer text-sm font-medium text-brand-secondary-9">
                                    Single Event
                                </Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <RadioGroupItem
                                    value="recurring"
                                    id="eventType-r2"
                                    className={cn(
                                        "size-5 border-2 cursor-pointer transition-colors",
                                        "border-brand-secondary-3",
                                        "data-[state=checked]:border-brand-primary-6",
                                        "focus-visible:ring-brand-primary-6"
                                    )}
                                    circleIconClass="size-3 text-brand-primary-6"
                                    data-testid="radio-event-type-recurring"
                                />
                                <Label htmlFor="eventType-r2" className="cursor-pointer font-medium text-brand-secondary-9">
                                    Recurring Event
                                </Label>
                            </div>
                        </RadioGroup>
                    )}
                />

                {eventType === "recurring" && (
                    <div className="flex items-center gap-2 text-xs text-brand-secondary-8" role="note">
                        <Info className="size-4 shrink-0" />
                        <span>Suitable for events with multiple days</span>
                    </div>
                )}

                {/* Single */}
                {eventType === "single" && (
                    <div className="grid grid-cols-2 gap-5 max-w-xl" data-testid="single-event-dates">
                        <Controller
                            name="startDateTime"
                            control={control}
                            render={({ field }) => (
                                <CustomDateTimeInput
                                    label="Start Date & Time"
                                    name={field.name}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    error={errors.startDateTime?.message}
                                />
                            )}
                        />
                        <Controller
                            name="endDateTime"
                            control={control}
                            render={({ field }) => (
                                <CustomDateTimeInput
                                    label="End Date & Time"
                                    name={field.name}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    onBlur={field.onBlur}
                                    error={errors.endDateTime?.message}
                                />
                            )}
                        />
                    </div>
                )}

                {/* Recurring */}
                {eventType === "recurring" && (
                    <div className="space-y-6 max-w-xl" data-testid="recurring-event-dates">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-wrap md:flex-nowrap flex-row items-start sm:items-end gap-4" data-testid={`recurring-date-row-${index}`}>

                                {/* Mobile remove */}
                                {index > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 size-9 shrink-0 md:hidden"
                                        data-testid={`remove-date-mobile-${index}`}
                                        aria-label={`Remove day ${index + 1}`}
                                    >
                                        <Icon icon="lucide:trash-2" className="size-4" />
                                    </Button>
                                )}
                                {index === 0 && (
                                    <div className="flex flex-col md:hidden">
                                        <span className="text-sm font-medium text-brand-secondary-8">Add Date</span>
                                        <button
                                            type="button"
                                            onClick={() => append({ startDateTime: "", endDateTime: "" })}
                                            className="flex items-center gap-2 h-12 p-3 bg-brand-primary-1 w-fit rounded-md border-brand-neutral-3 text-brand-primary-4 hover:border-brand-primary-4 hover:text-brand-primary-6 transition-all group"
                                            data-testid="add-recurring-date-mobile"
                                            aria-label="Add another day"
                                        >
                                            <Plus className="w-5 h-5 group-hover:scale-105 transition-transform" />
                                        </button>
                                    </div>
                                )}

                                <Controller
                                    name={`dates.${index}.startDateTime`}
                                    control={control}
                                    render={({ field: f }) => (
                                        <CustomDateTimeInput
                                            label={index === 0 ? "First Day" : `Day ${index + 1}`}
                                            name={f.name}
                                            value={f.value ?? ""}
                                            onChange={(e) => f.onChange(e.target.value)}
                                            onBlur={f.onBlur}
                                            error={errors.dates?.[index]?.startDateTime?.message}
                                            disablePastDate
                                            data-testid={`input-recurring-start-${index}`}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`dates.${index}.endDateTime`}
                                    control={control}
                                    render={({ field: f }) => (
                                        <CustomDateTimeInput
                                            label="End Time"
                                            name={f.name}
                                            value={f.value ?? ""}
                                            onChange={(e) => f.onChange(e.target.value)}
                                            onBlur={f.onBlur}
                                            error={errors.dates?.[index]?.endDateTime?.message}
                                            disablePastDate
                                            data-testid={`input-recurring-end-${index}`}
                                        />
                                    )}
                                />

                                {/* Desktop remove */}
                                {index > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 size-9 shrink-0 hidden md:block"
                                        data-testid={`remove-date-desktop-${index}`}
                                        aria-label={`Remove day ${index + 1}`}
                                    >
                                        <Icon icon="lucide:trash-2" className="size-4" />
                                    </Button>
                                )}
                                {index === 0 && (
                                    <div className="flex-col hidden md:flex">
                                        <span className="text-xs whitespace-nowrap font-medium text-brand-secondary-8">Add Date</span>
                                        <button
                                            type="button"
                                            onClick={() => append({ startDateTime: "", endDateTime: "" })}
                                            className="flex items-center gap-2 h-10 p-3 bg-brand-primary-1 w-fit rounded-md border-brand-neutral-3 text-brand-primary-4 hover:border-brand-primary-4 hover:text-brand-primary-6 transition-all group"
                                            data-testid="add-recurring-date-desktop"
                                            aria-label="Add another day"
                                        >
                                            <Plus className="w-5 h-5 group-hover:scale-105 transition-transform" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Location */}
            <section className="space-y-5" data-testid="section-location">
                <h3 className="text-brand-secondary-8 font-bold text-sm md:text-base">Location</h3>

                <Controller
                    control={control}
                    name="locationType"
                    render={({ field }) => (
                        <RadioGroup
                            {...field}
                            onValueChange={field.onChange}
                            className="w-fit flex gap-6"
                            data-testid="radio-location-type"
                        >
                            {(["physical", "online", "tba"] as const).map((val) => (
                                <div key={val} className="flex items-center gap-3">
                                    <RadioGroupItem
                                        value={val}
                                        id={`loc-${val}`}
                                        className={cn(
                                            "size-5 border-2 cursor-pointer transition-colors",
                                            "border-brand-secondary-3",
                                            "data-[state=checked]:border-brand-primary-6",
                                            "focus-visible:ring-brand-primary-6"
                                        )}
                                        circleIconClass="size-3 text-brand-primary-6"
                                        data-testid={`radio-location-${val}`}
                                    />
                                    <Label htmlFor={`loc-${val}`} className="cursor-pointer font-medium text-brand-secondary-9 text-xs md:text-sm">
                                        {val === "physical" ? "Physical Venue" : val === "online" ? "Online Event" : "To Be Announced"}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                />

                {locationType === "physical" && (
                    <div className="space-y-6" data-testid="location-physical-fields">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <CustomInput2
                                label="Venue Name"
                                placeholder="E.g: Eko Atlantic Energy City"
                                {...register("venueName")}
                                error={errors.venueName?.message}
                                data-testid="input-venue-name"
                            />
                            <CustomInput2
                                label="Address"
                                placeholder="Enter Street Address"
                                {...register("address")}
                                error={errors.address?.message}
                                data-testid="input-address"
                            />
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect2
                                        label="Country"
                                        options={countries}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        data-testid="select-country"
                                        error={errors.country?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect2
                                        label="State"
                                        options={country ? getStates(country) : []}
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        error={errors.state?.message}
                                        data-testid="select-state"
                                    />
                                )}
                            />
                            <CustomInput2
                                label="City"
                                placeholder="Enter City"
                                {...register("city")}
                                error={errors.city?.message}
                                data-testid="input-city"
                            />
                            <CustomInput2
                                label="Postal Code/Zip Code"
                                placeholder="Enter Postal/Zip Code (Optional)"
                                {...register("postalCode")}
                                error={errors.postalCode?.message}
                                data-testid="input-postal-code"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleFindOnMap}
                            disabled={!isLocationReadyForMap()}
                            className="flex disabled:cursor-not-allowed items-center gap-1 text-brand-primary-6 disabled:opacity-50 font-semibold text-sm hover:underline"
                            data-testid="btn-find-on-map"

                        >
                            Find on Map
                            <Icon icon="tabler:arrow-right" width="24" height="24" className="size-5" />
                        </button>
                    </div>
                )}

                {locationType === "online" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="location-online-fields">
                        <CustomInput2
                            label="Online Event Venue"
                            placeholder="E.g: Google Meet, Zoom, etc."
                            {...register("venueName")}
                            error={errors.venueName?.message}
                            data-testid="input-venue-name"
                        />
                        <CustomInput2
                            label="Event Link"
                            placeholder="E.g: https://zoom.us/j/123456"
                            {...register("onlineLink")}
                            error={errors.onlineLink?.message}
                            data-testid="input-online-link"
                        />
                    </div>
                )}

                {locationType === "tba" && (
                    <div className="flex items-center gap-2 text-xs text-brand-secondary-8" role="note" data-testid="location-tba-notice">
                        <Info className="size-4 shrink-0" />
                        <span>Event Location Details will be emailed to Registered Attendees</span>
                    </div>
                )}
            </section>

            <MultiStepFormButtonDuo />
        </form>
    )
}