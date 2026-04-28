'use client'

import { Dispatch, SetStateAction, useState } from "react";
import { AnimatedDialog } from "../custom-utils/dialogs/AnimatedDialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface SchedulePublishModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onSchedule: (dateTime: { date: string; time: string }) => void;
}

export default function SchedulePublishModal({ open, setOpen, onSchedule }: SchedulePublishModalProps) {
    const [schedule, setSchedule] = useState({ date: "", time: "" })
    const [errors, setErrors] = useState<{ date?: string; time?: string }>({})

    // Helper to check if any real error messages exist
    const hasErrors = Object.values(errors).some(error => !!error);

    const validate = () => {
        const newErrors: { date?: string; time?: string } = {}
        const now = new Date()
        
        if (!schedule.date) {
            newErrors.date = "Select a date";
        }
        if (!schedule.time) {
            newErrors.time = "Select time";
        }
        
        if (schedule.date && schedule.time) {
            const selectedDate = new Date(`${schedule.date}T${schedule.time}`)
            if (selectedDate <= now) {
                newErrors.time = "Time must be in the future";
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleSchedule = () => {
        if (validate()) {
            onSchedule(schedule)
        }
    }

    const handleChange = (field: 'date' | 'time', value: string) => {
        setSchedule(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            // We set it to undefined, but we need the UI check to look for truthy values
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const isPM = schedule.time ? parseInt(schedule.time.split(':')[0], 10) >= 12 : false;
    const currentAmpm = isPM ? "PM" : "AM";

    const handleAmpmChange = (newAmpm: 'AM' | 'PM') => {
        if (!schedule.time) {
            handleChange('time', newAmpm === 'PM' ? '12:00' : '00:00');
            return;
        }
        let [h, m] = schedule.time.split(':');
        let hours = parseInt(h, 10);
        if (newAmpm === 'PM' && hours < 12) {
            hours += 12;
        } else if (newAmpm === 'AM' && hours >= 12) {
            hours -= 12;
        }
        handleChange('time', `${String(hours).padStart(2, '0')}:${m}`);
    }

    return (
        <AnimatedDialog 
            showCloseButton={false} 
            className="md:max-w-md overflow-hidden rounded-[32px]" 
            open={open} 
            onOpenChange={(v) => {
                setOpen(v)
                if (!v) setErrors({})
            }}
        >
            <div className="text-center space-y-2 mb-8">
                <DialogTitle className="md:text-lg font-bold text-brand-secondary-9">Schedule Event</DialogTitle>
                <p className="text-brand-secondary-6 text-xs">Choose when your Event goes live.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-brand-secondary-8 font-medium mb-2 block text-sm ml-1">
                        Choose Date & Time
                    </label>
                    
                    <div className={cn(
                        "flex items-center w-full border rounded-md overflow-hidden transition-all duration-200 bg-white",
                        hasErrors
                            ? "border-red-500 ring-1 ring-red-500" 
                            : "border-slate-300 focus-within:ring-1 focus-within:ring-brand-primary focus-within:border-brand-primary"
                    )}>
                        <input 
                            type="date"
                            value={schedule.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleChange('date', e.target.value)}
                            className="flex-1 px-3 py-3 outline-none text-brand-secondary-7 text-sm bg-transparent border-none appearance-none cursor-pointer w-full min-w-0"
                        />

                        <div className={cn(
                            "w-px h-8 shrink-0", 
                            hasErrors ? "bg-red-500" : "bg-slate-300"
                        )} />

                        <input 
                            type="time"
                            value={schedule.time}
                            onChange={(e) => handleChange('time', e.target.value)}
                            className="flex-1 px-3 py-3 outline-none text-brand-secondary-7 text-sm bg-transparent border-none appearance-none cursor-pointer w-full min-w-0"
                        />
                        
                        <div className="flex border-l border-slate-300">
                            <button
                                type="button"
                                onClick={() => handleAmpmChange('AM')}
                                className={cn(
                                    "px-3 py-3 text-xs font-medium transition-colors border-r border-slate-300",
                                    currentAmpm === 'AM' ? "bg-brand-primary-1 text-brand-primary" : "text-brand-secondary-6 hover:bg-slate-50"
                                )}
                            >
                                AM
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAmpmChange('PM')}
                                className={cn(
                                    "px-3 py-3 text-xs font-medium transition-colors",
                                    currentAmpm === 'PM' ? "bg-brand-primary-1 text-brand-primary" : "text-brand-secondary-6 hover:bg-slate-50"
                                )}
                            >
                                PM
                            </button>
                        </div>
                    </div>
                    
                    {(errors.date || errors.time) && (
                        <p className="text-[10px] text-red-500 font-medium ml-1">
                            {errors.date || errors.time}
                        </p>
                    )}
                </div>

                <div className="flex justify-between gap-4 pt-2">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="w-[40%] h-12 md:h-14 text-brand-secondary-8 bg-white hover:shadow flex items-center gap-2 justify-center px-6 py-3 rounded-[30px] border border-brand-secondary-6 font-medium text-xs md:text-sm hover:bg-brand-neutral-3 active:scale-[0.98] transition-all duration-150"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSchedule}
                        className="w-[55%] px-6 py-3.5 rounded-[40px] bg-brand-primary hover:bg-brand-primary-7 text-white font-medium text-xs md:text-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                        Schedule Post
                    </button>
                </div>
            </div>
        </AnimatedDialog>
    )
}