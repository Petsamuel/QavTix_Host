"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "@iconify/react/dist/iconify.js"
import Logo from "./Logo"
import { NAVIGATION_LINKS, SETTINGS_SUB_LINKS } from "@/enums/navigation"
import AuthUserDetails from "./AuthUserDetails"
import { cn } from "@/lib/utils"
import SellTicketsCard from "../cards/SellTicketsCard"
import { useAppSelector } from "@/lib/redux/hooks"

function DesktopSideNav() {

    const { user, isAuthenticated } = useAppSelector(store => store.authUser)
    const pathName = usePathname()

    const isSettingsActive = pathName?.startsWith(NAVIGATION_LINKS.SETTINGS.href)

    const isActiveRoute = (route: string) => {
        if (!pathName) return false
        if (route === "/dashboard") return pathName === "/dashboard"
        return pathName === route || pathName.startsWith(`${route}/`)
    }

    return (
        <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-60 flex-col justify-between gap-8 bg-brand-accent-1 p-4 py-6 text-sm font-medium text-brand-primary-dark_slate overflow-y-auto">
            <div>
                <Logo width={120} />
                <ul className="mt-5 flex flex-col gap-4">
                    {Object.values(NAVIGATION_LINKS).map((v) => {
                        const isActive = isActiveRoute(v.href)
                        const isSettingsLink = v.href === NAVIGATION_LINKS.SETTINGS.href

                        return (
                            <li key={v.href} className="flex flex-col">
                                <Link
                                    className={cn(
                                        isActive || (isSettingsLink && isSettingsActive)
                                            ? "bg-brand-accent-4 text-white font-medium"
                                            : "hover:bg-brand-accent-3 text-brand-secondary-9 font-normal",
                                        "relative flex items-center gap-2 text-sm pe-3 min-h-12 ps-2 py-2 rounded-md transition-all ease-linear duration-200"
                                    )}
                                    href={isSettingsLink ? SETTINGS_SUB_LINKS[0].href : v.href}
                                >
                                    <Icon icon={v.icon} width="20" height="20" />
                                    <span>{v.label}</span>
                                    {(isActive || (isSettingsLink && isSettingsActive)) && (
                                        <Icon
                                            icon="basil:caret-right-outline"
                                            width="26"
                                            height="26"
                                            className={cn(
                                                "absolute top-0 bottom-0 my-auto -right-1 transition-transform duration-200",
                                                isSettingsLink && isSettingsActive && "rotate-90"
                                            )}
                                        />
                                    )}
                                </Link>

                                {/* Settings sub-links dropdown */}
                                {isSettingsLink && (
                                    <div className={cn(
                                        "grid transition-all duration-300 ease-in-out overflow-hidden",
                                        isSettingsActive ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                                    )}>
                                        <div className="relative ml-3 flex flex-col min-h-0">
                                            <div className="absolute left-0 top-0 h-[88%] my-auto bottom-0 w-px bg-brand-neutral-5" />
                                            <ul className="flex flex-col w-full">
                                                {SETTINGS_SUB_LINKS.map((sub) => {
                                                    const isSubActive = pathName === sub.href
                                                    return (
                                                        <li key={sub.href} className="relative flex items-center">
                                                            <div className="absolute -left-[3.5px] z-10 size-2 rounded-full border border-brand-secondary-3/50 bg-brand-secondary-2" />
                                                            <Link
                                                                href={sub.href}
                                                                prefetch={false}
                                                                className={cn(
                                                                    "flex-1 py-3 ml-3 pl-3 text-[13px] transition-colors",
                                                                    isSubActive
                                                                        ? "text-brand-accent-4 bg-brand-accent-3/30 font-semibold rounded-md"
                                                                        : "text-brand-secondary-7 hover:text-brand-accent-4"
                                                                )}
                                                            >
                                                                {sub.label}
                                                            </Link>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
            {
                isAuthenticated && user?.can_activate_free_trial &&
                <div className="mt-7 mb-2">
                    <SellTicketsCard />
                </div>
            }
            <AuthUserDetails />
        </nav>
    )
}

export default DesktopSideNav