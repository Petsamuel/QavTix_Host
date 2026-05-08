import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";

export default function Loading() {
    return (
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-brand-neutral-2 pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 bg-brand-neutral-3" />
                    <Skeleton className="h-4 w-72 bg-brand-neutral-2" />
                </div>
            </div>

            <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex gap-4 items-center p-4 border border-brand-neutral-2 rounded-2xl bg-white shadow-sm">
                        <Skeleton className="size-12 rounded-full bg-brand-neutral-3 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/3 bg-brand-neutral-3" />
                            <Skeleton className="h-3 w-1/2 bg-brand-neutral-2" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-lg bg-brand-neutral-2" />
                    </div>
                ))}
            </div>
        </div>
    );
}
