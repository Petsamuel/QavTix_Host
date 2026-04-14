import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PasswordModalStateActionType = "delete_account" | "change_email" | "update_security" | "cancel_plan";

interface PasswordModalState {
    isOpen: boolean;
    actionType: PasswordModalStateActionType | null;
    status: 'idle' | 'submitting' | 'success' | 'error';
    isVerified: boolean;
    lastVerifiedAction: PasswordModalStateActionType | null;
}

const initialState: PasswordModalState = {
    isOpen: false,
    actionType: null,
    status: 'idle',
    isVerified: false,
    lastVerifiedAction: null,
}

const passwordModalSlice = createSlice({
    name: 'passwordModal',
    initialState,
    reducers: {
        openPasswordModal: (state, action: PayloadAction<PasswordModalStateActionType>) => {
            state.isOpen = true;
            state.isVerified = false;
            state.lastVerifiedAction = null;
            state.actionType = action.payload;
            state.status = 'idle';
        },
        verifyPasswordSuccess: (state) => {
            state.isVerified = true;
            state.status = 'success';
            state.isOpen = false;
            // Capture the action type before closing
            state.lastVerifiedAction = state.actionType;
        },
        closePasswordModal: (state) => {
            state.isOpen = false;
            state.status = 'idle';
            state.actionType = null;
            // isVerified stays true temporarily so the calling component can react
        },
        resetPasswordStatus: (state) => {
            state.isVerified = false;
            state.lastVerifiedAction = null;
            state.status = 'idle';
            state.actionType = null;
        },
        setPasswordStatus: (state, action: PayloadAction<PasswordModalState['status']>) => {
            state.status = action.payload;
        },
    },
})

export const { 
    openPasswordModal, 
    verifyPasswordSuccess, 
    closePasswordModal, 
    resetPasswordStatus, 
    setPasswordStatus 
} = passwordModalSlice.actions;

export default passwordModalSlice.reducer;