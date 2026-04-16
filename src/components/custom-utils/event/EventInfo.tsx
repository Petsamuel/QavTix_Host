import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EventInfoProps {
  image: string;
  title: string;
  category: string;
  variant?: "desktop" | "mobile";
  className?: string;
}

export default function EventInfo({
  image,
  title,
  category,
  variant = "desktop",
  className,
}: EventInfoProps) {

    const isDesktop = variant === "desktop";

    return (
        <div className={cn("flex gap-2 items-center", !isDesktop && "items-center gap-3", className)}>
            {/* Image Container */}
            <div
                className={cn(
                    "relative overflow-hidden shrink-0 rounded-lg",
                    isDesktop ? "size-10" : "w-10 aspect-square rounded-md"
                )}
            >
                {
                    !image ?
                    <Skeleton className="w-full h-full bg-brand-neutral-4" />
                    :
                    <Image 
                        src={image} 
                        alt={title} 
                        fill 
                        className="object-cover" 
                    />
                }
            </div>

            {/* Text Content */}
            <div className={cn(isDesktop ? "flex-1 min-w-25" : "min-w-0")}>
                <h3
                    className={cn(
                        "font-semibold text-brand-secondary-9",
                        isDesktop ? "text-sm" : "text-xs"
                    )}
                    >
                    {title}
                </h3>
                <p
                    className={cn(
                        isDesktop ? "text-[11px] text-brand-secondary-6" : "text-[11px] text-brand-secondary-8"
                    )}
                >
                    {category}
                </p>
            </div>
        </div>
    )
}