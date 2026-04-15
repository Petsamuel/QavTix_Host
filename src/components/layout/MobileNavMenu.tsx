"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAVIGATION_LINKS, SETTINGS_SUB_LINKS } from "@/enums/navigation";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import AuthUserDetails from "./AuthUserDetails";
import { useEffect } from "react";
import NeedHelpButton from "../custom-utils/buttons/NeedHelpButton";

interface MobileNavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNavMenu({ isOpen, onClose }: MobileNavMenuProps) {
    const pathName = usePathname()

    const isSettingsActive = pathName?.startsWith(NAVIGATION_LINKS.SETTINGS.href)

    const isActiveRoute = (route: string) => {
        if (!pathName) return false;

        if (route === "/dashboard") {
            return pathName === "/dashboard";
        }

        return pathName === route || pathName.startsWith(`${route}/`)
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
        } else {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        }
        return () => {
            document.body.style.overflow = "unset";
            document.body.style.paddingRight = "0px";
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-99"
                    />

                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }} 
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed left-0 top-0 h-full w-70 bg-brand-accent-1 z-100 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
                    >
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <Logo width={100} />
                                <button 
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-brand-accent-3/50 text-brand-secondary-9"
                                >
                                    <Icon icon="lineicons:close" className="size-3" />
                                </button>
                            </div>

                            <ul className="flex flex-col gap-3">
                                {Object.values(NAVIGATION_LINKS).map((v) => {
                                    const isActive = isActiveRoute(v.href);
                                    const isSettingsLink = v.href === NAVIGATION_LINKS.SETTINGS.href;

                                    return (
                                        <li key={v.href}>
                                            <Link
                                                href={isSettingsLink ? SETTINGS_SUB_LINKS[0].href : v.href}
                                                onClick={onClose}
                                                className={cn(
                                                    "relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-[13px]",
                                                    isActive || (isSettingsLink && isSettingsActive)
                                                        ? "bg-brand-accent-4 text-white font-bold" 
                                                        : "text-brand-secondary-9 hover:bg-brand-accent-3/50"
                                                )}
                                            >
                                                <Icon icon={v.icon} className="size-5" />
                                                <span>{v.label}</span>
                                                
                                                <Icon 
                                                    icon="basil:caret-right-outline" 
                                                    className={cn(
                                                        "absolute right-3 size-5 transition-transform duration-300",
                                                        (isSettingsLink && isSettingsActive) && "rotate-90",
                                                        (!isSettingsLink && !isActive) && "hidden"
                                                    )} 
                                                />
                                            </Link>

                                            {isSettingsLink && (
                                                <div className={cn(
                                                    "grid transition-all duration-300 ease-in-out overflow-hidden",
                                                    isSettingsActive ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                                                )}>
                                                    <ul className="relative ml-3 flex flex-col min-h-0">
                                                        <div className="absolute left-0 top-0 h-[88%] my-auto bottom-0 w-px bg-brand-neutral-5" />

                                                        {SETTINGS_SUB_LINKS.map((sub) => {
                                                            const isSubActive = pathName === sub.href;
                                                            return (
                                                                <li key={sub.href} className="relative flex items-center">
                                                                    <div className="absolute -left-[3.5px] z-10 size-2 rounded-full border border-brand-secondary-3/50 bg-brand-secondary-2" />
                                                                    <Link
                                                                        href={sub.href}
                                                                        onClick={onClose}
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
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="pt-6 flex flex-col gap-4 border-t border-brand-accent-3/30">
                            <NeedHelpButton />
                            <AuthUserDetails />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}