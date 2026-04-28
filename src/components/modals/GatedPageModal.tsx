"use client"

import { useRouter } from "next/navigation"
import ContentGatePromptModal, { UPGRADE_PLAN_CONFIG, VERIFICATION_REQUIRED_CONFIG } from "./ContentGatePromptModal"

interface Props {
    type: "verification" | "plan"
    featureName?: string
    requiredPlan?: string
}

export default function GatedPageModal({ type, featureName, requiredPlan }: Props) {
    const router = useRouter()
    
    const config = type === "verification" 
        ? VERIFICATION_REQUIRED_CONFIG 
        : UPGRADE_PLAN_CONFIG(featureName || "", requiredPlan || "Pro")

    return (
        <ContentGatePromptModal 
            open={true} 
            onClose={() => router.back()} 
            config={config} 
        />
    )
}
