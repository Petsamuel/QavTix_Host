import { cn } from "@/lib/utils";

export default function DataCountIndicator({ label, count }: { label: string, count?: number }) {
    return (
        <span className="flex items-center gap-2">
            {label}
            {count !== undefined && (
                <span className={cn(
                    'flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold',
                    'bg-brand-accent-6 text-white'
                )}>
                    {count}
                </span>
            )}
        </span>
    )
}