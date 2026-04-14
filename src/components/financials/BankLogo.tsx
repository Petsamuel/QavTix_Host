"use client"

import { Icon } from "@iconify/react"
import Image from "next/image"
import { useState } from "react"
import {
    getBrandFetchLogoUrl,
    getBankConvLogoUrl,
    getNigerianBankLogoUrl,
} from "@/helper-fns/bankLogos"

const BankLogo = ({ bankName }: { bankName: string }) => {
    const sources = [
        getBrandFetchLogoUrl(bankName),     // 1. Brandfetch
        getBankConvLogoUrl(bankName),       // 2. BankConv
        getNigerianBankLogoUrl(bankName),   // 3. Nigerian Bank Logos
    ].filter(Boolean) as string[]

    const [index,    setIndex]    = useState(0)
    const [hasError, setHasError] = useState(false)

    const handleError = () => {
        if (index < sources.length - 1) {
            setIndex(prev => prev + 1)
        } else {
            setHasError(true)
        }
    }

    if (sources.length === 0 || hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-brand-neutral-2">
                <Icon icon="ph:bank-fill" className="size-5 text-brand-neutral-7" />
            </div>
        )
    }

    return (
        <Image
            key={sources[index]}
            src={sources[index]}
            width={40}
            height={40}
            alt={bankName}
            className="object-contain rounded-sm w-full h-full"
            onError={handleError}
            unoptimized
        />
    )
}

export default BankLogo