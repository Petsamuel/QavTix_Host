"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Icon } from "@iconify/react"
import { useAppSelector } from "@/lib/redux/hooks"
import { useEffect, useState } from "react"
import AuthUserDetailsSkeletonLoader from "../loaders/AuthUserDetailsSkeletonLoader"
import { getInitialsFromName } from "@/helper-fns/getInitialFromName"
import { useLogOut } from "@/custom-hooks/UseLogout"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"

export default function AuthUserDetails() {

    // Use local state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)
    const { handleLogOut, isLoggingOut } = useLogOut()

    const { user } = useAppSelector(store => store.authUser)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || !user) {
        return <AuthUserDetailsSkeletonLoader />
    }

    return (
        user.user_id ? (
            <div className="flex items-center gap-2">
                <div className="relative p-[2px] rounded-full overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-150 shrink-0 size-9">
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7,#ef4444)] animate-[spin_3s_linear_infinite]" />
                    <CustomAvatar id={user.user_id.toString()} name={user.full_name} size="w-full h-full relative z-10 !ring-0" profileImg={user.profile_picture} />
                </div>
                <div className={`shrink w-3/5`}>
                    <p className="truncate capitalize text-[.83rem] font-medium">{user.full_name}</p>
                    <p className="truncate text-[.83rem] font-normal">{user.email}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none focus:ring-2 focus:ring-darkbg-brand-primary-darkRed-400">
                        <Icon icon="radix-icons:caret-sort" width="30" height="30" aria-label="open" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        sideOffset={5}
                        align="start"
                        forceMount
                        className="text-brand-primary-dark_slate z-100 py-3">
                        <DropdownMenuItem className="text-xs capitalize border-b pb-2">
                            <span>{user.full_name}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="cursor-pointer text-brand-secondary-9 text-xs font-medium bg-red-50/50"
                            onSelect={(e) => {
                                e.preventDefault();
                                if (!isLoggingOut) handleLogOut();
                            }}
                        >
                            <div className="flex w-full items-center gap-2 opacity-100" aria-disabled={isLoggingOut}>
                                {isLoggingOut ? (
                                    <Icon icon="eos-icons:three-dots-loading" width="20" height="20" className="text-brand-primary-darkRed" />
                                ) : (
                                    <Icon icon="solar:logout-2-outline" width="40" height="40" aria-hidden="true" className="text-brand-primary-darkRed block" />
                                )}
                                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ) : (
            <AuthUserDetailsSkeletonLoader />
        )
    )
}