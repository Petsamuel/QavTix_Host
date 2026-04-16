import { cn } from "@/lib/utils"
import AnalyticsMetricsCard from "./AnalyticsMetricsCard"

interface MetricsCardsConatinerProps {
    metrics: MetricCardData[]
    className?: string
}

export default function AnalyticsMetricsCardsContainer({ metrics, className }: MetricsCardsConatinerProps) {
    return (
        <div className={cn(
            'grid grid-cols-1 xsm:grid-cols-2 lg:grid-cols-4 gap-4',
            className
        )}>
            {metrics.map((metric) => (
                <AnalyticsMetricsCard key={metric.id} data={metric} />
            ))}
        </div>
    )
}