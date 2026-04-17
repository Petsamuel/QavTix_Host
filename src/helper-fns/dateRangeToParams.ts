import { format } from "date-fns"
import { DateRange } from "react-day-picker"

export function dateRangeToParams(date: DateRange | null): Pick<FinancialsParams, 'start_date' | 'end_date'> {
    const params: Pick<FinancialsParams, 'start_date' | 'end_date'> = {}
    if (date?.from) params.start_date = format(date.from, 'yyyy-MM-dd')
    if (date?.to)   params.end_date   = format(date.to,   'yyyy-MM-dd')
    return params
}

// If user picks a date range we default to "month"; if no date is selected we
// stay on "month".  The year param is derived from the selected date if present.
export function deriveChartFilter(chartPreset: ChartPreset | null): { chart: ChartFilter; year?: number } {    
    return {
        chart: chartPreset || "month",
        year:  new Date().getFullYear(),
    }
}