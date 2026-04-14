import { cn } from "@/lib/utils"

export default function ToolbarButton({
    children,
    onClick,
    active = false,
}: {
    children: React.ReactNode
    onClick: () => void
    active?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "p-2 rounded-md transition-all flex items-center justify-center",
                active 
                    ? "bg-brand-primary-6 text-white" 
                    : "text-brand-primary-6 hover:bg-brand-neutral-4"
            )}
        >
            {children}
        </button>
    )
}