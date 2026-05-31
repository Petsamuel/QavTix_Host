// This shell exactly mirrors ActivityNotificationModal's tab header
// so there is zero layout shift between loading and populated state.
export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
                {/* Tabs — matches ActivityNotificationModal */}
                <div className="border-b border-brand-neutral-3 relative flex items-center">
                    <div className="flex flex-1">
                        <div className="flex-1 px-6 py-4 text-sm font-bold text-brand-primary-6 text-center relative">
                            Recent Activity
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary-6" />
                        </div>
                        <div className="flex-1 px-6 py-4 text-sm font-bold text-brand-neutral-6 text-center">
                            Notifications
                        </div>
                    </div>
                    {/* Ghost close button */}
                    <div className="absolute right-4 p-1.5 rounded-full bg-brand-neutral-2 opacity-40">
                        <div className="size-5" />
                    </div>
                </div>

                {/* Spinner body */}
                <div className="flex items-center justify-center py-20">
                    <svg
                        className="size-8 animate-spin text-brand-primary-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3V0a12 12 0 00-12 12h4z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}
