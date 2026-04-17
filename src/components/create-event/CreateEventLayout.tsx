import { useEventCreation } from "@/contexts/create-event/CreateEventProvider";
import { CreateEventStepContent } from "./CreateEventStepContent";
import { CreateEventStepperHeader } from "./CreateEventStepperHeader";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import SaveAsDraftBtn from "@/lib/features/save-as-draft/SaveAsDraftBtn";

export default function EventCreationLayout() {
    const { currentStep } = useEventCreation()

    return (
        <>
            <div id="step-top" />
            <main>
                <div className="flex justify-between items-center my-6">
                    <h2 className={cn(space_grotesk.className, 'capitalize text-lg text-brand-secondary-8 font-bold')}>Create Event</h2>
                    <SaveAsDraftBtn />
                </div>
                <CreateEventStepperHeader />
                <div className="py-12">
                    <CreateEventStepContent step={currentStep} />
                </div>
            </main>
        </>
    )
}