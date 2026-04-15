import { FAQ_PAGE } from "@/enums/navigation"
import Link from "next/link"

interface NeedHelpButtonProps {
    className?: string
}

export default function NeedHelpButton({ className }: NeedHelpButtonProps) {
    return (
        <div className={`flex items-center gap-6 me-6 ${className ?? ""}`}>
            <Link
                href={FAQ_PAGE}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Need help? Visit our FAQ page"
                className="flex flex-col gap-0.5 group"
            >
                <span className="text-sm text-[#585562] leading-tight group-hover:text-brand-primary-6 transition-colors">
                    Need Help?
                </span>
            </Link>
            <span className="h-8 w-px bg-[#585562]"></span>
        </div>
    )
}