"use client"

import { useState } from "react"
import { CREATE_EVENT } from "@/enums/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/actions/event/client";
import ContentGatePromptModal from "@/components/modals/ContentGatePromptModal";

export default function CreateEventBtn(){
    const router = useRouter()
    const { user, isAuthenticated } = useAppSelector(store => store.authUser)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)

    // Fetch organizer events count dynamically
    const { data: eventsResult } = useQuery({
        queryKey: ["organizer-events"],
        queryFn: () => getEvents(),
        enabled: isAuthenticated,
    })

    const isStandardPlan = !user?.plan_type || user?.plan_type === "free" || user?.plan_type === "standard"
    
    // Log the plan to assist in inspection
    console.log("User Authentication & Plan State:", {
        email: user?.email,
        plan_type: user?.plan_type,
        isStandardPlan
    })

    const cards = eventsResult?.data?.cards
    const activeCount = cards ? (cards.live ?? 0) + (cards.sold_out ?? 0) : 0
    const isLimitReached = isAuthenticated && isStandardPlan && activeCount >= 2

    return (
        <>
            <button
                onClick={() => {
                    if (isLimitReached) {
                        setShowUpgradeModal(true)
                    } else {
                        router.push(CREATE_EVENT.href)
                    }
                }}
                className={cn(
                    "md:bg-brand-primary-1 text-brand-primary-6 md:p-2 font-bold text-sm mx-1 flex rounded-md md:rounded-sm gap-1 items-center transition-all ease-in-out duration-200 cursor-pointer",
                    isLimitReached && "opacity-50 blur-[1px]"
                )}
                aria-label="Create event"
            >
                <span className="size-10 md:size-7 rounded flex justify-center items-center bg-brand-primary-4  text-white">
                    <Icon icon="codex:plus" width="21" height="21" className="size-9" />
                </span>
                <span className="hidden md:inline">Create Event</span>
            </button>

            <ContentGatePromptModal
                open={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                config={{
                    icon: "solar:lock-bold",
                    iconBg: "bg-brand-primary-1",
                    iconColor: "text-brand-primary-6",
                    title: "Upgrade Your Plan",
                    description: (
                        <>
                            Creating new events is not available on your current plan because you have reached the limit of 2 active events. Upgrade your plan to unlock this feature.
                        </>
                    ),
                    primaryLabel: "View Plans",
                    primaryAction: (routerInstance) => {
                        setShowUpgradeModal(false)
                        routerInstance.push("/dashboard/settings/subscription")
                    },
                    secondaryLabel: "Go back",
                }}
            />
        </>
    )
}