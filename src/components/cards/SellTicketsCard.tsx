import { Icon } from "@iconify/react";

export default function SellTicketsCard() {
    return (
        <div className="max-w-full w-full rounded-2xl bg-brand-accent-2 py-4 px-3 flex flex-col gap-4">

            <div className="flex items-center gap-3">
                <div className="size-7 rounded-full bg-brand-accent-8 flex items-center justify-center shrink-0">
                    <Icon icon="uis:chart" width="16" height="16" className="text-white" />
                </div>
                <p className="text-sm font-medium text-brand-neutral-10">
                    Sell Tickets Smarter
                </p>
            </div>

            <p className="text-xs text-brand-neutral-8">
                Everything you need to manage and grow your events -{" "}
                <strong className="font-bold">Free for 14 days</strong>
            </p>

            <button className="w-full rounded-lg bg-brand-accent-4 hover:bg-brand-accent-5 active:scale-[0.98] transition-all duration-150 py-3 text-white text-sm font-semibold">
                Get Started for Free
            </button>

        </div>
    )
}