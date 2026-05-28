import Image from "next/image";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface EventInfoProps {
  image: string;
  title: string;
  category: string;
  variant?: "desktop" | "mobile";
  className?: string;
  isFeatured?: boolean;
}

export default function EventInfo({
  image,
  title,
  category,
  variant = "desktop",
  className,
  isFeatured,
}: EventInfoProps) {

    const isDesktop = variant === "desktop";

    return (
        <div className={cn("flex gap-2 items-center", !isDesktop && "items-center gap-3", className)}>
            {/* Image Container Wrapper */}
            <div className="relative shrink-0">
                <div
                    className={cn(
                        "relative overflow-hidden rounded-lg",
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
                {isFeatured && (
                    <span className="absolute -top-1.5 -right-1.5 z-10 flex items-center justify-center size-5 rounded-full bg-white shadow-sm border border-brand-neutral-2">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="iconify iconify--mdi text-brand-accent-6 w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="m8.58 17.25l.92-3.89l-3-2.58l3.95-.37L12 6.8l1.55 3.65l3.95.33l-3 2.58l.92 3.89L12 15.19zM12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8"></path>
                        </svg>
                    </span>
                )}
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