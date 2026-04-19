"use client"

import { useState } from "react"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import CustomersList from "./CustomersList"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import DateRangePresetFilter from "../custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"
import { exportData } from "@/helper-fns/exportData"

interface IMetricsDataFilter {
    dateRangePreset: DatePreset | null
}

export default function CustomersPagePw({ customersData }: { customersData: CustomersData }) {
    const [metricsDataFilter, setMetricsDataFilter] = useState<IMetricsDataFilter>({
        dateRangePreset: null,
    })

    const [currentItems, setCurrentItems] = useState<Customer[]>(customersData.results)

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <DateRangePresetFilter
                        value={metricsDataFilter.dateRangePreset}
                        onChange={(v) => setMetricsDataFilter((prev) => ({ ...prev, dateRangePreset: v }))}
                    />
                </div>
                <ExportButton1
                    showFormatSelector
                    label="Export Customers"
                    onExport={(format) =>
                        exportData({
                            data:     currentItems as unknown as Record<string, unknown>[],
                            format,
                            filename: 'customers',
                            title:    'Customer List',
                            skipKeys: ['user_id'],
                        })
                    }
                />
            </div>

            <CustomersList
                initialData={customersData as TabSlice<Customer>}
                cards={customersData.cards}
                externalFilters={metricsDataFilter}
                onItemsChange={setCurrentItems}
            />
        </main>
    )
}