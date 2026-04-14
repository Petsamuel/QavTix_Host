import { ConfirmationActionType } from '@/components/modals/resources/confirmationActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// sessionId format: "<actionType>::<parsedTargetId>::<uuid>"
// e.g. "TRANSFER_TICKET::abc-123::8f3d2a1b"
// This lets any subscriber extract parsedTargetId without extra state

export function parseConfirmationSession(sessionId: string | null): {
    actionType: string | null
    parsedTargetId:   string | null
} {
    if (!sessionId) return { actionType: null, parsedTargetId: null }
    const [actionType, parsedTargetId] = sessionId.split('::')
    return {
        actionType: actionType ?? null,
        parsedTargetId:   parsedTargetId   ?? null,
    }
}

interface ConfirmationState {
    isOpen:              boolean;
    title:               string;
    description:         string;
    confirmText?:        string;
    cancelText?:         string;
    actionType?:         ConfirmationActionType;
    isConfirmed:         boolean;
    isPerforming:        boolean;
    lastConfirmedAction: ConfirmationActionType | null;
    sessionId:           string | null;  // "<actionType>::<targetId>::<uuid>"
}

const initialState: ConfirmationState = {
    isOpen:              false,
    title:               '',
    description:         '',
    confirmText:         'Yes, I am',
    cancelText:          'Cancel',
    actionType:          undefined,
    isConfirmed:         false,
    isPerforming:        false,
    lastConfirmedAction: null,
    sessionId:           null,
};

export const confirmationSlice = createSlice({
    name: 'confirmation',
    initialState,
    reducers: {
        openConfirmation: (state, action: PayloadAction<{
            title:        string;
            description:  string;
            confirmText?: string;
            cancelText?:  string;
            actionType:   ConfirmationActionType;
            targetId?:    string;  // e.g. ticketID — encoded into sessionId
        }>) => {
            const { actionType, targetId, title, description, confirmText, cancelText } = action.payload
            const suffix    = crypto.randomUUID().split('-')[0]  // short 8-char suffix
            const target    = targetId ?? 'global'

            state.isOpen              = true;
            state.isConfirmed         = false;
            state.isPerforming        = false;
            state.lastConfirmedAction = null;
            state.title               = title;
            state.description         = description;
            state.confirmText         = confirmText || 'Yes, I am';
            state.cancelText          = cancelText  || 'Cancel';
            state.actionType          = actionType;
            // Encode actionType + targetId into sessionId
            state.sessionId           = `${actionType}::${target}::${suffix}`;
        },

        confirmAction: (state) => {
            state.isConfirmed         = true;
            state.isPerforming        = true;
            state.lastConfirmedAction = state.actionType || null;
            // sessionId intentionally preserved — subscribers need to read targetId from it
        },

        // Called after async action completes — closes modal, keeps sessionId alive
        // until resetConfirmationStatus clears it
        finishConfirmAction: (state) => {
            state.isOpen       = false;
            state.isPerforming = false;
        },

        closeConfirmation: (state) => {
            state.isOpen              = false;
            state.isConfirmed         = false;
            state.isPerforming        = false;
            state.actionType          = undefined;
            state.sessionId           = null;
        },

        // Call this after your async action fully completes — clears everything
        resetConfirmationStatus: (state) => {
            state.isConfirmed         = false;
            state.isPerforming        = false;
            state.lastConfirmedAction = null;
            state.actionType          = undefined;
            state.sessionId           = null;
        },
    }
})

export const {
    openConfirmation,
    confirmAction,
    finishConfirmAction,
    closeConfirmation,
    resetConfirmationStatus,
} = confirmationSlice.actions;

export default confirmationSlice.reducer;