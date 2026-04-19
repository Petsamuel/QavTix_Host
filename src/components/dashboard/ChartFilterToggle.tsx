'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import ExportButton1 from '@/lib/features/export/ExportDataBtn1'

interface ChartFilterToggleProps {
    chartFilter:    'revenue' | 'tickets'
    setChartFilter: (filter: 'revenue' | 'tickets') => void
    onExport?:      (format: ExportFormat) => void
}

export function ChartFilterToggle({ chartFilter, setChartFilter, onExport }: ChartFilterToggleProps) {
    return (
        <div className="flex gap-4 flex-wrap justify-between items-center mb-6">
            <div className="relative bg-brand-primary-1 rounded-xl p-1.5">
                <motion.div
                    className="absolute inset-y-1.5 left-1.5 bg-brand-primary-6 rounded-lg shadow-sm"
                    initial={false}
                    animate={{
                        x:     chartFilter === 'revenue' ? 0 : '87%',
                        width: '50%',
                    }}
                    transition={{ type: 'tween', stiffness: 200, damping: 30 }}
                />

                <div className="relative flex">
                    <button
                        onClick={() => setChartFilter('revenue')}
                        className={cn(
                            'relative z-10 px-5 py-2.5 rounded-lg text-xs font-medium transition-colors min-w-20',
                            chartFilter === 'revenue' ? 'text-white' : 'text-brand-neutral-7 hover:text-brand-neutral-9'
                        )}
                    >
                        Revenue
                    </button>

                    <button
                        onClick={() => setChartFilter('tickets')}
                        className={cn(
                            'relative z-10 px-5 py-2.5 rounded-lg text-xs font-medium transition-colors min-w-20',
                            chartFilter === 'tickets' ? 'text-white' : 'text-brand-neutral-7 hover:text-brand-neutral-9'
                        )}
                    >
                        Tickets
                    </button>
                </div>
            </div>

            <ExportButton1 onExport={onExport} />
        </div>
    )
}