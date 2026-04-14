import { configureStore } from '@reduxjs/toolkit'
import alertReducer from "./slices/alertSlice"
import authUserReducer from "./slices/authUserSlice"
import confirmationReducer from './slices/confirmationSlice'
import successModalReducer from './slices/successModalSlice'
import popupAlertReducer from './slices/popupAlertSlice'
import passwordConfirmationModalSlice from './slices/passwordModalConfirmationSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      alert: alertReducer,
      popupAlert: popupAlertReducer,
      authUser: authUserReducer,
      confirmation: confirmationReducer,
      successModal: successModalReducer,
      passwordModal: passwordConfirmationModalSlice
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>

export type AppDispatch = AppStore['dispatch']