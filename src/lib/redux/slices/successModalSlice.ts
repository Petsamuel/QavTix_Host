import { SuccessModalVariant } from '@/components/modals/resources/success-modal-variant';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface SuccessModalState {
    isOpen: boolean;
    title: string;
    description: string;
    variant: SuccessModalVariant;
    autoClose?: boolean;
    autoCloseDelay?: number;
}

const initialState: SuccessModalState = {
    isOpen: false,
    title: '',
    description: '',
    variant: 'success',
    autoClose: false,
    autoCloseDelay: 3000
}

export const successModalSlice = createSlice({
    name: 'successModal',
    initialState,
    reducers: {
        openSuccessModal: (state, action: PayloadAction<{
            title: string;
            description: string;
            variant?: SuccessModalVariant;
            autoClose?: boolean;
            autoCloseDelay?: number;
        }>) => {
            state.isOpen = true;
            state.title = action.payload.title;
            state.description = action.payload.description;
            state.variant = action.payload.variant || 'success';
            state.autoClose = action.payload.autoClose || false;
            state.autoCloseDelay = action.payload.autoCloseDelay || 3000;
        },
        closeSuccessModal: (state) => {
            state.isOpen = false;
        }
    }
})

export const { openSuccessModal, closeSuccessModal } = successModalSlice.actions;
export default successModalSlice.reducer;