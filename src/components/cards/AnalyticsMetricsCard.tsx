import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface MetricCardProps {
    data: MetricCardData
    className?: string
}

export default function AnalyticsMetricsCard({ data, className }: MetricCardProps) {

    const isMounted = useIsMounted()

    return (
        <div className={cn(
            'shadow-[0px_5.8px_23.17px_0px_#3326AE14] flex flex-col justify-center max-h-32 xl:h-28 bg-white rounded-lg border border-brand-neutral-2 px-2 py-5 hover:scale-103 transition-transform duration-300 ease-in-out',
            className
        )}>
            <div className="">
                <div className="flex justify-between items-center gap-2 md:gap-3 mb-1">
                    <h3 className={cn(space_grotesk.className, "md:text-xl font-bold text-brand-secondary-9 mb-2")}>
                        {isMounted && data.value}
                    </h3>

                    <Image
                        src={data.icon}
                        alt=""
                        aria-hidden="true"
                        width={40}
                        height={40} 
                        className="select-none pointer-events-none size-9 md:size-10"
                    />
                </div>
                <div className="flex justify-between items-center gap-2 md:gap-3">
                    <p className="text-xs font-medium text-brand-secondary-8">
                        {data.label}
                    </p>
                    <p className="text-[11px] md:text-xs text-brand-neutral-6">
                        {data.description}
                    </p>
                </div>
            </div>
        </div>
    )
}