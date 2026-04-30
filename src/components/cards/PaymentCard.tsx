"use client"

import { useIsMounted } from "@/custom-hooks/UseIsMounted"
import { space_grotesk } from "@/lib/fonts"
import { useAppSelector } from "@/lib/redux/hooks"
import { cn } from "@/lib/utils"
import Image from "next/image"

const BRAND_LOGO: Record<string, string> = {
    visa: "/images/vectors/visa.svg",
    mastercard: "/images/vectors/mastercard.svg",
    verve: "/images/vectors/verve.svg",
    amex: "/images/vectors/amex.svg",
    discover: "/images/vectors/discover.svg",
}

const getBrandLogo = (brand: string): string | null =>
    BRAND_LOGO[brand.toLowerCase().trim()] ?? null

interface Props {
    method: PaymentMethod
    variant?: "default" | "other"
    className?: string
}

export default function PaymentCard({ method, variant = "default", className }: Props) {

    const isDefault = variant === "default"
    const logo = getBrandLogo(method.brand)
    const expiry = `${String(method.exp_month).padStart(2, "0")}/${method.exp_year}`
    const { user } = useAppSelector(store => store.authUser)
    const isMounted = useIsMounted()


    return (
        isMounted &&
        <div className={cn("max-w-77.5 sm:w-77.5 shrink-0", className)}>
            <div className="relative w-full rounded-2xl overflow-hidden select-none aspect-16/10">

                {isDefault ? (
                    <div className="absolute inset-0 bg-linear-to-br from-[#f5633f] via-[#FF8C5A] to-[#F79E1B]" />
                ) : (
                    <div className="absolute inset-0 bg-linear-to-br from-[#C8C8C8] via-[#D8D8D8] to-[#E8E8E8]" />
                )}

                <div className={cn(
                    "absolute rounded-full border-[1.5px] pointer-events-none",
                    isDefault ? "border-white/40" : "border-white/45",
                )}
                    style={{
                        width: "190px",
                        height: "190px",
                        top: "-90px",
                        right: "-60px",
                    }}
                />
                <div className={cn(
                    "absolute rounded-full border-[1.5px] pointer-events-none",
                    isDefault ? "border-white/30" : "border-white/25",
                )}
                    style={{
                        width: "150px",
                        height: "150px",
                        top: "-80px",
                        right: "-50px",
                    }}
                />

                <div className="relative h-full flex flex-col justify-between p-5">

                    {/* Top — brand logo + chip */}
                    <div className="flex items-start justify-between">
                        <div className="h-8 w-20 flex items-center">
                            {logo ? (
                                <Image
                                    src={logo}
                                    alt={method.brand}
                                    width={56}
                                    height={32}
                                    className="h-auto w-14"
                                />
                            ) : (
                                <span className={cn(
                                    "text-xs font-bold uppercase tracking-wider",
                                    isDefault ? "text-white" : "text-white/70"
                                )}>
                                    {method.brand}
                                </span>
                            )}
                        </div>
                        <Image
                            src="/images/vectors/card-chip.svg"
                            width={40}
                            height={30}
                            alt=""
                            aria-hidden="true"
                        />
                    </div>

                    {/* Card number */}
                    <div className={cn(
                        space_grotesk.className,
                        "flex items-center gap-3 font-bold text-xl tracking-widest",
                        isDefault ? "text-white" : "text-white/80"
                    )}>
                        <span>****</span>
                        <span>****</span>
                        <span>****</span>
                        <span>{method.last4}</span>
                    </div>

                    {/* Bottom — cardholder + expiry */}
                    <div className="flex items-end justify-between">
                        <div>
                            <p className={cn(
                                "text-[10px] uppercase tracking-widest mb-0.5",
                                isDefault ? "text-white/70" : "text-white/50"
                            )}>
                                Card Holder
                            </p>
                            <p className={cn(
                                "font-bold text-sm capitalize truncate max-w-[14ch]",
                                isDefault ? "text-white" : "text-white/80"
                            )}>
                                {user?.full_name ?? "—"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className={cn(
                                "text-[10px] uppercase tracking-widest mb-0.5",
                                isDefault ? "text-white/70" : "text-white/50"
                            )}>
                                Valid Till
                            </p>
                            <p className={cn(
                                "font-bold text-sm",
                                isDefault ? "text-white" : "text-white/80"
                            )}>
                                {expiry}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}