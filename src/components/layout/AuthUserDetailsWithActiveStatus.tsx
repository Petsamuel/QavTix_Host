"use client"

import { useAppSelector } from "@/lib/redux/hooks"
import { useEffect, useState } from "react"
import CustomAvatar from "../custom-utils/avatars/CustomAvatar"

export default function AuthUserDetailsWithActiveStatus(){
    
    // Use local state to prevent hydration mismatch
    const [isMounted, setIsMounted] = useState(false)
    
    const { user  } = useAppSelector(store => store.authUser)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])
  
    return (
        isMounted && user &&
        <div className="flex items-center gap-2">
            <div className="relative w-fit">
                <CustomAvatar id={user.user_id.toString()} name={user.full_name} size="size-8" profileImg={user?.profile_picture} />

                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white animate-ping" />
                <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500" />
            </div>
        </div>
    )
}