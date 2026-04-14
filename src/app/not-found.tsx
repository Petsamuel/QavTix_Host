'use client'

import { EXPLORE_EVENT_LINK } from "@/enums/navigation"
import { space_grotesk } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export default function NotFoundPage() {
    return (
        <main
            className="fixed inset-0 z-1000 flex flex-col items-center justify-center px-6 bg-white overflow-hidden"
            aria-labelledby="not-found-title"
        >
            {/* Optional subtle overlay to block everything behind */}
            <div className="absolute inset-0 bg-white/95 z-[-1]" />

            <div
                className="w-full max-w-sm sm:max-w-md md:max-w-lg animate-fade-in"
                aria-hidden="true"
            >
                <Image
                    src="/images/vectors/404.svg"
                    alt="404 — page not found illustration"
                    width={560}
                    height={180}
                    priority
                    className="w-full h-auto select-none"
                />
            </div>

            <div className="mt-6 text-center animate-slide-up">
                <h1
                    id="not-found-title"
                    className={cn(
                        space_grotesk.className,
                        "text-2xl sm:text-3xl font-bold text-brand-secondary-9 tracking-tight"
                    )}
                >
                    Oops, page not found!
                </h1>
                <p className="mt-3 text-sm sm:text-base text-neutral-7 max-w-lg mx-auto leading-relaxed">
                    The page you are looking for does not exist — it might have been
                    removed, had its name changed, or is temporarily unavailable.
                </p>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-slide-up animation-delay-100">
                <Link
                    href="/"
                    className="
                        group relative inline-flex items-center justify-center
                        px-6 py-4 rounded-full border border-brand-secondary-6 text-brand-secondary-8
                        text-sm font-medium overflow-hidden
                        transition-colors duration-200
                        hover:bg-brand-secondary-9 hover:text-white
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary-9 focus-visible:ring-offset-2
                        active:scale-[0.97]
                    "
                    aria-label="Go to homepage"
                >
                    <span className="relative z-10">Go to Dashboard</span>
                </Link>

                <Link
                    href={EXPLORE_EVENT_LINK}
                    className="
                        inline-flex items-center justify-center
                        px-8 py-4 rounded-full bg-brand-primary text-white
                        text-sm font-medium
                        transition-all duration-200
                        hover:bg-brand-primary-7 hover:shadow-lg hover:shadow-brand-primary/25
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2
                        active:scale-[0.97]
                    "
                    aria-label="Browse all events"
                >
                    Browse Events
                </Link>
            </div>
        </main>
    )
}