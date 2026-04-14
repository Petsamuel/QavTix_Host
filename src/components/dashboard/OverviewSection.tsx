import DashboardStatCard from "../cards/DashboardStatCard"
import CreateEventBtn from "@/lib/features/create-event/CreateEventBtn"
import { Button } from "../ui/button"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useAppSelector } from "@/lib/redux/hooks"
import { mapToStatCards } from "@/helper-fns/mapToStatCards"

interface OverviewSectionProps {
    cards: DashboardCardData
}

export default function OverviewSection({ cards }: OverviewSectionProps) {

    const { user } = useAppSelector(store => store.authUser)
    const statCards = mapToStatCards(cards)

    return (
        <section className="w-full overflow-hidden mt-10 lg:mt-0">
            <div className="flex justify-between items-center">
                <h2 className={cn(space_grotesk.className, "capitalize text-lg text-brand-secondary-8 font-bold")}>
                    Overview
                </h2>
                <CreateEventBtn />
            </div>

            <div className="relative mt-12 grid grid-cols-1 xsm:grid-cols-2 items-center gap-6 px-6 md:px-10 bg-linear-to-br from-brand-primary-5.2 to-brand-primary min-h-47 h-49 w-full rounded-xl overflow-hidden">
                <div className="text-white relative z-10 py-6">
                    <h3 className={cn(space_grotesk.className, "capitalize text-lg md:text-2xl leading-tight font-bold")}>
                        Good Morning {user?.full_name}!
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base mt-2 opacity-90">
                        You have {cards.active_events} active event{cards.active_events !== 1 ? "s" : ""} and {cards.tickets_sold} tickets sold
                    </p>

                    <Button className="mt-3 md:mt-6 bg-white text-brand-primary-6 font-semibold text-xs md:text-sm hover:bg-neutral-100 border-none">
                        <span>View All Events</span>
                        <Icon icon="stash:arrow-right" width="24" height="24" />
                    </Button>
                </div>

                <div className="flex h-full">
                    <Image
                        src="/images/vectors/Saly-26.svg"
                        alt="dashboard illustration"
                        width={400}
                        height={400}
                        className="w-40 md:w-56 hidden xsm:block h-47.5 md:h-49 absolute z-10 -bottom-1 md:relative md:bottom-0"
                    />
                </div>

                <div
                    className="absolute md:hidden right-0 rounded-xl opacity-75 top-0 bottom-0 w-[80%] h-full bg-no-repeat bg-contain bg-right"
                    style={{ backgroundImage: "url('/images/vectors/logo-bg-element2.svg')" }}
                />
                <div
                    className="absolute hidden md:block right-0 rounded-xl opacity-75 top-0 bottom-0 w-[80%] h-full bg-no-repeat bg-contain bg-right"
                    style={{ backgroundImage: "url('/images/vectors/logo-bg-element.svg')" }}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                {statCards.map((v, i) => (
                    <DashboardStatCard cardData={v} key={`${v.linkHref}-${i}`} />
                ))}
            </div>
        </section>
    )
}