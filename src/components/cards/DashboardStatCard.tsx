import { formatPrice } from "@/helper-fns/formatPrice"
import { space_grotesk } from "@/lib/fonts"
import { useAppSelector } from "@/lib/redux/hooks"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import Link from "next/link"

export default function DashboardStatCard({ cardData }: { cardData: IDashboardStat }) {
    const { user } = useAppSelector(store => store.authUser)

    const isRevenue  = cardData.label.includes("Revenue") || cardData.label.includes("Payout")
    const rawNumber  = isRevenue
        ? formatPrice(parseFloat(cardData.number as string), user?.currency)
        : Number(cardData.number).toLocaleString()

    return (
        <div className={cn(cardData.cardBg, "group rounded-xl shadow-xs flex flex-col justify-between gap-5 p-5")}>
            <div className={cn(
                "flex justify-center items-center text-white w-9 aspect-square rounded-full",
                cardData.iconBg,
                "group-hover:scale-110 ease-in-out duration-200 transition-all"
            )}>
                <Icon icon={cardData.icon} width={21.6} height={21.6} />
            </div>

            <div>
                <h3 className={cn(space_grotesk.className, "font-bold text-lg text-brand-secondary-9")}>
                    {rawNumber}
                </h3>
                <p className="text-brand-secondary-8 text-sm font-medium mt-1">
                    {cardData.label}
                </p>
                <span className="text-xs text-brand-secondary-6">
                    {cardData.change.value} {cardData.change.period}
                </span>
            </div>

            <Link
                href={cardData.linkHref}
                className="w-fit flex items-center gap-1 text-brand-primary-6 font-bold text-xs hover:text-brand-primary-7 transition-colors"
            >
                <span>{cardData.buttonLabel}</span>
                <Icon icon="stash:arrow-right" width="22" height="22" />
            </Link>
        </div>
    )
}