'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils'

interface AnimatedDialogFormPromptProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function AnimatedDialogForPrompt({
  open,
  onOpenChange,
  children,
}: AnimatedDialogFormPromptProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Overlay - smooth fade only (no blur on mobile) */}
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 bg-black/50 z-200",
            // Open
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:duration-300 data-[state=open]:ease-out",
            // Close
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:duration-200 data-[state=closed]:ease-in",
          )}
        />

        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90%] md:max-w-125 bg-white rounded-4xl shadow-2xl outline-none",
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
            "z-200 w-102.5 max-h-[80vh] p-6 md:p-8 rounded-[2.5em] overflow-auto flex flex-col"
          )}
        >
            {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}