'use client'

import { useEffect } from 'react'
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { hideAlert } from '@/lib/redux/slices/alertSlice'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const variantStyles = {
  default: 'bg-brand-secondary-6 border-border text-white',
  destructive: 'bg-gray-100 border-destructive/50 text-destructive',
  success: 'bg-green-50 border-green-500/50 text-green-800',
  warning: 'bg-yellow-50 border-yellow-500/50 text-yellow-800',
  info: 'bg-blue-50 border-blue-500/50 text-blue-800',
}

const variantIcons = {
  default: <Info className="size-10 shrink-0" />,
  destructive: <AlertCircle className="size-10 shrink-0" />,
  success: <CheckCircle2 className="size-10 shrink-0" />,
  warning: <AlertTriangle className="size-10 shrink-0" />,
  info: <Info className="size-10 shrink-0" />,
}

export default function CustomGlobalAlert() {

    const dispatch = useAppDispatch()
    const { isOpen, title, description, variant, duration, icon } = useAppSelector(store => store.alert)

    useEffect(() => {
        if (!isOpen || !duration) return

        const timer = setTimeout(() => {
            dispatch(hideAlert())
        }, duration)

        return () => clearTimeout(timer)
    }, [isOpen, duration, dispatch])

    if (!isOpen) return null

    const IconComponent = icon || variantIcons[variant as keyof typeof variantIcons]

    return (
        <div className="fixed top-10 md:top-14 right-2 md:right-10 z-1000 w-fit max-w-xs px-4">
            <Alert
                variant={variant === 'default' ? 'default' : 'destructive'}
                className={cn(
                'border shadow-lg animate-in flex items-center fade-in-0 zoom-in-95 slide-in-from-top-5 duration-300',
                    variantStyles[variant as keyof typeof variantIcons]
                )}
            >
                {IconComponent}
                <div className="flex-1">
                    <AlertTitle className="font-normal!">{title}</AlertTitle>
                    {description && (
                        <AlertDescription className="mt-1 text-xs text-inherit">
                            {description}
                        </AlertDescription>
                    )}
                </div>
            </Alert>
        </div>
    )
}