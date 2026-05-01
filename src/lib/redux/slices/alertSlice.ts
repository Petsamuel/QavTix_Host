import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AlertVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info'

interface AlertState {
    isOpen: boolean
    title: string
    description?: string | React.ReactNode
    variant: AlertVariant
    duration?: number
    icon?: React.ReactNode
}

const initialState: AlertState = {
    isOpen: false,
    title: '',
    description: '',
    variant: 'default',
    duration: 5000,
    icon: null,
}

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showAlert: (
            state,
            action: PayloadAction<{
                title: string
                description?: string | React.ReactNode
                variant?: AlertVariant
                duration?: number
                icon?: React.ReactNode
            }>
        ) => {
            state.isOpen = true
            state.title = action.payload.title
            state.description = action.payload.description
            state.variant = action.payload.variant || 'default'
            state.duration = action.payload.duration || 5000
            state.icon = action.payload.icon || null
        },
        hideAlert: (state) => {
            state.isOpen = false
        },
    },
})

export const { showAlert, hideAlert } = alertSlice.actions
export default alertSlice.reducer