"use client"

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import QRScannerDialog from "./QRScannerDialog"
import { scanCheckIn } from "@/actions/checkin"
import { formatDateTime } from "@/helper-fns/date-utils"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"

type ScanState = "idle" | "scanning" | "success" | "duplicate" | "invalid" | "error"

const SCAN_STATE_CONFIG: Record<string, {
    borderColor: string
    bgColor:     string
    icon:        string
    iconColor:   string
    label:       string
}> = {
    success:   { borderColor: "border-green-500",        bgColor: "bg-green-50/50",   icon: "lucide:check-circle-2",  iconColor: "text-green-600",       label: "Checked In"    },
    duplicate: { borderColor: "border-amber-400",         bgColor: "bg-amber-50/50",   icon: "lucide:alert-circle",    iconColor: "text-amber-500",       label: "Already Used"  },
    invalid:   { borderColor: "border-red-400",           bgColor: "bg-red-50/50",     icon: "lucide:x-circle",        iconColor: "text-red-500",         label: "Invalid Ticket"},
    error:     { borderColor: "border-red-400",           bgColor: "bg-red-50/50",     icon: "lucide:wifi-off",        iconColor: "text-red-400",         label: "Error"         },
    scanning:  { borderColor: "border-brand-primary-6",  bgColor: "bg-brand-primary-1/40", icon: "svg-spinners:ring-resize", iconColor: "text-brand-primary-6", label: "Processing..." },
    idle:      { borderColor: "border-neutral-300",       bgColor: "bg-white",         icon: "",                       iconColor: "",                     label: ""              },
}

export default function SystemCheckInScanCodeInputArea() {

    const [token,          setToken]          = useState("")
    const [scanState,      setScanState]      = useState<ScanState>("idle")
    const [scanResult,     setScanResult]     = useState<ScanResult | null>(null)
    const [showScanner,    setShowScanner]    = useState(false)

    const stateConfig = SCAN_STATE_CONFIG[scanState]

    const { trigger } = useRevalidate("checkin")

    const processToken = async (t: string) => {
        if (!t.trim()) return

        setScanState("scanning")
        setScanResult(null)

        const result = await scanCheckIn(t.trim())

        if (!result.success) {
            setScanState("error")
            return
        }

        const data = result.data!
        setScanResult(data)

        if (data.status === "checked_in") {
            setScanState("success")
            trigger()
        } 
        if (data.status === "duplicate")   setScanState("duplicate")
        if (data.status === "invalid")     setScanState("invalid")
    }

    const handleSearch = () => processToken(token)

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch()
    }

    const handleScanSuccess = (decoded: string) => {
        setToken(decoded)
        setShowScanner(false)
        processToken(decoded)
    }

    const handleClear = () => {
        setToken("")
        setScanState("idle")
        setScanResult(null)
    }

    const isProcessing = scanState === "scanning"

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
            <div className={cn(
                "relative rounded-2xl p-8 border-[1.5px] border-dashed transition-all duration-500",
                stateConfig.bgColor,
                stateConfig.borderColor,
            )}>

                {/* Processing shimmer */}
                {isProcessing && (
                    <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-brand-primary-2/30 to-transparent animate-[shimmer_1.5s_infinite]"
                            style={{ backgroundSize: "200% 100%" }}
                        />
                    </div>
                )}

                <style>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>

                <div className="relative z-10">

                    {/* Search input */}
                    <div className="mb-6 max-w-lg mx-auto">
                        <div className="relative flex items-center gap-2">
                            <div className="relative flex-1">
                                <Icon icon="mage:search" className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={token}
                                    onChange={e => setToken(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Paste or scan ticket token..."
                                    disabled={isProcessing}
                                    className={cn(
                                        "w-full h-14 pl-12 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400",
                                        "bg-neutral-100 border-[1.5px] border-neutral-200 rounded-xl outline-none",
                                        "transition-all duration-300 hover:border-neutral-300",
                                        "focus:bg-white focus:border-brand-primary-5",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        token && "font-mono text-xs"
                                    )}
                                />
                            </div>

                            {/* Clear button */}
                            {(token || scanResult) && !isProcessing && (
                                <button
                                    onClick={handleClear}
                                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group shrink-0"
                                    title="Clear"
                                >
                                    <Icon icon="lucide:x" className="w-5 h-5 text-brand-neutral-6 group-hover:text-red-500" />
                                </button>
                            )}

                            {/* Search button */}
                            {token && !isProcessing && (
                                <button
                                    onClick={handleSearch}
                                    className="px-4 py-3 bg-brand-primary-6 text-white rounded-xl text-sm font-medium hover:bg-brand-primary-7 transition-colors shrink-0"
                                >
                                    <Icon icon="mage:search" className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Truncated token display */}
                        {token && (
                            <p className="mt-2 text-[11px] text-brand-secondary-6 text-center font-mono truncate px-2">
                                {token.length > 40
                                    ? `${token.slice(0, 20)}...${token.slice(-10)}`
                                    : token
                                }
                            </p>
                        )}
                    </div>

                    {/* Scan result */}
                    {scanResult && scanState !== "scanning" && (
                        <div className={cn(
                            "max-w-lg mx-auto mb-8 rounded-xl p-4 border",
                            scanState === "success"   && "bg-green-50 border-green-200",
                            scanState === "duplicate" && "bg-amber-50 border-amber-200",
                            scanState === "invalid"   && "bg-red-50 border-red-200",
                        )}>
                            <div className="flex items-start gap-3">
                                <Icon icon={stateConfig.icon} className={cn("w-5 h-5 shrink-0 mt-0.5", stateConfig.iconColor)} />
                                <div className="flex-1 min-w-0">
                                    <p className={cn("text-sm font-semibold mb-1", stateConfig.iconColor)}>
                                        {stateConfig.label}
                                    </p>
                                    <p className="text-xs text-brand-secondary-8 font-semibold">{scanResult.full_name}</p>
                                    <p className="text-[11px] text-brand-secondary-6">{scanResult.ticket_type} · {scanResult.event_name}</p>
                                    <p className="text-[11px] text-brand-secondary-6">
                                        Ticket #{scanResult.issued_ticket_id}
                                    </p>
                                    {scanResult.checked_in_at && (
                                        <p className="text-[11px] text-brand-secondary-6 mt-1">
                                            {scanState === "duplicate" ? "Previously checked in" : "Checked in"}: {formatDateTime(scanResult.checked_in_at)}
                                        </p>
                                    )}
                                    <p className="text-[11px] text-brand-secondary-6 italic mt-1">{scanResult.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error state */}
                    {scanState === "error" && (
                        <div className="max-w-lg mx-auto mb-8 rounded-xl p-4 border bg-red-50 border-red-200">
                            <div className="flex items-center gap-3">
                                <Icon icon="lucide:wifi-off" className="w-5 h-5 text-red-400 shrink-0" />
                                <p className="text-sm text-red-600">Failed to process scan. Please try again.</p>
                            </div>
                        </div>
                    )}

                    {/* OR divider */}
                    {scanState === "idle" && (
                        <div className="relative mb-8 flex justify-center">
                            <span className="px-4 text-sm text-neutral-500 font-medium">or</span>
                        </div>
                    )}

                    {/* QR graphic + scan button */}
                    <div className="flex justify-center items-center flex-col gap-8">
                        {scanState === "scanning" ? (
                            <Icon icon="svg-spinners:ring-resize" className="w-16 h-16 text-brand-primary-6" />
                        ) : (
                            <Image
                                src="/images/vectors/qr-code.svg"
                                alt="qr-code"
                                width={150}
                                height={150}
                                className={cn(
                                    "select-none mx-auto pointer-events-none transition-all duration-500",
                                    scanState !== "idle" && "opacity-40 scale-90"
                                )}
                            />
                        )}

                        <button
                            onClick={() => setShowScanner(true)}
                            disabled={isProcessing}
                            className={cn(
                                "px-8 py-3.5 rounded-md font-medium text-sm transition-all duration-300",
                                "focus:outline-none focus:ring-2 focus:ring-brand-primary-5 focus:ring-offset-2",
                                "disabled:cursor-not-allowed",
                                isProcessing
                                    ? "bg-brand-primary-4 text-white cursor-wait scale-95"
                                    : "bg-brand-primary-6 text-white hover:bg-brand-primary-7 hover:shadow-lg active:scale-95"
                            )}
                        >
                            {isProcessing ? (
                                <span className="flex items-center gap-2">
                                    <Icon icon="eos-icons:three-dots-loading" width="24" height="24" />
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Icon icon="hugeicons:qr-code" width="18" height="18" />
                                    Scan QR Code
                                </span>
                            )}
                        </button>

                        {/* Clear result after scan */}
                        {scanResult && !isProcessing && (
                            <button
                                onClick={handleClear}
                                className="text-xs text-brand-secondary-6 hover:text-brand-secondary-9 flex items-center gap-1 transition-colors -mt-4"
                            >
                                <Icon icon="lucide:refresh-cw" className="w-3 h-3" />
                                Scan another ticket
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <QRScannerDialog
                open={showScanner}
                onOpenChange={setShowScanner}
                onScanSuccess={handleScanSuccess}
            />
        </div>
    )
}