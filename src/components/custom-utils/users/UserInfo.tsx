import { cn } from "@/lib/utils";
import CustomAvatar from "../avatars/CustomAvatar";

interface UserInfoProps {
    user: {
        id: string | number;
        name: string;
        email: string;
        profile_picture?: string;
    };
    variant?: "desktop" | "mobile";
    className?: string;
}

export default function UserInfo({
    user,
    variant = "desktop",
    className,
}: UserInfoProps) {


    const isDesktop = variant === "desktop";

    return (
        <div
            className={cn(
                "flex items-center gap-3",
                isDesktop ? "min-w-max" : "",
                className
            )}
        >
            <CustomAvatar
                name={user.name}
                id={user.id as string}
                profileImg={user.profile_picture}
                size={isDesktop ? "size-9 shrink-0" : "size-8"}
            />

            <div className={cn(isDesktop ? "whitespace-nowrap" : "flex-1 min-w-0")}>
                <p
                    className={cn(
                        "text-brand-secondary-9 text-xs",
                    )}
                >
                    {user.name}
                </p>
                <p
                    className={cn(
                        "text-[11px] text-brand-secondary-9 font-bold",
                        isDesktop
                            ? ""
                            : " truncate"
                    )}
                >
                    {user.email}
                </p>
            </div>
        </div>
    )
}