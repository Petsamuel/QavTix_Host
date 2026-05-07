import Image from "next/image"

export default function Loading() {
    return (
        <div
            aria-label="Loading"
            aria-live="polite"
            className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden"
        >
            {/* Frosted backdrop */}
            <div className="absolute inset-0 bg-gray-100/20 backdrop-blur-xs" />

            {/* Spinner */}
            <div className="relative z-10">
                <Image
                    src="/images/vectors/Interwind@1x-1.1s-493px-493px.svg"
                    alt="Loading..."
                    width={220}
                    height={220}
                    priority
                />
            </div>
        </div>
    )
}