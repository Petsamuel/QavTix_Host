"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import PrivacyPanel from "../settings-page/PrivacyPanel"
import PaymentMethodsPanel from "../settings-page/PaymentMethodPanel"

type Tab = "privacy" | "payment"

interface Props {
    initialPrivacySettings: PrivacySettings
    initialPaymentMethods:  PaymentMethod[]
}

export default function AccountSettingsContentWrapper({ initialPrivacySettings, initialPaymentMethods }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>("privacy")

    return (
        <main className="w-full pt-8 pb-16">
            <nav className="flex border-b border-brand-secondary-2 mb-10">
                {(["privacy", "payment"] as Tab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-5 py-3 text-sm capitalize -mb-px border-b-2 transition-colors",
                            activeTab === tab
                                ? "border-brand-primary-6 text-brand-primary-6 font-semibold"
                                : "border-transparent text-brand-secondary-5 hover:text-brand-secondary-8"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            {activeTab === "privacy" && (
                <PrivacyPanel initialSettings={initialPrivacySettings} />
            )}
            {activeTab === "payment" && (
                <PaymentMethodsPanel initialMethods={initialPaymentMethods} />
            )}
        </main>
    )
}