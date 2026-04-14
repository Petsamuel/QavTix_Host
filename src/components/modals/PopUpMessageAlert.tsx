"use client"

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { POPUP_MESSAGE_ALERT_CONFIG } from "./resources/popup-message-alert-config";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { space_grotesk } from "@/lib/fonts";
import { useAppSelector } from "@/lib/redux/hooks";
import { closePopupAlertModal } from "@/lib/redux/slices/popupAlertSlice";
import { useRouter } from "next/navigation";

export default function PopUpMessageAlertModal() {
    const dispatch = useDispatch()
    const router = useRouter()
    
    const { alerts, isOpen } = useAppSelector((state) => state.popupAlert)
    
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState<'left' | 'right'>('right')

    useEffect(() => {
        if (isOpen) setCurrentIndex(0)
    }, [isOpen])

    const currentAlert = alerts[currentIndex];
    const config = currentAlert ? POPUP_MESSAGE_ALERT_CONFIG[currentAlert.type] : null;
    const iconSrc = config?.icon;

    const handleNext = () => {
        if (currentIndex < alerts.length - 1) {
            setDirection('right')
            setCurrentIndex(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setDirection('left')
            setCurrentIndex(prev => prev - 1)
        }
    }

    const handlePrimaryAction = () => {
        if (!currentAlert) return;

        // Serializable Navigation Logic
        if (currentAlert.navigateTo) {
            router.push(currentAlert.navigateTo)
        }
        
        dispatch(closePopupAlertModal())
    }

    const handleClose = () => {
        dispatch(closePopupAlertModal())
        setCurrentIndex(0)
    }

    useEffect(() => {
        if (!alerts.length){
            dispatch(closePopupAlertModal())
        }
    },[alerts.length])

    if (!isOpen || alerts.length === 0 || !currentAlert || !config || !iconSrc) return null;

    return (
        <Dialog open={isOpen}>
            <DialogContent showCloseButton={false} className="sm:max-w-160 max-h-[30em] p-0 overflow-x-hidden overflow-y-auto border-none rounded-4xl">
                <DialogTitle className="sr-only">{currentAlert.title}</DialogTitle>

                <div className="bg-[url('/images/vectors/logo-bg-element3.svg')] -right-8 md:-right-[10em] opacity-90 h-full w-[70%] bottom-0 absolute bg-contain bg-no-repeat object-bottom" />
               
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute right-4 size-7 flex justify-center items-center top-4 z-50 rounded-full p-1 bg-brand-neutral-6 hover:bg-brand-neutral-5 text-white transition-colors"
                >
                    <Icon icon="iconamoon:close-duotone" width="24" height="24" className="size-7" />
                </button>

                {/* Navigation Buttons */}
                {alerts.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-3xl w-16 h-fit p-2 bg-white border border-brand-neutral-7 flex justify-center items-center hover:bg-gray-50 transition-all",
                                currentIndex === 0 && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            <Icon icon="fluent:chevron-left-20-regular" width="20" height="20" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === alerts.length - 1}
                            className={cn(
                                "absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-3xl w-16 h-fit p-2 bg-white border border-brand-neutral-7 flex justify-center items-center hover:bg-gray-50 transition-all",
                                currentIndex === alerts.length - 1 && "opacity-40 cursor-not-allowed"
                            )}
                        >
                            <Icon icon="fluent:chevron-right-20-regular" width="20" height="20" />
                        </button>
                    </>
                )}

                {/* Content Container with Animation */}
                <div className="relative overflow-hidden">
                    <div
                        key={currentAlert.id}
                        className={cn(
                            "animate-in fade-in-0 duration-300",
                            direction === 'right' ? "slide-in-from-right-10" : "slide-in-from-left-10"
                        )}
                    >
                        <div className="flex justify-center mt-7 mb-4">
                            <Icon icon={iconSrc!} className="size-24" strokeWidth={2} />
                        </div>

                        {/* Content */}
                        <div className="pb-8 px-4 text-center">
                            <h2 className={cn(space_grotesk.className, "text-xl md:text-3xl font-bold text-brand-secondary-9 mb-2")}>
                                {currentAlert.title}
                            </h2>
                            
                            {currentAlert.subtitle && (
                                <p className="text-sm text-brand-secondary-9">
                                    {currentAlert.subtitle}
                                </p>
                            )}
                            
                            <p className="text-sm text-brand-secondary-9 leading-relaxed mb-6 max-w-md mx-auto">
                                {currentAlert.description}
                            </p>

                            {/* Action Button */}
                            {currentAlert.buttonText && (
                                <Button
                                    onClick={handlePrimaryAction}
                                    className={cn(
                                        "text-white bg-brand-primary-6 font-medium hover:bg-brand-primary-7 hover:shadow-sm text-center px-8 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-1",
                                    )}
                                >
                                    {currentAlert.buttonText}
                                    <Icon icon="si:arrow-right-fill" width="24" height="24" />
                                </Button>
                            )}
                        </div>

                        {/* Pagination Dots */}
                        {alerts.length > 1 && (
                            <div className="flex justify-center gap-2 pb-6">
                                {alerts.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setDirection(index > currentIndex ? 'right' : 'left')
                                            setCurrentIndex(index)
                                        }}
                                        className={cn(
                                            "h-2 rounded-full transition-all duration-300",
                                            index === currentIndex 
                                                ? "w-8 bg-blue-600" 
                                                : "w-2 bg-gray-300 hover:bg-gray-400"
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}