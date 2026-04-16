"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"
import NeedHelpButton from "../custom-utils/buttons/NeedHelpButton"

export default function AuthUserDetailsWithActiveStatus(){

    const { user  } = useAppSelector(store => store.authUser)
  
    return (
        <div className="flex items-center gap-2">
            <NeedHelpButton />
            <div className="relative w-fit">
                <CustomAvatar id={user?.user_id.toString() || "" } profileImg={user?.profile_picture} name={user?.full_name || ""} size="size-9 ring-brand-accent-2!" />

                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white animate-ping" />
                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500" />
            </div>
        </div>
    )
}