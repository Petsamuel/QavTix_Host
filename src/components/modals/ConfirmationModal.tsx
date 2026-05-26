"use client";

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { closeConfirmation, confirmAction, resetConfirmationStatus } from '@/lib/redux/slices/confirmationSlice';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { AnimatedDialog } from '../custom-utils/dialogs/AnimatedDialog';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import { DialogDescription } from '@radix-ui/react-dialog';

export default function ConfirmationModal() {
    const dispatch = useAppDispatch()
    const pathName = usePathname()

    const { isOpen, title, description, confirmText, cancelText, actionType, isPerforming } =
        useAppSelector((state) => state.confirmation)

    const handleConfirm = () => {
        if (!actionType) {
            dispatch(closeConfirmation())
        }

        else {
            dispatch(confirmAction())
        }
    }

    useEffect(() => {
        if (isOpen) {
            dispatch(closeConfirmation())
            dispatch(resetConfirmationStatus())
        }
    }, [pathName])

    return (
        <AnimatedDialog
            open={isOpen}
            showCloseButton={false}
            className='md:max-w-sm! py-2'
        >
            <DialogHeader className="text-center flex justify-center items-center">
                <DialogTitle className="text-lg font-bold text-brand-secondary-9">
                    {title}
                </DialogTitle>
                <DialogDescription className="text-sm text-center text-brand-secondary-9">
                    {description}
                </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-6 justify-center flex-row gap-3 sm:gap-3">
                <button
                    onClick={() => dispatch(closeConfirmation())}
                    disabled={isPerforming}
                    className="w-full px-6 py-4 text-sm font-medium text-brand-secondary-9 bg-white border-2 border-gray-300 rounded-full hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {cancelText}
                </button>

                <button
                    onClick={handleConfirm}
                    disabled={isPerforming}
                    className={cn(
                        "w-full px-6 py-4 text-sm font-medium text-white rounded-full hover:shadow-md transition-all disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer",
                        actionType?.includes("DELETE")
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-brand-primary-6 hover:bg-brand-primary-7"
                    )}
                >
                    {isPerforming
                        ? <><Icon icon="lucide:loader-2" className="size-4 animate-spin" /> Processing...</>
                        : confirmText
                    }
                </button>
            </DialogFooter>
        </AnimatedDialog>
    )
}