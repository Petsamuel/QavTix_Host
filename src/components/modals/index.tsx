"use client"

import SuccessModal from "./SuccessModal";
import PopUpMessageAlertModal from "./PopUpMessageAlert";
import ConfirmationModal from "./ConfirmationModal";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import { popPopupAlert, triggerPopupAlert } from "@/lib/redux/slices/popupAlertSlice";
import { payoutPopupAlert, POPUP_MESSAGE_ALERT_CONFIG, verificationPendingPopupAlert } from "./resources/popup-message-alert-config";
import CustomGlobalAlert from "../custom-utils/alerts/CustomGlobalAlert";

export default function PopUpsRenderer(){

    const { user } = useAppSelector((state) => state.authUser)
    const { alerts } = useAppSelector((state) => state.popupAlert)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!user) return;

        // Verification alert logic
        if (!user.verified) {
            dispatch(triggerPopupAlert(verificationPendingPopupAlert));
        } else {
            dispatch(popPopupAlert(verificationPendingPopupAlert));
        }

        // Payout alert logic
        if (user.payout_available) {
            dispatch(triggerPopupAlert(payoutPopupAlert));
        } else {
            dispatch(popPopupAlert(payoutPopupAlert));
        }
    }, [
        user?.user_id,
        user?.verified,
        user?.payout_available,
        dispatch
    ])

    return (
        <>
            <CustomGlobalAlert />
            <PopUpMessageAlertModal />
            <SuccessModal />
            <ConfirmationModal />
        </>
    )
}