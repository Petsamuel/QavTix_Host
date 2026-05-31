import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PasswordModalStateActionType = "delete_account" | "change_email" | "update_security" | "cancel_plan" | "withdrawal";

export interface OpenPasswordModalPayload {
    actionType: PasswordModalStateActionType;
    skipVerification?: boolean;
    actionData?: any;
}

interface PasswordModalState {
    isOpen: boolean;
    actionType: PasswordModalStateActionType | null;
    status: 'idle' | 'submitting' | 'success' | 'error';
    isVerified: boolean;
    lastVerifiedAction: PasswordModalStateActionType | null;
    skipVerification?: boolean;
    actionData?: any;
}

const initialState: PasswordModalState = {
    isOpen: false,
    actionType: null,
    status: 'idle',
    isVerified: false,
    lastVerifiedAction: null,
    skipVerification: false,
    actionData: null,
}

const passwordModalSlice = createSlice({
    name: 'passwordModal',
    initialState,
    reducers: {
        openPasswordModal: (state, action: PayloadAction<PasswordModalStateActionType | OpenPasswordModalPayload>) => {
            state.isOpen = true;
            state.isVerified = false;
            state.lastVerifiedAction = null;
            state.status = 'idle';
            if (typeof action.payload === 'string') {
                state.actionType = action.payload;
                state.skipVerification = false;
                state.actionData = null;
            } else {
                state.actionType = action.payload.actionType;
                state.skipVerification = !!action.payload.skipVerification;
                state.actionData = action.payload.actionData || null;
            }
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
            state.skipVerification = false;
            state.actionData = null;
            // isVerified stays true temporarily so the calling component can react
        },
        resetPasswordStatus: (state) => {
            state.isVerified = false;
            state.lastVerifiedAction = null;
            state.status = 'idle';
            state.actionType = null;
            state.skipVerification = false;
            state.actionData = null;
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