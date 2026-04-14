import { format } from "date-fns"
import { DateRange } from "react-day-picker"

export function dateRangeToParams(date: DateRange | null): Pick<FinancialsParams, 'start_date' | 'end_date'> {
    const params: Pick<FinancialsParams, 'start_date' | 'end_date'> = {}
    if (date?.from) params.start_date = format(date.from, 'yyyy-MM-dd')
    if (date?.to)   params.end_date   = format(date.to,   'yyyy-MM-dd')
    return params
}