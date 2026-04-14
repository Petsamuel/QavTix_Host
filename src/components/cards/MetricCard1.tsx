"use client"

import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"

interface MetricCardProps {
    data: MetricCardData
    className?: string
}

export default function MetricCard({ data, className }: MetricCardProps) {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    },[])

    return (
        <div className={cn(
            'shadow-[0px_5.8px_23.17px_0px_#3326AE14] flex flex-col justify-center max-h-32 xl:h-28 bg-white rounded-lg border border-brand-neutral-2 px-4 py-5 hover:scale-103 transition-transform duration-300 ease-in-out',
            className
        )}>
            <div className="">
                <h3 className={cn(space_grotesk.className, "sm:text-lg md:text-xl font-bold text-brand-secondary-9 mb-2")}>
                    {isMounted && data.value}
                </h3>
                <div className="flex items-center gap-2 md:gap-3">
                    <Icon 
                        icon={data.icon} 
                        className={cn('size-6 md:size-7 shrink-0', data.iconColor)} 
                    />
                    <div>
                        <p className="text-xs font-medium md:text-sm text-brand-secondary-8 mb-0.5">
                            {data.label}
                        </p>
                        <p className="text-[11px] md:text-xs text-brand-secondary-6">
                            {data.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}