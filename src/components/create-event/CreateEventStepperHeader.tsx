'use client'

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useStepper } from '@/contexts/create-event/StepperProvider';
import { STEPS_CONFIG } from '@/lib/features/create-event/resources/constants';
import { useEventCreation } from '@/contexts/create-event/CreateEventProvider';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

export function CreateEventStepperHeader() {
    const { currentStep, completedSteps, canNavigateToStep } = useEventCreation()
    const wrapperRef = useRef<HTMLDivElement>(null)

    const colors = {
        active: "var(--color-brand-accent-4)",
        activeLine: "var(--color-brand-accent-3)",
        completed: "var(--color-brand-primary-5)",
        pending: "var(--color-brand-neutral-6)",
        lineBackground: "var(--color-brand-neutral-7)"
    }

    useEffect(() => {
        if (!wrapperRef.current) return;
        wrapperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, [currentStep, wrapperRef?.current])

    return (
        <div className="w-full">
            <div className="max-w-3xl mx-auto md:mx-0" ref={wrapperRef}>
                <div className="flex items-center justify-between">
                    {STEPS_CONFIG.map((step, index) => {
                        const isCompleted = completedSteps.includes(step.number);
                        const isActive = currentStep === step.number;

                        return (
                            <div key={step.number} className={cn(
                                "flex items-center",
                                index !== STEPS_CONFIG.length - 1 ? "flex-1" : "flex-none"
                            )}>
                                <div className="flex flex-col items-center sm:items-start w-full">
                                    <div className="flex items-center w-full">
                                        {/* Indicator Circle */}
                                        <button
                                            disabled={true}
                                            className="relative focus:outline-none shrink-0"
                                        >
                                            <motion.div
                                                animate={{
                                                    borderColor: isCompleted ? colors.completed : isActive ? colors.active : colors.pending,
                                                }}
                                                transition={{ duration: 1 }}
                                                // Responsive sizing: w-8 on mobile, w-10 on desktop
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center bg-transparent"
                                            >
                                                <motion.div
                                                    animate={{
                                                        backgroundColor: isCompleted ? colors.completed : isActive ? colors.active : colors.pending,
                                                    }}
                                                    transition={{ duration: 1 }}
                                                    // Responsive sizing: w-6 on mobile, w-7 on desktop
                                                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white"
                                                >
                                                    <AnimatePresence mode="wait">
                                                        {isCompleted ? (
                                                            <motion.div key="check" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                                                                <Icon icon="lucide:check" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                            </motion.div>
                                                        ) : isActive ? (
                                                            <motion.div key="dots" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}>
                                                                <Icon icon="lucide:ellipsis" className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div key="lock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                                                                <Icon icon="lucide:lock" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            </motion.div>
                                        </button>

                                        {/* Connector Line */}
                                        {index < STEPS_CONFIG.length - 1 && (
                                            <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-brand-neutral-6 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: "0%" }}
                                                    animate={{
                                                        width: (isActive || isCompleted) ? "100%" : "0%",
                                                        backgroundColor: isCompleted ? colors.completed : colors.activeLine
                                                    }}
                                                    transition={{
                                                        width: { duration: 1, ease: "circOut" },
                                                        backgroundColor: { duration: 0.5 }
                                                    }}
                                                    className="h-full"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Labels: Hidden on mobile (hidden), shown on desktop (sm:flex) */}
                                    <div className="hidden sm:flex flex-col items-start pr-4 mt-4 transition-all">
                                        <span className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#AAAAAA]">
                                            STEP {step.number}
                                        </span>
                                        <h3 className="text-sm font-bold whitespace-nowrap mb-0.5 text-brand-secondary-9">
                                            {step.title}
                                        </h3>
                                        <span className="text-[11px] text-brand-secondary-8">
                                            {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}