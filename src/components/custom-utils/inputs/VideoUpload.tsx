'use client'

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface VideoUploadProps {
    value?: File | string | null
    onChange: (file: File | null) => void
    error?: string
    accept?: string
    maxSize?: number // in MB
    className?: string
}

export function VideoUpload({
    value,
    onChange,
    error,
    accept = 'video/mp4,video/x-m4v,video/*',
    maxSize = 30, // Per design: Max 30MB
    className
}: VideoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [fileName, setFileName] = useState<string | null>(() => {
        if (typeof value === 'string') return value.split('/').pop() || null
        if (value instanceof File) return value.name
        return null
    })

    const handleFile = (file: File) => {
        if (file.size > maxSize * 1024 * 1024) {
            alert(`Video size must be less than ${maxSize}MB`)
            return
        }

        setFileName(file.name)
        onChange(file)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering the file input if you ever wrap the container
        setFileName(null)
        onChange(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className={cn('w-full space-y-2', className)}>
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white drop-shadow-xs border border-neutral-100 rounded-lg">
                
                {/* Video Icon / Remove Area */}
                <div className="relative group">
                    <div className={cn(
                        fileName ? "bg-brand-primary-1 border border-brand-primary-3" : "bg-brand-neutral-3",
                        "shrink-0 size-20 rounded flex items-center justify-center text-brand-secondary-5 transition-colors"
                    )}>
                        <Icon icon={fileName ? "lucide:video" : "guidance:image"} className="size-9" />
                    </div>

                    {/* Remove Overlay Button */}
                    {fileName && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 size-5 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-transform active:scale-90"
                            title="Remove video"
                        >
                            <Icon icon="lucide:x" className="size-3" />
                        </button>
                    )}
                </div>

                {/* Controls and Info */}
                <div className="flex-1 flex flex-col items-center sm:items-start gap-3">
                    <p className="text-[11px] leading-tight text-brand-secondary-4 text-center sm:text-left">
                        MP4, MOV, WMV, AVI, and/or MKV. Max {maxSize}MB
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full justify-center sm:justify-start">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2.5 border border-brand-primary-6 text-brand-primary-6 rounded-sm text-xs font-medium hover:bg-brand-primary-1 transition-colors bg-white whitespace-nowrap"
                        >
                            {fileName ? "Change File" : "Choose File"}
                        </button>
                        
                        <span className="text-xs text-brand-secondary-5 truncate max-w-45">
                            {fileName || "No File Chosen"}
                        </span>
                    </div>
                </div>

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleChange}
                    className="hidden"
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 ml-1">{error}</p>
            )}
        </div>
    )
}