"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import GeneralInfoForm from "../settings-page/profile/GeneralInfoForm"
import BusinessInfoForm from "../settings-page/profile/BusinessInfoForm"
import { useAppSelector } from "@/lib/redux/hooks"
import { ApiCategory } from "@/actions/filters"

type Tab = "general" | "business"

interface Props {
    categories: ApiCategory[]
}

export default function ProfileSettingsContentWrapper({ categories }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("general")
    const { user } = useAppSelector(s => s.authUser)

    if (!user) return null

    return (
        <main className="w-full pt-8 pb-16">
            <nav className="flex border-b border-brand-secondary-2 mb-10">
                <button
                    onClick={() => setActiveTab("general")}
                    className={cn(
                        "px-5 py-3 text-sm font-medium -mb-px border-b-2 transition-colors",
                        activeTab === "general"
                            ? "border-brand-primary-6 text-brand-primary-6"
                            : "border-transparent text-brand-secondary-5 hover:text-brand-secondary-8"
                    )}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab("business")}
                    className={cn(
                        "px-5 py-3 text-sm font-medium -mb-px border-b-2 transition-colors",
                        activeTab === "business"
                            ? "border-brand-primary-6 text-brand-primary-6"
                            : "border-transparent text-brand-secondary-5 hover:text-brand-secondary-8"
                    )}
                >
                    Business Info
                </button>
            </nav>

            {activeTab === "general" && (
                <GeneralInfoForm user={user} />
            )}
            {activeTab === "business" && (
                <BusinessInfoForm user={user} categories={categories} />
            )}
        </main>
    )
}
