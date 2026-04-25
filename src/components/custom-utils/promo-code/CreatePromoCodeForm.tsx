import { createPromoCodeSchema, CreatePromoCodeSchemaType } from "@/schemas/create-promo-code.schema";
import { AnimatedDialog } from "../dialogs/AnimatedDialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import CustomInput1 from "../inputs/CustomInput1";
import { DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createPromoCode } from "@/actions/marketing";
import { formatDate } from "@/helper-fns/date-utils";
import { showAlert } from "@/lib/redux/slices/alertSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import SearchableEventSelect from "../inputs/CustomEventSearchableSelect";
import ActionButton1 from "../buttons/ActionBtn1";
import { useRevalidate } from "@/custom-hooks/UseRevalidate";

export default function CreatePromoCodeForm({
    openPromoModal,
    setOpenPromoModal,
}: {
    openPromoModal: boolean,
    setOpenPromoModal: Dispatch<SetStateAction<boolean>>,
}) {

    const {
        control,
        register,
        reset,
        formState: { errors, isSubmitting },
        handleSubmit,
    } = useForm<CreatePromoCodeSchemaType>({
        resolver: zodResolver(createPromoCodeSchema),
        defaultValues: {
            usage_limit: 1,
            discount: 10
        }
    })

    const dispatch = useAppDispatch()

    const { trigger } = useRevalidate("marketing")

    const onSubmit: SubmitHandler<CreatePromoCodeSchemaType> = async (data) => {
        const result = await createPromoCode({
            code: data.promo_code,
            discount_percentage: data.discount.toString(),
            event_id: data.event_id,
            usage_limit: data.usage_limit,
            valid_until: formatDate(data.valid_until, "yyyy-MM-dd")
        })

        if (result.success) {
            reset()
            dispatch(showAlert({
                title: "Promo code created",
                description: "Your promo code is now active and ready to use.",
                variant: "success"
            }))
            trigger()
            setOpenPromoModal(false)
        } else {
            dispatch(showAlert({
                variant: "destructive",
                title: "Failed to create promo code",
                description: result.message ?? "Please try again.",
            }))
        }
    }

    return (
        <AnimatedDialog className="md:max-w-[25em]" open={openPromoModal} onOpenChange={setOpenPromoModal}>
            <div>
                <div className="flex justify-center items-center flex-col text-center">
                    <DialogTitle className="font-semibold text-brand-secondary-9">Create Promo Code</DialogTitle>
                    <p className="text-sm text-brand-secondary-6 mt-2">Fill out the form to create a new Promo Code</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
                    <div className="flex flex-wrap justify-between gap-4">
                        <div className="w-[55%]">
                            {/* Promo Code */}
                            <CustomInput1
                                label="Promo Code"
                                required
                                showAshk={false}
                                error={errors.promo_code?.message}
                                {...register('promo_code')}
                                className="h-11.25! border-0! rounded-sm!"
                                placeholder="Enter promo code"
                            />
                        </div>

                        {/* Discount */}
                        <div className="relative h-fit w-24">
                            <CustomInput1
                                label="Discount"
                                required
                                showAshk={false}
                                type="number"
                                inputMode="numeric"
                                className="pr-12 h-11.25! border-0! rounded-e-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                error={errors.discount?.message}
                                {...register('discount', { valueAsNumber: true })}
                                placeholder="10"
                            />
                            <div className="absolute -right-px bottom-0 my-auto top-[2em] h-11.25 w-10 text-brand-neutral-6 rounded-e-md flex items-center justify-center bg-brand-neutral-7 font-medium text-sm">
                                %
                            </div>
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <CustomInput1
                        label="Usage Limit"
                        required
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        showAshk={false}
                        error={errors.usage_limit?.message}
                        {...register('usage_limit', { valueAsNumber: true })}
                        className="h-11.25! border-0! rounded-sm!"
                        placeholder="Eg: First 50 People"
                    />

                    {/* Valid Until */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-brand-secondary-9">
                            Valid until
                        </label>
                        <Controller
                            name="valid_until"
                            control={control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full h-11.25 justify-between text-left font-normal bg-brand-neutral-3 border-brand-neutral-3 hover:bg-brand-neutral-3",
                                                !field.value && "text-brand-neutral-6"
                                            )}
                                        >
                                            {field.value ? format(field.value, "dd/MM/yyyy") : "DD/MM/YY"}
                                            <CalendarIcon className="h-4 w-4 text-brand-neutral-6" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0 z-999"
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                        avoidCollisions={true}
                                        collisionPadding={16}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.valid_until && (
                            <p className="text-xs text-red-500">{errors.valid_until.message}</p>
                        )}
                    </div>

                    <Controller
                        name="event_id"
                        control={control}
                        render={({ field }) => (
                            <SearchableEventSelect
                                value={field.value}
                                onValueChange={field.onChange}
                                error={errors.event_id?.message}
                            />
                        )}
                    />
                    {/* Action Buttons */}
                    <div className="flex justify-between gap-4 pt-3">
                        <button
                            type="button"
                            onClick={() => setOpenPromoModal(false)}
                            className="flex-1 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3.5 rounded-[30px] border-2 border-brand-secondary-3 font-medium text-sm hover:bg-brand-neutral-2 hover:border-brand-secondary-5 active:bg-brand-neutral-3 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-neutral-4 focus:ring-offset-2 transition-all duration-150"
                        >
                            Cancel
                        </button>

                        <ActionButton1
                            buttonText="Confirm"
                            buttonType="submit"
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                            className="flex-1"
                        />
                    </div>
                </form>
            </div>
        </AnimatedDialog>
    )
}