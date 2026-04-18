import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "attendee" | "organizer" | "admin"

export interface AuthUserState {
    isAuthenticated: boolean
    user:            AuthUser | null
}

const initialState: AuthUserState = {
    isAuthenticated: false,
    user:            null,
}

const authUserSlice = createSlice({
    name: "authUser",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser>) {
            state.isAuthenticated = true
            state.user            = action.payload
        },

        clearUser() {
            return initialState
        },
    },
})

export const { setUser, clearUser } = authUserSlice.actions

export default authUserSlice.reducer