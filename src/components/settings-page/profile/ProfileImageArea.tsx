"use client"

import { useRef, useState } from "react"
import { Icon } from "@iconify/react"
import Image from "next/image"


interface ProfileImageAreaProps {
    profileImage: string | File | null
    bannerImage: string | File | null
    onProfileChange: (file: File | null) => void
    onBannerChange: (file: File | null) => void
    isEditing: boolean
}

export default function ProfileImageArea({
    profileImage,
    bannerImage,
    onProfileChange,
    onBannerChange,
    isEditing,
}: ProfileImageAreaProps) {
    const profileInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    const [profilePreview, setProfilePreview] = useState<string | null>(() => {
        if (typeof profileImage === "string") return profileImage
        if (profileImage instanceof File) return URL.createObjectURL(profileImage)
        return null
    })

    const [bannerPreview, setBannerPreview] = useState<string | null>(() => {
        if (typeof bannerImage === "string") return bannerImage
        if (bannerImage instanceof File) return URL.createObjectURL(bannerImage)
        return null
    })

    const handleProfileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setProfilePreview(URL.createObjectURL(file))
            onProfileChange(file)
        }
    }

    const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBannerPreview(URL.createObjectURL(file))
            onBannerChange(file)
        }
    }

    return (
        <div className="relative w-full mb-8">
            {/* Banner Area */}
            <div
                className={`relative max-w-full w-[27em] h-48 bg-brand-neutral-5 rounded-xl overflow-hidden group/banner ${isEditing ? "cursor-pointer" : ""}`}
                onClick={() => isEditing && bannerInputRef.current?.click()}
            >
                {bannerPreview ? (
                    <Image
                        src={bannerPreview}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-brand-secondary-4">
                        <span className="mb-20 text-gray-500">Add Account Cover Photo</span>
                    </div>
                )}

                {isEditing && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            bannerInputRef.current?.click()
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-primary-6 text-white p-3.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                        style={{ marginTop: bannerPreview ? '0' : '12px' }}
                    >
                        <Icon icon={bannerPreview ? "hugeicons:pencil-edit-01" : "hugeicons:add-01"} width="27" height="27" />
                    </button>
                )}
            </div>

            {/* Profile Avatar Area */}
            <div className="relative px-6 pb-6 -mt-12 flex items-end">
                <div className="relative size-30 group/avatar">
                    <div
                        className={`relative w-full h-full rounded-full border-4 border-white bg-white overflow-hidden shadow-sm ${isEditing ? "cursor-pointer" : ""}`}
                        onClick={() => isEditing && profileInputRef.current?.click()}
                    >
                        {profilePreview ? (
                            <Image
                                src={profilePreview}
                                alt="Profile Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Icon icon="guidance:image" className="w-14 h-14 text-gray-300" />
                            </div>
                        )}

                        {isEditing && (
                            <div className="absolute inset-0 bg-black/5 group-hover/avatar:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="sr-only">Upload Image</span>
                            </div>
                        )}
                    </div>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                profileInputRef.current?.click()
                            }}
                            className="absolute bottom-1 right-1 bg-brand-primary-6 text-white p-2 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all z-20"
                        >
                            <Icon icon={profilePreview ? "hugeicons:pencil-edit-01" : "hugeicons:add-01"} width="18" height="18" />
                        </button>
                    )}
                </div>
            </div>

            {/* Hidden Inputs */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={profileInputRef}
                onChange={handleProfileSelect}
            />
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={bannerInputRef}
                onChange={handleBannerSelect}
            />
        </div>
    )
}
