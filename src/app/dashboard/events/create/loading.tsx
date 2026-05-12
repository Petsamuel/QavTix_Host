import { Skeleton } from "@/components/ui/skeleton";

function StepperLoader() {
    return (
        <div className="flex items-start gap-0 w-full overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center flex-1 min-w-0">
                    {/* Step circle + label */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                        <Skeleton className="w-10 h-10 rounded-full bg-[#E0E0E0]" />
                        <div className="flex flex-col items-center gap-1">
                            <Skeleton className="h-3 w-10 rounded bg-[#E0E0E0]" />
                            <Skeleton className="h-3.5 w-24 rounded bg-[#E0E0E0]" />
                            <Skeleton className="h-3 w-14 rounded bg-[#E0E0E0]" />
                        </div>
                    </div>
                    {/* Connector line (not after last step) */}
                    {i < 4 && (
                        <Skeleton className="h-[2px] flex-1 mx-2 mt-[-28px] bg-[#E0E0E0] rounded" />
                    )}
                </div>
            ))}
        </div>
    );
}

function FormSectionLoader() {
    return (
        <div className="space-y-6">
            {/* Section title */}
            <Skeleton className="h-6 w-36 rounded bg-[#E0E0E0]" />

            {/* Row: 3 inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded bg-[#E0E0E0]" />
                        <Skeleton className="h-11 w-full rounded-lg bg-[#E0E0E0]" />
                    </div>
                ))}
            </div>

            {/* Section title */}
            <Skeleton className="h-6 w-28 rounded bg-[#E0E0E0] mt-2" />

            {/* Row: 3 inputs (date / time / end time) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-20 rounded bg-[#E0E0E0]" />
                        <Skeleton className="h-11 w-full rounded-lg bg-[#E0E0E0]" />
                    </div>
                ))}
            </div>

            {/* Section title */}
            <Skeleton className="h-6 w-32 rounded bg-[#E0E0E0] mt-2" />

            {/* Row: 2 inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24 rounded bg-[#E0E0E0]" />
                        <Skeleton className="h-11 w-full rounded-lg bg-[#E0E0E0]" />
                    </div>
                ))}
            </div>

            {/* Textarea / description */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded bg-[#E0E0E0]" />
                <Skeleton className="h-28 w-full rounded-lg bg-[#E0E0E0]" />
            </div>
        </div>
    );
}

export default function LoadingCreateEventPage() {
    return (
        <div className="space-y-8 px-1">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-7 w-36 rounded bg-[#E0E0E0]" />
                <Skeleton className="h-10 w-36 rounded-xl bg-[#E0E0E0]" />
            </div>

            {/* Stepper */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <StepperLoader />
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-8">
                <FormSectionLoader />
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-end gap-3 pb-6">
                <Skeleton className="h-10 w-28 rounded-xl bg-[#E0E0E0]" />
                <Skeleton className="h-10 w-28 rounded-xl bg-[#E0E0E0]" />
            </div>
        </div>
    );
}
