"use client"

import { useState } from "react"
import { CREATE_EVENT } from "@/enums/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { getEvents } from "@/actions/event/client";
import ContentGatePromptModal from "@/components/modals/ContentGatePromptModal";

interface CreateEventBtnProps {
    activeEventsCount?: number
}

export default function CreateEventBtn({ activeEventsCount }: CreateEventBtnProps = {}) {
    const router = useRouter()
    const { user } = useAppSelector(store => store.authUser)
    const [showUpgradeModal, setShowUpgradeModal] = useState(false)
    const [isCheckingLimit, setIsCheckingLimit] = useState(false)

    const sub = user?.subscription as any
    const planSlug = (
        (user?.subscription === false ? "free" : undefined) ||
        user?.plan_type ||
        (typeof sub === "object" ? sub?.plan_slug || sub?.plan?.slug : undefined) ||
        (typeof sub === "string" ? sub : undefined) ||
        "free"
    ).toLowerCase()
    const isStandardPlan = planSlug === "free" || planSlug === "standard"
    
    // Visually show limit reached if prop is passed and >= 2
    const activeCountOnRender = activeEventsCount !== undefined ? activeEventsCount : 0
    const isLimitReached = isStandardPlan && activeCountOnRender >= 2

    // Detailed console log to debug real-time plan type, counts and resolved flags
    // console.log("CreateEventBtn Debug Details:", {
    //     userPlanType: user?.plan_type,
    //     subscription: user?.subscription,
    //     resolvedPlanSlug: planSlug,
    //     isStandardPlan,
    //     activeEventsCountProp: activeEventsCount,
    //     activeCountOnRender,
    //     isLimitReached
    // })

    return (
        <>
            <button
                disabled={isCheckingLimit}
                onClick={async () => {
                    // Check limit synchronously first using the prop count to prevent race conditions
                    if (isLimitReached) {
                        setShowUpgradeModal(true)
                        return
                    }

                    if (isCheckingLimit) return
                    
                    setIsCheckingLimit(true)
                    try {
                        if (isStandardPlan) {
                            const result = await getEvents()
                            const cards = result?.data?.cards
                            const activeCount = cards 
                                ? (cards.live ?? 0) + (cards.sold_out ?? 0)
                                : (activeEventsCount !== undefined ? activeEventsCount : 0)
                            
                            if (activeCount >= 2) {
                                setShowUpgradeModal(true)
                                return
                            }
                        }
                        
                        router.push(CREATE_EVENT.href)
                    } catch (error) {
                        console.error("Failed to verify event limit:", error)
                        // If checking fails, fallback safely to the prop count if available
                        if (activeEventsCount !== undefined && activeEventsCount >= 2) {
                            setShowUpgradeModal(true)
                        } else {
                            router.push(CREATE_EVENT.href)
                        }
                    } finally {
                        setIsCheckingLimit(false)
                    }
                }}
                className={cn(
                    "md:bg-brand-primary-1 text-brand-primary-6 md:p-2 font-bold text-sm mx-1 flex rounded-md md:rounded-sm gap-1 items-center transition-all ease-in-out duration-200 cursor-pointer",
                    isLimitReached && "opacity-50 ",
                    isCheckingLimit && "cursor-not-allowed opacity-75"
                )}
                aria-label="Create event"
            >
                {isCheckingLimit ? (
                    <span className="size-10 md:size-7 flex justify-center items-center">
                        {<Icon icon="lucide:loader-2" className="size-5 animate-spin text-brand-primary-6" />}
                    </span>
                ) : (
                    <span className="size-10 md:size-7 rounded flex justify-center items-center bg-brand-primary-4  text-white">
                        <Icon icon="codex:plus" width="21" height="21" className="size-9" />
                    </span>
                )}
                <span className="hidden lg:inline">
                    {/* {isCheckingLimit ? "Verifying Plan..." : "Create Event"} */}
                    Create Event
                </span>
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