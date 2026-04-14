import { cn } from "@/lib/utils"
import MetricSparkline from "../charts/MetricsSparkLine"
import { space_grotesk } from "@/lib/fonts"
import { useIsMounted } from "@/custom-hooks/UseIsMounted"

interface UserMetricCardProps {
    label:           string
    value:           string | number
    trendData:       number[]
    changePercent:   number 
    isNegativeGood?: boolean
    className?:      string
}

export default function UserMetricCard({
    label,
    value,
    trendData,
    changePercent,
    isNegativeGood = false,
    className,
}: UserMetricCardProps) {

    const isUp     = changePercent > 0
    const isDown   = changePercent < 0
    const isStable = changePercent === 0

    // isNegativeGood = true means going down is actually good (e.g. refund count)
    const isPositive = isNegativeGood ? isDown : isUp
    const isNegative = isNegativeGood ? isUp   : isDown

    const color = isPositive ? "#10B981" : isNegative ? "#EF4444" : "#9CA3AF"
    const sign  = isUp ? "+" : isDown ? "-" : ""

    const isMounted = useIsMounted()

    return (
        <div className={cn(
            "bg-white rounded-2xl border flex flex-col gap-2 justify-center border-brand-neutral-2",
            "p-3 md:py-4 md:px-6 shadow-[0px_5.8px_23.17px_0px_#3326AE14]",
            "transition-transform hover:scale-[1.02] ease-linear overflow-hidden", // overflow-hidden stops sparkline bleed
            className
        )}>
            <div className="flex justify-between w-full items-center gap-3">
                <p className="text-xs text-brand-secondary-9 shrink-0">{label}</p>

                {!isStable && (
                    <span
                        className="text-xs md:text-sm font-bold shrink-0"
                        style={{ color }}
                    >
                        {sign}{Math.abs(changePercent).toFixed(0)}%
                    </span>
                )}
            </div>

            <div className="flex flex-wrap w-full justify-between items-end gap-2">
                <h3 className={cn(
                    space_grotesk.className,
                    "md:text-xl font-bold text-brand-secondary-9 shrink-0"
                )}>
                    {isMounted && value}
                </h3>

                <div className="w-16 h-10 overflow-hidden">
                    <MetricSparkline
                        data={trendData}
                        color={color}
                        width={60}
                        height={40}
                    />
                </div>
            </div>
        </div>
    )
}