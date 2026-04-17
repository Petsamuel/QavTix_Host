// Step Navigation
export type StepNumber = 1 | 2 | 3 | 4 | 5;

// Form Step Props
export interface StepComponentProps {
    onNext: () => void;
    onBack: () => void;
    isFirstStep: boolean;
    isLastStep: boolean;
}

// API Response Types
export interface EventCreationResponse {
    success: boolean;
    eventId: string;
    message: string;
    event: CompleteEventFormData;
}

export interface EventValidationError {
    field: string;
    message: string;
    step: StepNumber;
}