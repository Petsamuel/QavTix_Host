import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"
import { useState } from "react"
import { motion } from "framer-motion"


interface ExportFormatOption {
    value: ExportFormat
    label: string
    icon: string
}

const exportFormats: ExportFormatOption[] = [
    { value: 'csv', label: 'CSV', icon: 'mdi:file-delimited' },
    { value: 'xlsx', label: 'Excel', icon: 'mdi:file-excel' },
    { value: 'pdf', label: 'PDF', icon: 'mdi:file-pdf-box' },
    { value: 'json', label: 'JSON', icon: 'mdi:code-json' }
]

interface ExportButtonProps {
    onExport?: (format: ExportFormat) => void
    defaultFormat?: ExportFormat
    showFormatSelector?: boolean
    formats?: ExportFormat[]
    disabled?: boolean
    className?: string
    label?: string
}

export default function ExportButton1({
    onExport,
    defaultFormat = 'csv',
    showFormatSelector = false,
    formats = ['csv', 'xlsx', 'pdf', 'json'],
    disabled = false,
    className,
    label = 'Export Data'
}: ExportButtonProps) {

    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>(defaultFormat)

    const availableFormats = exportFormats.filter(format => 
        formats.includes(format.value)
    )

    const handleExport = async () => {
        if (disabled) return
        if (onExport) {
            onExport(selectedFormat)
        }
    }

    const handleFormatChange = (format: string) => {
        setSelectedFormat(format as ExportFormat)
    }

    return (
        <div className={cn('flex items-center gap-2', className, showFormatSelector ? 'bg-brand-primary-1 p-1.5 rounded-md' : '')}>
            <motion.button
                onClick={handleExport}
                disabled={disabled}
                whileHover={!disabled ? { y: -2, scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                className={cn(
                    'flex items-center justify-between text-xs font-bold gap-2 transition-opacity',
                    disabled ? 'opacity-50 cursor-not-allowed' : 'text-brand-primary-6 hover:text-brand-primary-7'
                )}
            >
                <span className={cn(
                    'size-9 md:size-7 aspect-square rounded flex justify-center items-center text-white',
                    disabled ? 'bg-brand-neutral-4' : 'bg-brand-primary-3'
                )}>
                    <Icon icon="pajamas:export" width="16" height="16" className="" />
                </span>
                <span className={cn(showFormatSelector ? 'hidden' : 'block', "hidden md:block")}>{label}</span>
            </motion.button>

            {/* Format Selector */}
            {showFormatSelector && (
                <Select 
                    value={selectedFormat} 
                    onValueChange={handleFormatChange}
                    disabled={disabled}
                >
                    <SelectTrigger className="w-fit text-[10px] border-brand-neutral-3 bg-white px-1">
                        <SelectValue className="text-xs" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableFormats.map((format) => (
                            <SelectItem 
                                key={format.value} 
                                value={format.value}
                                className="text-xs hover:bg-brand-accent-4!"
                            >
                                <div className="flex items-center gap-1">
                                    <Icon icon={format.icon} className="w-4 h-4" />
                                    <span>{format.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </div>
    )
}