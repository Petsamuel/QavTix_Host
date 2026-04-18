"use client"

import { useState } from "react"
import ExportButton1 from "@/lib/features/export/ExportDataBtn1"
import CustomersList from "./CustomersList"
import { TabSlice } from "@/custom-hooks/UseDataDisplay"
import DateRangePresetFilter from "../custom-utils/TableDataDisplayAreas/filters/DateRangePresetFilter"

interface IMetricsDataFilter {
    dateRangePreset: DatePreset | null
}

export default function CustomersPagePw({ customersData }:{ customersData: CustomersData }) {
    const [metricsDataFilter, setMetricsDataFilter] = useState<IMetricsDataFilter>({
        dateRangePreset: null
    })

    return (
        <main className="pb-10">
            <div className="flex justify-between items-center gap-5 mb-5 mt-10 lg:mt-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <DateRangePresetFilter
                        value={metricsDataFilter.dateRangePreset}
                        onChange={(v) => setMetricsDataFilter((prev) => ({ ...prev, dateRangePreset: v }))}
                    />
                </div>
                <ExportButton1 showFormatSelector />
            </div>

            <CustomersList initialData={customersData as TabSlice<Customer>} cards={customersData.cards} externalFilters={metricsDataFilter} />
        </main>
    )
}