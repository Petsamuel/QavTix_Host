import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "@/helper-fns/getAvatarColor";
import { getInitialsFromName } from "@/helper-fns/getInitialFromName";
import { cn } from "@/lib/utils";


function CustomAvatar({ profileImg, name, id, size }: { profileImg?: string | null; name: string; id: string, size: string }) {
    return (
        <Avatar className={cn(size, "ring-4 ring-brand-neutral-2")}>
            {profileImg ? (
                <AvatarImage src={profileImg} className="object-cover" />
            ) : null}
            <AvatarFallback className={`${getAvatarColor(id)} text-white text-xl font-semibold`}>
                {getInitialsFromName(name)}
            </AvatarFallback>
        </Avatar>
    )
}

export default CustomAvatar;