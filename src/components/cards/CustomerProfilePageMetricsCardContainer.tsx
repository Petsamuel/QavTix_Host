import { cn } from "@/lib/utils"
import { formatPrice } from "@/helper-fns/formatPrice"
import UserMetricCard from "./UserMetricsCard"

interface Props {
    cards:     CustomerProfileCards
    currency?: string
    className?: string
}

const makeTrend = (current: number, changePercent: number): number[] => {
    if (changePercent === 0) {
        return [current, current * 0.99, current * 1.01, current * 0.98, current]
    }

    const previous = current / (1 + changePercent / 100)
    const isUp     = changePercent > 0

    if (isUp) {
        // Wavy upward curve — dips then rises to current
        return [
            previous,
            previous * 0.97,
            previous * 1.03,
            previous * 0.95,
            previous * 1.05,
            current * 0.98,
            current,
        ]
    } else {
        // Wavy downward curve — peaks then falls to current
        return [
            previous,
            previous * 1.03,
            previous * 0.97,
            previous * 1.05,
            previous * 0.95,
            current * 1.02,
            current,
        ]
    }
}


export default function CustomersProfilePageMetricCardsContainer({
    cards,
    currency = "NGN",
    className,
}: Props) {

    const totalSpent      = parseFloat(cards.total_spent)
    const lastOrderValue  = parseFloat(cards.last_order_value)

    const metrics = [
        {
            id:            "total-spent",
            label:         "Total Spent",
            value:         formatPrice(totalSpent, currency),
            changePercent: cards.total_spent_change,
            trendData:     makeTrend(totalSpent, cards.total_spent_change),
            isNegativeGood: false,
        },
        {
            id:            "tickets-bought",
            label:         "Tickets Bought",
            value:         String(cards.tickets_bought),
            changePercent: cards.tickets_bought_change,
            trendData:     makeTrend(cards.tickets_bought, cards.tickets_bought_change),
            isNegativeGood: false,
        },
        {
            id:            "refund-count",
            label:         "Refund Count",
            value:         String(cards.refund_count),
            changePercent: cards.refund_count_change,
            trendData:     makeTrend(cards.refund_count, cards.refund_count_change),
            isNegativeGood: true,
        },
        {
            id:            "last-order-value",
            label:         "Last Order Value",
            value:         formatPrice(lastOrderValue, currency),
            changePercent: cards.last_order_value_change,
            trendData:     makeTrend(lastOrderValue, cards.last_order_value_change),
            isNegativeGood: false,
        },
    ]

    return (
        <div className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
            className
        )}>
            {metrics.map(m => (
                <UserMetricCard
                    key={m.id}
                    label={m.label}
                    value={m.value}
                    changePercent={m.changePercent}
                    trendData={m.trendData}
                    isNegativeGood={m.isNegativeGood}
                />
            ))}
        </div>
    )
}