'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedDialogProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: string
  children: React.ReactNode
  className?: string
  childrenContainerStyles?: string
  showCloseButton?: boolean
}

export function AnimatedDialog({
  open,
  onOpenChange,
  trigger,
  title,
  children,
  childrenContainerStyles = "px-6",
  showCloseButton = true,
  className = ''
}: AnimatedDialogProps) {


  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60",
            // Open
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300 data-[state=open]:ease-out",
            // Close
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200 data-[state=closed]:ease-in",
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90%] sm:max-w-125 max-h-[95vh] bg-white rounded-4xl shadow-2xl border-0 outline-transparent outline-none! ring-0 overflow-hidden flex flex-col",
            // Open animation
            "data-[state=open]:animate-in",
            "data-[state=open]:fade-in-0",
            "data-[state=open]:duration-900 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
            "data-[state=open]:zoom-in-[0.75]",
            "data-[state=open]:slide-in-from-bottom-10",
            // Close animation
            "data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0",
            "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
            "data-[state=closed]:zoom-out-[0.75]",
            "data-[state=closed]:slide-out-to-bottom-8",
            className
          )}
        >
          {title && (
            <DialogPrimitive.Title className="px-6 pt-6 text-xl font-semibold shrink-0">
              {title}
            </DialogPrimitive.Title>
          )}

          <div className={cn("py-6 overflow-y-auto flex-1", childrenContainerStyles)}>{children}</div>

          {
            showCloseButton &&
            <DialogPrimitive.Close className="fixed right-4 top-4 rounded-full p-2 hover:bg-brand-neutral-3 transition-colors z-10 bg-white/80 backdrop-blur-sm">
              <X className="h-5 w-5 text-brand-neutral-7" />
            </DialogPrimitive.Close>
          }
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}