'use client'

import { useForm, useFieldArray, FormProvider, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Step4FormData, step4Schema } from '@/schemas/create-event.schema'
import { Switch } from "@/components/ui/switch"
import CustomPercentageInput from '../custom-utils/inputs/CustomPercentageInput'
import CustomDatePicker from '../custom-utils/inputs/CustomDatePicker'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { Icon } from '@iconify/react'
import CustomAvatar from '../custom-utils/avatars/CustomAvatar'
import MultiStepFormButtonDuo from '../custom-utils/buttons/MultiStepFormButtonDuo'
import { useState } from 'react'
import AddCollaboratorForm from './AddCollaboratorForm'
import { COLLABORATOR_ROLES } from '@/lib/features/create-event/resources/constants'
import CollaboratorRoleEditSelect from './CollaboratorRoleEditSelect'
import CollaboratorActionMenu from './CollaboratorActionMenu'
import CustomInput2 from '../custom-utils/inputs/CustomInput2'
import { useEventCreation } from '@/contexts/create-event/CreateEventProvider'
import { useStepper } from '@/contexts/create-event/StepperProvider'
import { PlanGateBanner } from './PlanGateBanner'
import { usePlanRestrictions } from '@/custom-hooks/useRestriction'



export default function CreateEventStep4() {

    const { updateStep, eventData } = useEventCreation()
    const { goToNextStep } = useStepper()
    const plan = usePlanRestrictions()

    const methods = useForm<Step4FormData>({
        resolver: zodResolver(step4Schema),
        defaultValues: {
            checkInSettings: eventData.settings?.checkInSettings ?? {
                qrCodeEnabled:  true,
                ageRestriction: false,
            },
            emailNotifications: eventData.settings?.emailNotifications ?? {
                orderConfirmation:   true,
                ticketDelivery:      true,
                reminders:           true,
                postEventEmails:     true,
                customizeSenderName: false,
            },
            affiliateProgram: eventData.settings?.affiliateProgram ?? {
                enabled:              false,
                percentageCommission: 10,
            },
            permissions: eventData.settings?.permissions ?? {
                collaborators: [
                    {
                        id:          '1',
                        name:        'QavTix Limited',
                        email:       'info@qavtixlimited.com',
                        role:        'host',
                        status:      'active',
                        permissions: ['all'],
                    },
                ],
            },
        },
    })

    const { control, watch, register, handleSubmit, formState: { errors } } = methods
    const { fields: collaborators, append, remove, update } = useFieldArray({
        control,
        name: "permissions.collaborators",
    })

    const isAffiliateEnabled = watch('affiliateProgram.enabled')
    const isAgeRestricted    = watch('checkInSettings.ageRestriction')

    const [openAddCollaboratorForm, setOpenAddCollaboratorForm] = useState(false)

    const handleStep4Submit: SubmitHandler<Step4FormData> = (data) => {
        // If plan doesn't support affiliate/QR, ensure those are off before saving
        const sanitized: Step4FormData = {
            ...data,
            affiliateProgram: {
                ...data.affiliateProgram,
                enabled: plan.canUseAffiliate ? data.affiliateProgram.enabled : false,
            },
            checkInSettings: {
                ...data.checkInSettings,
                qrCodeEnabled: plan.canUseQrCheckin ? data.checkInSettings.qrCodeEnabled : false,
            },
        }
        updateStep("settings", sanitized)
        goToNextStep()
    }

    const EMAIL_NOTIFICATION_FIELDS = [
        { key: 'orderConfirmation',   label: 'Order Confirmation' },
        { key: 'ticketDelivery',      label: 'Ticket Delivery' },
        { key: 'reminders',           label: 'Reminders' },
        { key: 'postEventEmails',     label: 'Post-Event Emails' },
        { key: 'customizeSenderName', label: 'Customize Sender Name' },
    ] as const

    return (
        <FormProvider {...methods}>
            <form
                className="grid grid-cols-1 mt-6 md:grid-cols-2 gap-14 lg:gap-20 items-start md:pb-16"
                onSubmit={handleSubmit(handleStep4Submit)}
                data-testid="create-event-step-4-form"
            >

                {/* ── SETTINGS ─────────────────────────────────────── */}
                <div className="space-y-10 md:pr-10 lg:pr-14 md:border-r-[1.5px] md:border-dashed md:border-brand-secondary-3/50">

                    {/* Check-In Settings */}
                    <section className="space-y-6" data-testid="section-checkin-settings">
                        <h3 className="text-brand-secondary-8 font-bold">Check-In Settings</h3>
                        <div className="space-y-4">

                            {/* QR Code — gated */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <label className={cn(
                                            "text-sm",
                                            !plan.canUseQrCheckin ? "text-brand-secondary-5" : "text-brand-secondary-9"
                                        )}>
                                            QR code enabled
                                        </label>
                                        {!plan.canUseQrCheckin && (
                                            <Icon icon="lucide:lock" className="size-3.5 text-amber-500" />
                                        )}
                                    </div>
                                    <Controller
                                        name="checkInSettings.qrCodeEnabled"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                checked={plan.canUseQrCheckin ? field.value : false}
                                                onCheckedChange={plan.canUseQrCheckin ? field.onChange : undefined}
                                                disabled={!plan.canUseQrCheckin}
                                                data-testid="switch-qr-code"
                                            />
                                        )}
                                    />
                                </div>
                                {!plan.canUseQrCheckin && (
                                    <PlanGateBanner
                                        message={plan.upgradePromptFor("qr_checkin") ?? "QR Check-In requires a plan upgrade."}
                                        variant="inline"
                                        data-testid="qr-plan-gate"
                                    />
                                )}
                            </div>

                            {/* Age Restriction */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-brand-secondary-9">Age Restriction</label>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                type="button"
                                                aria-label="Age restriction info"
                                                className="text-brand-neutral-6 hover:text-neutral-8 transition-colors"
                                            >
                                                <Icon icon="carbon:information" className="size-4 text-accent-6" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Apply an age restriction to block users who do not meet the required age.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <Controller
                                    name="checkInSettings.ageRestriction"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            data-testid="switch-age-restriction"
                                        />
                                    )}
                                />
                            </div>

                            {isAgeRestricted && (
                                <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <CustomInput2
                                        label="Enter Minimum Age Required"
                                        type="number"
                                        placeholder="18"
                                        className="max-w-max"
                                        error={errors.checkInSettings?.minimumAge?.message}
                                        {...register("checkInSettings.minimumAge")}
                                        data-testid="input-minimum-age"
                                    />
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Email Notifications */}
                    <section className="space-y-6" data-testid="section-email-notifications">
                        <div className="space-y-1">
                            <h3 className="text-brand-secondary-8 font-bold">Email Notifications</h3>
                            <p className="text-sm text-brand-secondary-9">
                                Choose the type of emails that will apply to this event
                            </p>
                        </div>
                        <div className="space-y-4">
                            {EMAIL_NOTIFICATION_FIELDS.map(({ key, label }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <label className="text-sm text-brand-secondary-9">{label}</label>
                                    <Controller
                                        name={`emailNotifications.${key}` as any}
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                data-testid={`switch-email-${key}`}
                                            />
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Affiliate Program — gated */}
                    <section className="space-y-6" data-testid="section-affiliate-program">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-brand-secondary-8 font-bold">Affiliate Program</h3>
                                {!plan.canUseAffiliate && (
                                    <Icon icon="lucide:lock" className="size-4 text-amber-500" />
                                )}
                            </div>
                            <p className="text-sm text-brand-secondary-9">
                                When this is turned on, users can generate links, help sell tickets and get commission
                            </p>
                        </div>

                        {/* Gate banner */}
                        {!plan.canUseAffiliate ? (
                            <PlanGateBanner
                                message={plan.upgradePromptFor("affiliate") ?? "Affiliate Program requires a plan upgrade."}
                                variant="block"
                                data-testid="affiliate-plan-gate"
                            />
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <label className="text-sm text-brand-secondary-9">Turn On Affiliate</label>
                                    <Controller
                                        name="affiliateProgram.enabled"
                                        control={control}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                data-testid="switch-affiliate-enabled"
                                            />
                                        )}
                                    />
                                </div>

                                {isAffiliateEnabled && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <CustomPercentageInput
                                            label="Percentage Commission"
                                            value={watch('affiliateProgram.percentageCommission') as number}
                                            onChange={(val) => methods.setValue('affiliateProgram.percentageCommission', parseInt(val))}
                                            error={errors.affiliateProgram?.percentageCommission?.message}
                                            inputContainerStyles="max-w-30"
                                            data-testid="input-affiliate-commission"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Controller
                                                name="affiliateProgram.startDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomDatePicker
                                                        label="Affiliate Program Starts"
                                                        icon={ChevronDown}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        data-testid="input-affiliate-start"
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name="affiliateProgram.endDate"
                                                control={control}
                                                render={({ field }) => (
                                                    <CustomDatePicker
                                                        label="Affiliate Program Ends"
                                                        icon={ChevronDown}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        data-testid="input-affiliate-end"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>

                {/* ── PERMISSIONS / COLLABORATORS — Coming Soon ─────── */}
                <div className="space-y-8 relative" data-testid="section-permissions">
                    <div
                        className="absolute inset-0 z-10 h-full overflow-hidden pointer-events-auto"
                        aria-label="Permissions feature coming soon"
                        data-testid="collaborators-coming-soon-overlay"
                    >
                        <div className="absolute inset-0 backdrop-blur-sm bg-white/60 rounded-sm" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none">
                            <div className="flex items-center gap-2 bg-white border border-brand-neutral-3 shadow-sm rounded-full px-4 py-2">
                                <Icon icon="lucide:lock" className="size-4 text-brand-primary-6" />
                                <span className="text-sm font-semibold text-brand-secondary-9">Coming Soon</span>
                            </div>
                            <p className="text-xs text-brand-secondary-5 text-center max-w-[18rem] px-4">
                                Team permissions & collaborators will be available in an upcoming release.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1 pointer-events-none" aria-hidden>
                        <h3 className="text-brand-secondary-8 font-bold">Permission</h3>
                        <p className="text-sm text-brand-secondary-9">
                            Control who can access and manage only the sections of the event assigned to them
                        </p>
                    </div>

                    <div className="space-y-6 pointer-events-none" aria-hidden>
                        <h4 className="text-sm font-medium text-brand-secondary-9">Who has access</h4>
                        <div className="space-y-6">
                            {collaborators.map((collab, index) => (
                                <div key={collab.id} className="border-b border-b-brand-neutral-5 last-of-type:border-b-0 pb-3 md:pb-0 md:border-b-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] capitalize font-medium text-brand-secondary-9">
                                            {collab.role === "host" ? "Host" : "Collaborator"}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-medium flex items-center gap-1.5",
                                            collab.status === 'active'   ? "text-[#359160]" :
                                            collab.status === 'disabled' ? "text-red-500" : "text-brand-secondary-4"
                                        )}>
                                            <span className="size-1.5 rounded-full bg-current" />
                                            {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-5">
                                        <div className="flex gap-3">
                                            <CustomAvatar name="QavTix Limited" id="9" profileImg="" size="size-11" />
                                            <div className="text-brand-secondary-9">
                                                <p className="text-xs md:text-sm">{collab.name}</p>
                                                <p className="font-bold text-xs md:text-sm truncate max-w-30">{collab.email}</p>
                                            </div>
                                        </div>
                                        {collab.role !== "host" && (
                                            <div className="flex flex-wrap justify-end items-center gap-x-2">
                                                <Controller
                                                    name={`permissions.collaborators.${index}.role`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <CollaboratorRoleEditSelect
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            options={COLLABORATOR_ROLES.map(v => v)}
                                                        />
                                                    )}
                                                />
                                                <CollaboratorActionMenu
                                                    status={collab.status}
                                                    onRemove={() => remove(index)}
                                                    onReactivate={() => update(index, { ...collab, status: 'active' })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" tabIndex={-1} className="w-full mt-5 text-sm h-14 rounded-[6px] border-[1.4px] border-dashed border-brand-secondary-5 bg-transparent text-brand-secondary-5">
                            + Add Collaborator
                        </button>
                    </div>
                </div>

                <div className="md:pe-4">
                    <MultiStepFormButtonDuo />
                </div>
            </form>

            <AddCollaboratorForm
                open={openAddCollaboratorForm}
                setOpen={setOpenAddCollaboratorForm}
                setCollaborator={(v) => {
                    append({
                        email:       v.email,
                        role:        v.role as any,
                        permissions: [v.role],
                        name:        v.email.split('@')[0],
                        status:      "pending",
                        id:          crypto.randomUUID(),
                    })
                }}
            />
        </FormProvider>
    )
}