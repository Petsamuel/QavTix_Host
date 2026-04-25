"use client";

import { ApiCategory } from '@/actions/filters';
import { CompleteEventFormData } from '@/schemas/create-event.schema';
import { StepNumber } from '@/types/create-event';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface EventCreationContextType {
    eventData:         Partial<CompleteEventFormData>
    currentStep:       StepNumber
    completedSteps:    StepNumber[]
    isEditMode:        boolean 
    eventID?:          string  
    updateStep:        <K extends keyof CompleteEventFormData>(step: K, data: CompleteEventFormData[K]) => void
    setCurrentStep:    (step: StepNumber) => void
    categories:        ApiCategory[]
    setEventData:      React.Dispatch<React.SetStateAction<Partial<CompleteEventFormData>>>
    markStepComplete:  (step: StepNumber) => void
    resetForm:         () => void
    canNavigateToStep: (step: StepNumber) => boolean
}

interface ProviderProps {
    children:      ReactNode
    categories:    ApiCategory[]
    initialData?:  Partial<CompleteEventFormData>
    eventID?:      string
    isDuplicate?:  boolean
}


const EventCreationContext = createContext<EventCreationContextType | undefined>(undefined)

export function EventCreationProvider({
    children,
    categories,
    initialData,
    isDuplicate,
    eventID,
}: ProviderProps) {

    // Seed with initialData if editing, otherwise start empty
    const [eventData, setEventData] = useState<Partial<CompleteEventFormData>>(
        initialData ?? {}
    )

    // If editing, mark all steps that have data as complete so navigation is unlocked
    const [completedSteps, setCompletedSteps] = useState<StepNumber[]>(() => {
        if (isDuplicate) return [1, 2, 3, 4]
        if (!initialData) return []
        const completed: StepNumber[] = []
        if (initialData.basicInformation) completed.push(1)
        if (initialData.detailsMedia)     completed.push(2)
        if (initialData.ticketsPricing)   completed.push(3)
        if (initialData.settings)         completed.push(4)
        return completed
    })

    const [currentStep, setCurrentStep] = useState<StepNumber>(
        isDuplicate ? 5 : 1
    )

    const isEditMode = !!eventID

    const updateStep = useCallback(<K extends keyof CompleteEventFormData>(
        step: K,
        data: CompleteEventFormData[K]
    ) => {
        setEventData(prev => ({
            ...prev,
            [step]: data
        }))
    }, [])

    const markStepComplete = useCallback((step: StepNumber) => {
        setCompletedSteps(prev => {
            if (!prev.includes(step)) {
                return [...prev, step].sort()
            }
            return prev;
        })
    }, [])

    const canNavigateToStep = useCallback((targetStep: StepNumber) => {
        // Can always go to step 1
        if (targetStep === 1) return true;
        
        // Can go to next step if current is complete
        // Can go back to any previous step
        return targetStep <= currentStep || completedSteps.includes((targetStep - 1) as StepNumber)
    }, [currentStep, completedSteps])

    const resetForm = useCallback(() => {
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
                eventID,
                updateStep,
                setCurrentStep,
                setEventData,
                markStepComplete,
                categories,
                resetForm,
                canNavigateToStep,
            }}
        >
            {children}
        </EventCreationContext.Provider>
    )
}

export function useEventCreation() {
    const context = useContext(EventCreationContext)
    if (!context) {
        throw new Error('useEventCreation must be used within EventCreationProvider')
    }
    return context;
}
