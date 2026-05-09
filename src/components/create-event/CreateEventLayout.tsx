import { useEventCreation } from "@/contexts/create-event/CreateEventProvider";
import { CreateEventStepContent } from "./CreateEventStepContent";
import { CreateEventStepperHeader } from "./CreateEventStepperHeader";
import { space_grotesk } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import SaveAsDraftBtn from "@/lib/features/save-as-draft/SaveAsDraftBtn";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useIsMounted } from "@/custom-hooks/UseIsMounted";

export default function EventCreationLayout() {
    const {
        currentStep,
        isEditMode,
        eventStatus,
        hasDraftAvailable,
        restoreDraft,
        discardDraft
    } = useEventCreation()
    const router = useRouter()

    const isMounted = useIsMounted()

    const showCancelBtn = isEditMode && (eventStatus === 'draft' || eventStatus === 'active')

    return (
        <>
            <div id="step-top" />
            <main>
                <div className="flex justify-between items-center my-6">
                    <div className="flex items-center gap-7">
                        <h2 className={cn(space_grotesk.className, 'capitalize text-lg text-brand-secondary-8 font-bold')}>
                            {isEditMode ? 'Edit Event' : 'Create Event'}
                        </h2>
                        {showCancelBtn && (
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="underline text-lg text-red-700 hover:text-red-600 h-auto p-0 font-medium"
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                    <SaveAsDraftBtn />
                </div>

                <AnimatePresence>
                    {isMounted && hasDraftAvailable && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginBottom: 24 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-brand-primary-1 border border-brand-primary-2 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-primary-2 flex items-center justify-center text-brand-primary-6 shrink-0">
                                        <Icon icon="hugeicons:file-edit" width="24" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h4 className="text-sm font-bold text-brand-secondary-9">Continue where you left off?</h4>
                                        <p className="text-xs text-brand-secondary-7 mt-0.5">We found a saved draft for an unfinished event. You can restore it or start fresh.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={discardDraft}
                                        className="flex-1 sm:flex-none text-xs font-bold text-brand-secondary-7 hover:text-red-600 hover:bg-red-50"
                                    >
                                        Discard Draft
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={restoreDraft}
                                        className="flex-1 sm:flex-none bg-brand-primary-6 hover:bg-brand-primary-7 text-white text-xs font-bold px-6 rounded-full h-10 transition-all active:scale-95"
                                    >
                                        Restore Draft
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <CreateEventStepperHeader />
                <div className="py-12">
                    {!isMounted ? (
                        <div className="flex justify-center items-center py-20">
                            <Icon icon="lucide:loader-2" className="w-8 h-8 animate-spin text-brand-primary-6" />
                        </div>
                    ) : hasDraftAvailable ? (
                        <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-brand-accent-6 rounded-2xl bg-brand-accent-1/30">
                            <Icon icon="hugeicons:file-edit" className="w-12 h-12 text-brand-accent-6 mb-4 opacity-50" />
                            <h3 className={cn(space_grotesk.className, "text-lg font-semibold text-brand-secondary-9 mb-2 text-center")}>Unfinished Event Draft Found</h3>
                            <p className="text-sm text-brand-secondary-7 text-center max-w-md">
                                Please choose to restore your saved draft or discard it to start a new event.
                            </p>
                        </div>
                    ) : (
                        <CreateEventStepContent step={currentStep} />
                    )}
                </div>
            </main>
        </>
    )
}