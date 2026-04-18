import { Icon } from "@iconify/react"

export default function UpcomingEventsError() {
    return (
        <div className="rounded-2xl w-full h-60 bg-white border border-brand-neutral-2 flex flex-col items-center justify-center gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Icon icon="hugeicons:alert-02" className="w-6 h-6 text-red-400" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-brand-secondary-8">Failed to load events</p>
                <p className="text-xs text-brand-neutral-6">
                    We couldn't fetch your upcoming events. Please refresh the page.
                </p>
            </div>
        </div>
    )
}