import { StepNumber } from "@/types/create-event";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useEventCreation } from "./CreateEventProvider";

interface StepperContextType {
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    goToStep: (step: StepNumber) => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

const StepperContext = createContext<StepperContextType | undefined>(undefined)

export function StepperProvider({ children }: { children: React.ReactNode }) {
    const { currentStep, setCurrentStep, canNavigateToStep, markStepComplete } = useEventCreation()

    const goToNextStep = useCallback(() => {
        if (currentStep < 5) {
            markStepComplete(currentStep)
            setCurrentStep((currentStep + 1) as StepNumber)
        }
    }, [currentStep, setCurrentStep, markStepComplete])

    const goToPreviousStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as StepNumber)
        }
    }, [currentStep, setCurrentStep])

    const goToStep = useCallback((step: StepNumber) => {
        if (canNavigateToStep(step)) {
            setCurrentStep(step)
        }
    }, [canNavigateToStep, setCurrentStep])

    
    // SCROLL TO TOP WHENEVER THE USER MOVES BETWEEN STEPS
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [currentStep])

    return (
        <StepperContext.Provider
            value={{
                goToNextStep,
                goToPreviousStep,
                goToStep,
                isFirstStep: currentStep === 1,
                isLastStep: currentStep === 5,
            }}
        >
            {children}
        </StepperContext.Provider>
    )
}

export function useStepper() {
    const context = useContext(StepperContext)
    if (!context) {
        throw new Error('useStepper must be used within StepperProvider')
    }
    return context;
}