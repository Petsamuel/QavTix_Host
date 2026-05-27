import { useState, useEffect } from "react"
import DashboardStatCard from "../cards/DashboardStatCard"
import CreateEventBtn from "@/lib/features/create-event/CreateEventBtn"
import { Button } from "../ui/button"
import { Icon } from "@iconify/react"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useAppSelector } from "@/lib/redux/hooks"
import { mapToStatCards } from "@/helper-fns/mapToStatCards"
import { useRouter } from "next/navigation"
import { NAVIGATION_LINKS } from "@/enums/navigation"
import { getGreeting } from "@/helper-fns/date-utils"

interface OverviewSectionProps {
    cards: DashboardCardData
}

export default function OverviewSection({ cards }: OverviewSectionProps) {

    const { user } = useAppSelector(store => store.authUser)
    const statCards = mapToStatCards(cards)
    const router = useRouter()

    // Defer time-based greeting to client-only to avoid SSR/client hydration mismatch
    const [greeting, setGreeting] = useState<string | null>(null)
    useEffect(() => { setGreeting(getGreeting()) }, [])

    return (
        <section className="w-full overflow-hidden mt-10 lg:mt-0">
            <div className="flex justify-between items-center">
                <h2 className={cn(space_grotesk.className, "capitalize text-lg text-brand-secondary-8 font-bold")}>
                    Overview
                </h2>
                <CreateEventBtn activeEventsCount={cards.active_events} />
            </div>

            <div className="relative mt-12 grid grid-cols-1 py-0 xsm:grid-cols-2 items-stretch gap-6 px-6 md:px-10 bg-linear-to-br from-brand-primary-5.2 to-brand-primary min-h-35 w-full rounded-xl overflow-hidden">
                <div className="text-white relative z-10 py-6 flex flex-col justify-center">
                    <h3 className={cn(space_grotesk.className, "capitalize text-lg md:text-2xl leading-tight font-bold wrap-break-words")}>
                        {greeting && user?.full_name && `${greeting} ${user.full_name.split(" ")[0]}!`}
                    </h3>
                    <p className="text-xs md:text-sm lg:text-base mt-2 opacity-90 wrap-break-words">
                        You have {cards.active_events} active event{cards.active_events !== 1 ? "s" : ""} and {cards.tickets_sold} tickets sold
                    </p>

                    <Button onClick={() => router.push(NAVIGATION_LINKS.MY_EVENTS.href)} className="mt-4 md:mt-6 bg-white text-brand-primary-6 font-semibold text-xs md:text-sm hover:bg-neutral-100 border-none w-fit">
                        <span>View All Events</span>
                        <Icon icon="stash:arrow-right" width="24" height="24" />
                    </Button>
                </div>

                <div className="hidden xsm:flex h-full w-full justify-end items-end relative z-10 pt-4">
                    <Image
                        src="/images/vectors/Saly-26.svg"
                        alt="dashboard illustration"
                        width={400}
                        height={400}
                        className="w-full h-full max-h-64 object-contain object-bottom md:object-bottom-right"
                    />
                </div>

                <div
                    className="absolute md:hidden right-0 rounded-xl opacity-75 top-0 bottom-0 w-[80%] h-full bg-no-repeat bg-contain bg-right"
                    style={{ backgroundImage: "url('/images/vectors/logo-bg-element2.svg')" }}
                />
                <div
                    className="absolute hidden md:block right-0 rounded-xl opacity-75 top-0 bottom-0 w-[95%] h-full bg-no-repeat bg-contain bg-right"
                    style={{ backgroundImage: "url('/images/vectors/logo-bg-element.svg')" }}
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 p-1">
                {statCards.map((v, i) => (
                    <DashboardStatCard cardData={v} key={`${v.linkHref}-${i}`} />
                ))}
            </div>
        </section>
    )
}