"use client";

import { ApiCategory } from '@/actions/filters/index';
import { clearEventDraft, readEventDraft } from '@/custom-hooks/UseEventDraftPersist';
import { CompleteEventFormData } from '@/schemas/create-event.schema';
import { StepNumber } from '@/types/create-event';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface EventCreationContextType {
    eventData: Partial<CompleteEventFormData>
    currentStep: StepNumber
    completedSteps: StepNumber[]
    isEditMode: boolean
    isDuplicate: boolean
    eventID?: string
    eventStatus?: 'draft' | 'active' | 'cancelled' | 'completed'
    updateStep: <K extends keyof CompleteEventFormData>(step: K, data: CompleteEventFormData[K]) => void
    setCurrentStep: (step: StepNumber) => void
    categories: ApiCategory[]
    setEventData: React.Dispatch<React.SetStateAction<Partial<CompleteEventFormData>>>
    markStepComplete: (step: StepNumber) => void
    resetForm: () => void
    canNavigateToStep: (step: StepNumber) => boolean
    hasDraftAvailable: boolean
    restoreDraft: () => void
    discardDraft: () => void
}

interface ProviderProps {
    children: ReactNode
    categories: ApiCategory[]
    initialData?: Partial<CompleteEventFormData>
    eventID?: string
    eventStatus?: 'draft' | 'active' | 'cancelled' | 'completed'
    isDuplicate?: boolean
}

const EventCreationContext = createContext<EventCreationContextType | undefined>(undefined)

function getCompletedStepsFromData(data: Partial<CompleteEventFormData>): StepNumber[] {
    const completed: StepNumber[] = []
    if (data.basicInformation) completed.push(1)
    if (data.detailsMedia) completed.push(2)
    if (data.ticketsPricing) completed.push(3)
    if (data.settings) completed.push(4)
    return completed
}

export function EventCreationProvider({
    children,
    categories,
    initialData,
    isDuplicate,
    eventID,
    eventStatus,
}: ProviderProps) {

    const isEditMode = !!eventID && !isDuplicate

    const [eventData, setEventData] = useState<Partial<CompleteEventFormData>>(initialData ?? {})
    const [completedSteps, setCompletedSteps] = useState<StepNumber[]>(() => {
        if (isDuplicate) return [1, 2, 3, 4]
        if (!initialData) return []
        return getCompletedStepsFromData(initialData)
    })
    const [currentStep, setCurrentStep] = useState<StepNumber>(isDuplicate ? 5 : 1)
    const [hasDraftAvailable, setHasDraftAvailable] = useState(() => {
        if (isEditMode || isDuplicate) return false
        return !!readEventDraft()
    })

    const updateStep = useCallback(<K extends keyof CompleteEventFormData>(
        step: K,
        data: CompleteEventFormData[K]
    ) => {
        setEventData(prev => ({ ...prev, [step]: data }))
    }, [])

    const markStepComplete = useCallback((step: StepNumber) => {
        setCompletedSteps(prev =>
            prev.includes(step) ? prev : [...prev, step].sort() as StepNumber[]
        )
    }, [])

    const canNavigateToStep = useCallback((targetStep: StepNumber) => {
        if (targetStep === 1) return true
        return targetStep <= currentStep || completedSteps.includes((targetStep - 1) as StepNumber)
    }, [currentStep, completedSteps])

    const restoreDraft = useCallback(() => {
        const draft = readEventDraft()
        if (!draft) return

        const completed = getCompletedStepsFromData(draft)

        setEventData(draft)
        setCompletedSteps(completed)

        // Always start from Step 1 upon restoration
        setCurrentStep(1)

        setHasDraftAvailable(false)
    }, [])

    const discardDraft = useCallback(() => {
        clearEventDraft()
        setHasDraftAvailable(false)
    }, [])

    const resetForm = useCallback(() => {
        clearEventDraft()
        setEventData({})
        setCurrentStep(1)
        setCompletedSteps([])
    }, [])

    return (
        <EventCreationContext.Provider
            value={{
                eventData,
                currentStep,
                completedSteps,
                isEditMode,
                isDuplicate: !!isDuplicate,
                eventID,
                eventStatus,
                updateStep,
                setCurrentStep,
                setEventData,
                markStepComplete,
                categories,
                resetForm,
                canNavigateToStep,
                hasDraftAvailable,
                restoreDraft,
                discardDraft,
            }}
        >
            {children}
        </EventCreationContext.Provider>
    )
}

export function useEventCreation() {
    const context = useContext(EventCreationContext)
    if (!context) throw new Error('useEventCreation must be used within EventCreationProvider')
    return context
}