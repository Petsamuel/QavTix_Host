import { cn } from "@/lib/utils"
import MetricCard from "./MetricCard1"

interface MetricsCardsContainerProps {
    metrics:    MetricCardData[] 
    className?: string
}

export default function CustomersProfilePageMetricCardsContainer({ metrics, className }: MetricsCardsContainerProps) {
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
            {metrics.map((metric) => (
                <MetricCard key={metric.id} data={metric} />
            ))}
        </div>
    )
}