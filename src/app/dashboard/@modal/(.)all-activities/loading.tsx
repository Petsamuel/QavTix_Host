import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-brand-neutral-2">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 bg-brand-neutral-3" />
                        <Skeleton className="h-3 w-48 bg-brand-neutral-2" />
                    </div>
                    <Icon icon="line-md:close-circle-filled" className="size-6 text-brand-neutral-4" />
                </div>

                {/* Tabs Skeleton */}
                <div className="flex border-b border-brand-neutral-3">
                    <div className="flex-1 px-6 py-4 flex justify-center">
                        <Skeleton className="h-4 w-24 bg-brand-neutral-3" />
                    </div>
                    <div className="flex-1 px-6 py-4 flex justify-center">
                        <Skeleton className="h-4 w-24 bg-brand-neutral-2" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <Skeleton className="size-10 rounded-full bg-brand-neutral-3 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-3/4 bg-brand-neutral-3" />
                                <Skeleton className="h-3 w-1/2 bg-brand-neutral-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
