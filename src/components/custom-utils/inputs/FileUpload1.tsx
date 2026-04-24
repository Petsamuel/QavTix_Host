'use client'

import { useRef, useState } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// ============================================
// FEATURED IMAGE UPLOAD (Single Image)
// ============================================

interface FeaturedImageUploadProps {
    value?: File | string | null
    onChange: (file: File | null) => void
    error?: string
    accept?: string
    maxSize?: number // in MB
    className?: string
}

export function FeaturedImageUpload({
    value,
    onChange,
    error,
    accept = 'image/jpeg,image/png,image/webp',
    maxSize = 5,
    className
}: FeaturedImageUploadProps) {

    console.log(value)
    
    const [preview, setPreview] = useState<string | null>(() => {
        if (typeof value === 'string') return value
        if (value instanceof File) return URL.createObjectURL(value)
        return null
    })
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = (file: File) => {
        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size must be less than ${maxSize}MB`)
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => {
            setPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)

        onChange(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleRemove = () => {
        setPreview(null)
        onChange(null)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className={cn('w-full', className)}>
            {preview ? (
                // Image Preview
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-brand-neutral-3 bg-neutral-1">
                    <Image
                        src={preview}
                        alt="Featured preview"
                        fill
                        className="object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-lg"
                    >
                        <Icon icon="lucide:x" className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                // Upload Area
                <div
                    onDragOver={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        'w-full aspect-video rounded-xl h-27 border-[1.5px] border-dashed transition-all cursor-pointer',
                        'flex flex-col items-center justify-center gap-3',
                        isDragging 
                            ? 'border-brand-primary-5 bg-brand-primary-1' 
                            : 'border-brand-secondary-5 bg-white hover:border-brand-neutral-5 hover:bg-brand-neutral-2',
                        error && 'border-red-400'
                    )}
                >
                    <Icon 
                        icon="iconoir:cloud-upload" 
                        className={cn(
                            'size-7',
                            isDragging ? 'text-brand-primary-6' : 'text-brand-secondary-5'
                        )} 
                    />
                    <div className="text-center px-4 text-brand-secondary-5 text-xs">
                        <p className="font-medium">
                            Click or drag file to this area to upload
                        </p>
                        <p className="mt-1 text-brand-secondary-4">
                            Max size: {maxSize}MB • JPEG, PNG, WEBP
                        </p>
                    </div>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        className="hidden"
                    />
                </div>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>
            )}
        </div>
    )
}