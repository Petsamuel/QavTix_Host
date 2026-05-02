'use client'

import { useForm, useFieldArray, FormProvider, Controller, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Trash2, ChevronDown } from 'lucide-react'
import CreateEventPricingSummary from './CreateEventPricingSummary'
import { Step3FormData, step3Schema } from '@/schemas/create-event.schema'
import CustomSelect2 from '../custom-utils/inputs/CustomSelect2'
import { TICKET_TYPE_PRESETS } from '@/lib/features/create-event/resources/constants'
import CustomInput2 from '../custom-utils/inputs/CustomInput2'
import CustomPriceInput from '../custom-utils/inputs/CustomPriceInput'
import CustomPercentageInput from '../custom-utils/inputs/CustomPercentageInput'
import { Icon } from '@iconify/react'
import CustomDatePicker from '../custom-utils/inputs/CustomDatePicker'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import MultiStepFormButtonDuo from '../custom-utils/buttons/MultiStepFormButtonDuo'
import { useEventCreation } from '@/contexts/create-event/CreateEventProvider'
import { useStepper } from '@/contexts/create-event/StepperProvider'
import { cn } from '@/lib/utils'
import { usePlanRestrictions } from '@/custom-hooks/useRestriction'
import { PlanGateBanner } from './PlanGateBanner'
import { CustomDateTimeInput } from '../custom-utils/inputs/CustomDateTimeInput'
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip'

const LabelWithTooltip = ({ label, tooltipText }: { label: string, tooltipText: string }) => (
    <div className="flex items-center gap-1.5">
        {label}
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    aria-label={label}
                    className="text-brand-secondary-6 hover:text-brand-secondary-8 transition-colors"
                >
                    <Icon icon="carbon:information" className="size-3.5 text-brand-accent-6" />
                </button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltipText}</p>
            </TooltipContent>
        </Tooltip>
    </div>
);

export default function CreateEventStep3() {

    const { updateStep, eventData } = useEventCreation()
    const { goToNextStep } = useStepper()
    const plan = usePlanRestrictions()

    const methods = useForm<Step3FormData>({
        resolver: yupResolver(step3Schema, { abortEarly: false }) as any,
        mode: 'onTouched',
        defaultValues: {
            ticketTypes: eventData.ticketsPricing?.ticketTypes ?? [{ id: crypto.randomUUID(), ticketType: '', price: 0, currency: 'NGN', quantity: 1 }],
            refundPolicy: eventData.ticketsPricing?.refundPolicy ?? 'no',
            customRefundPercentage: eventData.ticketsPricing?.customRefundPercentage ?? 1,
            salesPeriod: eventData.ticketsPricing?.salesPeriod ?? {
                startDateTime: "",
                endDateTime: "",
            },
        },
    })

    const { register, control, watch, setValue, handleSubmit, formState: { errors } } = methods
    const { fields, append, remove } = useFieldArray({ control, name: "ticketTypes" })
    const refundPolicy = watch('refundPolicy')
    const allTickets = watch("ticketTypes") ?? []

    // How many promo codes are currently filled across all tickets
    const totalPromoCodes = allTickets.reduce((acc, t) => {
        return acc + (!!(t.promoCode?.codeWord?.trim()) ? 1 : 0)
    }, 0)

    const canAddAnotherTicketType = plan.canAddTicketType(fields.length)

    const handleStep3Submit: SubmitHandler<Step3FormData> = (data) => {
        updateStep("ticketsPricing", data)
        goToNextStep()
    }



    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col lg:flex-row gap-10 items-start"
                onSubmit={handleSubmit(handleStep3Submit)}
                data-testid="create-event-step-3-form"
            >
                <div
                    className="flex-1 w-full space-y-12"
                >
                    {/* ── Ticket Info ─ */}
                    <section className="space-y-6" data-testid="section-ticket-info">
                        <div className="flex items-center justify-between">
                            <h3 className="text-brand-secondary-8 font-bold text-sm md:text-base">Ticket Info</h3>
                            {plan.ticketTypeLimit !== null && (
                                <span
                                    className={cn(
                                        "text-xs font-medium tabular-nums",
                                        fields.length >= plan.ticketTypeLimit
                                            ? "text-amber-600"
                                            : "text-brand-secondary-5"
                                    )}
                                    data-testid="ticket-type-counter"
                                >
                                    {fields.length}/{plan.ticketTypeLimit} ticket type{plan.ticketTypeLimit === 1 ? "" : "s"}
                                </span>
                            )}
                        </div>

                        {fields.map((field, index) => {
                            const existingCode = allTickets[index]?.promoCode?.codeWord?.trim()
                            // This ticket can have a code if: plan allows it AND (it already has one OR limit not reached)
                            const promoEditable =
                                plan.canUsePromoCodes &&
                                plan.promoCodeLimit > 0 &&
                                (!!(existingCode) || totalPromoCodes < plan.promoCodeLimit)

                            return (
                                <div
                                    key={field.id}
                                    className="space-y-6 relative border-b last-of-type:border-b-0 border-brand-neutral-5 pb-12 mb-12 last-of-type:pb-0 last-of-type:mb-6"
                                    data-testid={`ticket-type-row-${index}`}
                                >
                                    {fields.length > 1 && (
                                        <button
                                            title="Remove Ticket Type"
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="absolute -top-4 right-4 text-red-400 hover:text-red-600 transition-colors"
                                            aria-label={`Remove ticket type ${index + 1}`}
                                            data-testid={`btn-remove-ticket-type-${index}`}
                                        >
                                            <Trash2 className="size-4 md:size-5" />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Controller
                                            name={`ticketTypes.${index}.ticketType`}
                                            control={control}
                                            render={({ field: selectField }) => (
                                                <CustomSelect2
                                                    label="Ticket Type"
                                                    options={TICKET_TYPE_PRESETS.map(v => ({ label: v, value: v }))}
                                                    value={selectField.value}
                                                    onValueChange={selectField.onChange}
                                                    error={errors.ticketTypes?.[index]?.ticketType?.message}
                                                    data-testid={`select-ticket-type-${index}`}
                                                />
                                            )}
                                        />
                                        <CustomInput2
                                            label="Ticket Description (Optional)"
                                            placeholder="Enter Ticket description"
                                            error={errors.ticketTypes?.[index]?.description?.message}
                                            {...register(`ticketTypes.${index}.description`)}
                                            data-testid={`input-ticket-description-${index}`}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <CustomPriceInput
                                            label="Price"
                                            value={watch(`ticketTypes.${index}.price`) as number}
                                            onChange={(val) => setValue(`ticketTypes.${index}.price`, Number(val))}
                                            currency={watch(`ticketTypes.${index}.currency`)}
                                            onCurrencyChange={(curr) => setValue(`ticketTypes.${index}.currency`, curr)}
                                            error={errors.ticketTypes?.[index]?.price?.message}
                                            data-testid={`input-ticket-price-${index}`}
                                            disableCurrencySelect
                                        />
                                        <CustomInput2
                                            label={<LabelWithTooltip label="Quantity" tooltipText="The total number of available tickets for this category." />}
                                            type="number"
                                            placeholder="Available No. of Tickets"
                                            error={errors.ticketTypes?.[index]?.quantity?.message}
                                            {...register(`ticketTypes.${index}.quantity`, { valueAsNumber: true })}
                                            data-testid={`input-ticket-quantity-${index}`}
                                        />
                                        <CustomInput2
                                            label={<LabelWithTooltip label="Per Person Max" tooltipText="The maximum number of tickets a single person can buy." />}
                                            type="number"
                                            placeholder="Eg: 100"
                                            error={errors.ticketTypes?.[index]?.perPersonMax?.message}
                                            {...register(`ticketTypes.${index}.perPersonMax`, { valueAsNumber: true })}
                                            data-testid={`input-ticket-per-person-max-${index}`}
                                        />
                                    </div>

                                    {/* ── Promo Code ─────────────────────── */}
                                    <div
                                        className="pt-6 border-t border-dashed border-brand-secondary-2 space-y-4"
                                        data-testid={`section-promo-code-${index}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-brand-secondary-8 font-bold md:text-base text-sm">
                                                Promo Code
                                            </h4>
                                            {/* Per-plan usage counter */}
                                            {plan.canUsePromoCodes && plan.promoCodeLimit > 0 && (
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium tabular-nums",
                                                        totalPromoCodes >= plan.promoCodeLimit
                                                            ? "text-amber-600"
                                                            : "text-brand-secondary-5"
                                                    )}
                                                    data-testid={`promo-counter-${index}`}
                                                >
                                                    {totalPromoCodes}/{plan.promoCodeLimit} used
                                                </span>
                                            )}
                                            {/* Locked badge */}
                                            {!plan.canUsePromoCodes && (
                                                <span className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                                                    <Icon icon="lucide:lock" className="size-3" />
                                                    Upgrade required
                                                </span>
                                            )}
                                        </div>

                                        {/* Plan doesn't include promo codes at all */}
                                        {plan.promoCodeLimitMsg ? (
                                            <PlanGateBanner
                                                message={plan.promoCodeLimitMsg}
                                                variant="inline"
                                                data-testid={`promo-gate-${index}`}
                                            />
                                        ) : (
                                            <>
                                                <div className={cn(
                                                    "grid grid-cols-1 md:grid-cols-4 gap-4 transition-opacity",
                                                    !promoEditable && "opacity-50 pointer-events-none"
                                                )}>
                                                    <CustomInput2
                                                        label="Code Word"
                                                        placeholder="Enter Promo Code"
                                                        disabled={!promoEditable}
                                                        error={errors.ticketTypes?.[index]?.promoCode?.codeWord?.message}
                                                        {...register(`ticketTypes.${index}.promoCode.codeWord`)}
                                                        data-testid={`input-promo-code-${index}`}
                                                    />
                                                    <CustomPercentageInput
                                                        label="Discount Amount"
                                                        value={watch(`ticketTypes.${index}.promoCode.discountAmount`) as number}
                                                        onChange={(val) => setValue(`ticketTypes.${index}.promoCode.discountAmount`, Number(val))}
                                                        error={errors.ticketTypes?.[index]?.promoCode?.discountAmount?.message}
                                                        data-testid={`input-promo-discount-${index}`}
                                                    />
                                                    <CustomInput2
                                                        label="Maximum Users"
                                                        type="number"
                                                        placeholder="50"
                                                        disabled={!promoEditable}
                                                        error={errors.ticketTypes?.[index]?.promoCode?.maximumUsers?.message}
                                                        {...register(`ticketTypes.${index}.promoCode.maximumUsers`, { valueAsNumber: true })}
                                                        data-testid={`input-promo-max-users-${index}`}
                                                    />
                                                    <Controller
                                                        name={`ticketTypes.${index}.promoCode.validTill`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <CustomDatePicker
                                                                label="Valid Till"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                disabled={!promoEditable}
                                                                error={errors.ticketTypes?.[index]?.promoCode?.validTill?.message}
                                                                data-testid={`input-promo-valid-till-${index}`}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                {/* Limit reached and this ticket doesn't already have a code */}
                                                {!promoEditable && !existingCode && plan.canUsePromoCodes && (
                                                    <PlanGateBanner
                                                        message={`You've used all ${plan.promoCodeLimit} promo code${plan.promoCodeLimit === 1 ? "" : "s"} allowed on your plan. Upgrade to add more.`}
                                                        variant="inline"
                                                        data-testid={`promo-limit-reached-${index}`}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {/* ── Add Ticket Type ───────────────────────── */}
                        <div className="space-y-2" data-testid="add-ticket-type-wrapper">
                            <button
                                type="button"
                                onClick={() => {
                                    if (!canAddAnotherTicketType) return
                                    append({ id: crypto.randomUUID(), ticketType: '', price: 0, currency: 'NGN', quantity: 1 })
                                }}
                                disabled={!canAddAnotherTicketType}
                                className={cn(
                                    "w-59 h-14 text-sm rounded-[6px] border-[1.4px] border-dashed transition-all",
                                    canAddAnotherTicketType
                                        ? "border-brand-secondary-5 bg-transparent hover:bg-brand-primary-1 hover:border-brand-primary-7 text-brand-secondary-5"
                                        : "border-amber-200 bg-amber-50/60 text-amber-500 cursor-not-allowed"
                                )}
                                data-testid="btn-add-ticket-type"
                                aria-disabled={!canAddAnotherTicketType}
                            >
                                <span className="flex items-center text-sm justify-center gap-2">
                                    {canAddAnotherTicketType
                                        ? <Icon icon="lucide:plus" className="w-4 h-4" />
                                        : <Icon icon="lucide:lock" className="w-4 h-4" />
                                    }
                                    {canAddAnotherTicketType ? "Add Another Ticket Type" : "Ticket type limit reached"}
                                </span>
                            </button>

                            {!canAddAnotherTicketType && plan.ticketTypeLimitMsg && (
                                <PlanGateBanner
                                    message={plan.ticketTypeLimitMsg}
                                    variant="inline"
                                    data-testid="ticket-type-limit-msg"
                                />
                            )}
                        </div>
                    </section>

                    {/* ── Sales Period  */}
                    <section className="space-y-6 md:max-w-md" data-testid="section-sales-period">
                        <h3 className="text-brand-secondary-8 font-bold text-sm md:text-base">Sales Period</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Controller
                                name="salesPeriod.startDateTime"
                                control={control}
                                render={({ field }) => (
                                    <CustomDateTimeInput
                                        label="Start Date & Time"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        error={errors.salesPeriod?.startDateTime?.message}
                                        data-testid="input-sales-start"
                                    />
                                )}
                            />

                            <Controller
                                name="salesPeriod.endDateTime"
                                control={control}
                                render={({ field }) => (
                                    <CustomDateTimeInput
                                        label="End Date & Time"
                                        value={field.value}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        error={errors.salesPeriod?.endDateTime?.message}
                                        data-testid="input-sales-end"
                                    />
                                )}
                            />
                        </div>
                    </section>

                    {/* ── Refund Policy  */}
                    <section className="space-y-6" data-testid="section-refund-policy">
                        <h3 className="text-brand-secondary-8 font-bold text-sm md:text-base">Refund Policy</h3>
                        <Controller
                            control={control}
                            name="refundPolicy"
                            render={({ field }) => (
                                <RadioGroup
                                    {...field}
                                    onValueChange={field.onChange}
                                    className="w-fit flex flex-wrap gap-6"
                                    data-testid="radio-refund-policy"
                                >
                                    {(["no", "partial", "full", "custom"] as const).map((val) => (
                                        <div key={val} className="flex items-center gap-3">
                                            <RadioGroupItem
                                                value={val}
                                                id={`refundPolicy-${val}`}
                                                className="size-5 border-2 cursor-pointer"
                                                circleIconClass="size-3 text-brand-primary-6"
                                                data-testid={`radio-refund-${val}`}
                                            />
                                            <Label htmlFor={`refundPolicy-${val}`} className="cursor-pointer font-medium text-brand-secondary-9 capitalize">
                                                {val === "no" ? "No Refund" : val.charAt(0).toUpperCase() + val.slice(1)}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                        />

                        {refundPolicy === "custom" && (
                            <Controller
                                name="customRefundPercentage"
                                control={control}
                                render={({ field }) => (
                                    <CustomPercentageInput
                                        label="Enter Refund Percentage"
                                        onChange={(val) => field.onChange(val ? Number(val) : val)}
                                        inputContainerStyles="max-w-29.25"
                                        value={field.value as number}
                                        error={errors.customRefundPercentage?.message as string}
                                        data-testid="input-custom-refund-percentage"
                                    />
                                )}
                            />
                        )}
                    </section>

                    <div className='hidden md:block'>
                        <MultiStepFormButtonDuo />
                    </div>
                </div>

                <aside className="w-full lg:w-[320px] lg:sticky top-6" data-testid="pricing-summary-sidebar">
                    <CreateEventPricingSummary />
                </aside>

                <div className='md:hidden w-full'>
                    <MultiStepFormButtonDuo />
                </div>
            </form>
        </FormProvider>
    )
}