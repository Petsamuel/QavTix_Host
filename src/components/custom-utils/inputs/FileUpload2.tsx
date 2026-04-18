import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import Image from "next/image"
import { useRef, useState } from "react"

interface AdditionalImagesUploadProps {
    value?: (File | string)[]
    onChange: (files: File[]) => void
    maxImages?: number
    error?: string
    accept?: string
    maxSize?: number // in MB
    className?: string
}

export default function AdditionalImagesUpload({
    value = [],
    onChange,
    maxImages = 5,
    error,
    accept = 'image/jpeg,image/png,image/webp',
    maxSize = 5,
    className
}: AdditionalImagesUploadProps) {


    const [previews, setPreviews] = useState<string[]>(() => {
        return value.map(item => 
            typeof item === 'string' ? item : URL.createObjectURL(item) 
        )
    })
    const [files, setFiles] = useState<File[]>(() => {
        return value.filter((item): item is File => item instanceof File)
    })
    const inputRef = useRef<HTMLInputElement>(null)

    const canAddMore = previews.length < maxImages

    const handleFiles = (newFiles: FileList) => {
        const filesArray = Array.from(newFiles)
        const remainingSlots = maxImages - previews.length
        const filesToAdd = filesArray.slice(0, remainingSlots)

        // Validate files
        const validFiles = filesToAdd.filter(file => {
            if (file.size > maxSize * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max size: ${maxSize}MB`)
                return false
            }
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} is not an image`)
                return false
            }
            return true
        })

        if (validFiles.length === 0) return

        // Create previews
        const newPreviews = validFiles.map(file => URL.createObjectURL(file))
        const updatedPreviews = [...previews, ...newPreviews]
        const updatedFiles = [...files, ...validFiles]

        setPreviews(updatedPreviews)
        setFiles(updatedFiles)
        onChange(updatedFiles)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files)
        }
    }

    const handleRemove = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index)
        const updatedFiles = files.filter((_, i) => i !== index)
        
        setPreviews(updatedPreviews)
        setFiles(updatedFiles)
        onChange(updatedFiles)

        if (inputRef.current) {
            inputRef.current.value = ''
        }
    }

    return (
        <div className={cn('w-full', className)}>
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={!canAddMore}
                className={cn(
                    'w-full h-14 rounded-[6px] border-[1.4px] border-dashed transition-all text-sm',
                    canAddMore
                        ? 'border-brand-secondary-5 bg-transparent hover:border-brand-neutral-5 hover:bg-neutral-2 text-brand-secondary-5'
                        : 'border-brand-secondary-5 bg-brand-neutral-3 text-brand-neutral-5 cursor-not-allowed opacity-60'
                )}
            >
                <span className="flex items-center text-sm justify-center gap-2">
                    <Icon icon="lucide:plus" className="w-4 h-4" />
                    Add more images {!canAddMore && `(Max ${maxImages})`}
                </span>
            </button>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                multiple
                onChange={handleChange}
                className="hidden"
                disabled={!canAddMore}
            />

            {/* Image Previews */}
            {previews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {previews.map((preview, index) => (
                        <div
                            key={index}
                            className="relative size-20 rounded-lg overflow-hidden border-2 border-brand-neutral-3 bg-neutral-1 group"
                        >
                            <Image
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <Icon icon="lucide:trash-2" className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>
            )}
        </div>
    )
}
