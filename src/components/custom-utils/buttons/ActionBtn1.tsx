import { Icon } from "@iconify/react"
import Image from "next/image"
import { ButtonHTMLAttributes } from "react"

interface IActionButton1Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?:   string
    buttonText:   string
    isLoading?:   boolean
    isDisabled?:  boolean
    action?:      () => void
    buttonType?:  "button" | "submit"
    icon?:        string
    iconPosition?: "left" | "right"
}

export default function ActionButton1({
    className    = "",
    buttonText,
    isLoading,
    isDisabled,
    action,
    buttonType   = "button",
    icon,
    iconPosition = "left",
    ...rest
}: IActionButton1Props) {

    const isButtonDisabled = isLoading === true || isDisabled === true

    return (
        <button
            {...rest} 
            type={buttonType}
            disabled={isButtonDisabled}
            onClick={action}
            className={`
                text-sm
                md:text-base
                bg-brand-primary
                hover:bg-brand-primary-7
                active:bg-brand-primary-8
                disabled:bg-brand-primary-5
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                py-3.5
                px-6
                rounded-[3em]
                h-14
                font-medium
                transition-colors
                inline-flex
                items-center
                justify-center
                gap-2
                ${className}
            `}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <Image src="/images/vectors/Interwind@1x-1.0s-259px-259px.svg" priority alt="loading" width={80} height={80} />
                </span>
            ) : (
                <>
                    {icon && iconPosition === "left" && (
                        <Icon icon={icon} width="18" height="18" className="size-5" />
                    )}
                    <span>{buttonText}</span>
                    {icon && iconPosition === "right" && (
                        <Icon icon={icon} width="18" height="18" className="size-5" />
                    )}
                </>
            )}
        </button>
    )
}