'use client'

import { useState } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import QRScannerDialog from "./QRScannerDialog"
import { scanCheckIn } from "@/actions/checkin"
import { useRevalidate } from "@/custom-hooks/UseRevalidate"
import { ScanResultType } from "@/components/modals/resources/ticket-scan-status-config"
import ScanResultModal from "@/components/modals/ticket-scan/ScanStatusModal"

type ScanState = "idle" | "scanning" | "success" | "duplicate" | "invalid" | "error"

export default function SystemCheckInScanCodeInputArea() {

    const [token,          setToken]          = useState("")
    const [scanState,      setScanState]      = useState<ScanState>("idle")
    const [scanResult,     setScanResult]     = useState<any>(null)
    const [showScanner,    setShowScanner]    = useState(false)
    const [showResultModal, setShowResultModal] = useState(false)
    const [modalType,      setModalType]      = useState<ScanResultType>("failed")

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

        // Determine which modal to show
        let resultType: ScanResultType = "failed"

        if (data.status === "checked_in") {
            setScanState("success")
            resultType = "verified"
            trigger()                    // Revalidate attendee list
        } 
        else if (data.status === "duplicate") {
            setScanState("duplicate")
            resultType = "used"
        } 
        else if (data.status === "invalid") {
            setScanState("invalid")
            resultType = "failed"
        }

        setModalType(resultType)
        setShowResultModal(true)         // ← Show the nice modal
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
        setShowResultModal(false)
    }

    const isProcessing = scanState === "scanning"

    return (
        <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
            <div className={cn(
                "relative rounded-2xl p-8 border-[1.5px] border-dashed transition-all duration-500 bg-white",
                scanState === "success"   && "border-green-500 bg-green-50/30",
                scanState === "duplicate" && "border-amber-400 bg-amber-50/30",
                scanState === "invalid"   && "border-red-400 bg-red-50/30",
            )}>

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

                        {(token || scanResult) && !isProcessing && (
                            <button
                                onClick={handleClear}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group shrink-0"
                            >
                                <Icon icon="lucide:x" className="w-5 h-5 text-brand-neutral-6 group-hover:text-red-500" />
                            </button>
                        )}

                        {token && !isProcessing && (
                            <button
                                onClick={handleSearch}
                                className="px-4 py-3 bg-brand-primary-6 text-white rounded-xl text-sm font-medium hover:bg-brand-primary-7 transition-colors shrink-0"
                            >
                                <Icon icon="mage:search" className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {token && (
                        <p className="mt-2 text-[11px] text-brand-secondary-6 text-center font-mono truncate px-2">
                            {token.length > 40 ? `${token.slice(0, 20)}...${token.slice(-10)}` : token}
                        </p>
                    )}
                </div>

                {/* QR Scan Button */}
                <div className="flex justify-center flex-col items-center gap-8">
                    <Image
                        src="/images/vectors/qr-code.svg"
                        alt="qr-code"
                        width={150}
                        height={150}
                        className="select-none mx-auto pointer-events-none"
                    />

                    <button
                        onClick={() => setShowScanner(true)}
                        disabled={isProcessing}
                        className="px-8 py-3.5 rounded-md font-medium text-sm bg-brand-primary-6 text-white hover:bg-brand-primary-7 transition-all disabled:cursor-not-allowed"
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
                </div>
            </div>

            {/* QR Scanner Dialog */}
            <QRScannerDialog
                open={showScanner}
                onOpenChange={setShowScanner}
                onScanSuccess={handleScanSuccess}
            />

            <ScanResultModal
                open={showResultModal}
                onOpenChange={setShowResultModal}
                resultType={modalType}
            />
        </div>
    )
}