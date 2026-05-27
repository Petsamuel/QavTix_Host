'use client'

import { forwardRef, useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'


const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]

const TIMEZONES = [
    { label: "UTC-12", value: "UTC-12", offset: -12 },
    { label: "UTC-11", value: "UTC-11", offset: -11 },
    { label: "UTC-10 (HST)", value: "UTC-10", offset: -10 },
    { label: "UTC-9 (AKST)", value: "UTC-9", offset: -9 },
    { label: "UTC-8 (PST)", value: "UTC-8", offset: -8 },
    { label: "UTC-7 (MST)", value: "UTC-7", offset: -7 },
    { label: "UTC-6 (CST)", value: "UTC-6", offset: -6 },
    { label: "UTC-5 (EST)", value: "UTC-5", offset: -5 },
    { label: "UTC-4 (AST)", value: "UTC-4", offset: -4 },
    { label: "UTC-3", value: "UTC-3", offset: -3 },
    { label: "UTC-2", value: "UTC-2", offset: -2 },
    { label: "UTC-1", value: "UTC-1", offset: -1 },
    { label: "UTC+0 (GMT)", value: "UTC+0", offset: 0 },
    { label: "UTC+1 (WAT/CET)", value: "UTC+1", offset: 1 },
    { label: "UTC+2 (EET)", value: "UTC+2", offset: 2 },
    { label: "UTC+3 (MSK)", value: "UTC+3", offset: 3 },
    { label: "UTC+4", value: "UTC+4", offset: 4 },
    { label: "UTC+5 (PKT)", value: "UTC+5", offset: 5 },
    { label: "UTC+5:30 (IST)", value: "UTC+5:30", offset: 5.5 },
    { label: "UTC+6", value: "UTC+6", offset: 6 },
    { label: "UTC+7 (WIB)", value: "UTC+7", offset: 7 },
    { label: "UTC+8 (CST)", value: "UTC+8", offset: 8 },
    { label: "UTC+9 (JST)", value: "UTC+9", offset: 9 },
    { label: "UTC+10 (AEST)", value: "UTC+10", offset: 10 },
    { label: "UTC+11", value: "UTC+11", offset: 11 },
    { label: "UTC+12 (NZST)", value: "UTC+12", offset: 12 },
]

const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"))
const VISIBLE_YEARS = 12

const B1 = "#e6eefa"  // brand-primary-1
const B2 = "#c2d5f3"  // brand-primary-2
const B6 = "#0052cc"  // brand-primary-6
const B7 = "#0046ba"  // brand-primary-7

interface TimeInputDropdownProps {
    val: string
    set: (v: string) => void
    items: string[]
    maxVal: number
    minVal: number
}

const TimeInputDropdown: React.FC<TimeInputDropdownProps> = ({ val, set, items, maxVal, minVal }) => {
    const [open, setOpen] = useState(false)
    const [tempVal, setTempVal] = useState(val)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setTempVal(val)
    }, [val])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
                commitValue(tempVal)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [tempVal, val])

    const commitValue = (input: string) => {
        let num = parseInt(input, 10)
        if (isNaN(num)) {
            setTempVal(val)
            return
        }
        if (num < minVal) num = minVal
        if (num > maxVal) num = maxVal
        const formatted = String(num).padStart(2, "0")
        set(formatted)
        setTempVal(formatted)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            commitValue(tempVal)
            setOpen(false)
        } else if (e.key === "Escape") {
            setTempVal(val)
            setOpen(false)
        }
    }

    const filteredItems = items.filter(it => it.includes(tempVal))
    const displayItems = filteredItems.length > 0 ? filteredItems : items

    return (
        <div ref={containerRef} style={{ position: "relative", width: 56 }}>
            <input
                type="text"
                value={tempVal}
                onFocus={() => setOpen(true)}
                onChange={e => {
                    const cleanVal = e.target.value.replace(/\D/g, "").slice(0, 2)
                    setTempVal(cleanVal)
                }}
                onKeyDown={handleKeyDown}
                style={{
                    width: "100%",
                    padding: "6px 16px 6px 8px",
                    borderRadius: 8,
                    border: open ? `1.5px solid ${B6}` : "1px solid #d1d5db",
                    fontSize: 13,
                    fontWeight: 500,
                    background: "#fff",
                    color: "#111827",
                    textAlign: "center",
                    outline: "none",
                    transition: "border-color 0.15s ease-in-out",
                }}
            />
            <span 
                onClick={() => setOpen(!open)}
                style={{
                    position: "absolute",
                    right: 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: 9,
                    color: "#9ca3af",
                    userSelect: "none"
                }}
            >
                ▾
            </span>

            {open && (
                <div style={{
                    position: "absolute",
                    bottom: "calc(100% + 4px)",
                    left: 0,
                    width: "100%",
                    zIndex: 100,
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    maxHeight: 150,
                    overflowY: "auto",
                    boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
                }} className="tz-scroll-c">
                    {displayItems.map(it => (
                        <div
                            key={it}
                            onClick={() => {
                                set(it)
                                setTempVal(it)
                                setOpen(false)
                            }}
                            style={{
                                padding: "6px 8px",
                                fontSize: 12,
                                textAlign: "center",
                                cursor: "pointer",
                                fontWeight: it === val ? 600 : 400,
                                color: it === val ? B6 : "#111827",
                                background: it === val ? B1 : "transparent",
                            }}
                            className="dtp-cal-day"
                        >
                            {it}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const AmPmSelector: React.FC<{ val: string; set: (v: string) => void }> = ({ val, set }) => {
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} style={{ position: "relative", width: 56 }}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                style={{
                    width: "100%",
                    padding: "6px 16px 6px 8px",
                    borderRadius: 8,
                    border: open ? `1.5px solid ${B6}` : "1px solid #d1d5db",
                    fontSize: 13,
                    fontWeight: 500,
                    background: "#fff",
                    color: "#111827",
                    textAlign: "center",
                    outline: "none",
                    cursor: "pointer",
                    transition: "border-color 0.15s ease-in-out",
                }}
            >
                {val}
            </button>
            <span 
                onClick={() => setOpen(!open)}
                style={{
                    position: "absolute",
                    right: 6,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: 9,
                    color: "#9ca3af",
                    userSelect: "none",
                    pointerEvents: "none"
                }}
            >
                ▾
            </span>

            {open && (
                <div style={{
                    position: "absolute",
                    bottom: "calc(100% + 4px)",
                    left: 0,
                    width: "100%",
                    zIndex: 100,
                    background: "#fff",
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
                }}>
                    {["AM", "PM"].map(it => (
                        <div
                            key={it}
                            onClick={() => {
                                set(it)
                                setOpen(false)
                            }}
                            style={{
                                padding: "6px 8px",
                                fontSize: 12,
                                textAlign: "center",
                                cursor: "pointer",
                                fontWeight: it === val ? 600 : 400,
                                color: it === val ? B6 : "#111827",
                                background: it === val ? B1 : "transparent",
                            }}
                            className="dtp-cal-day"
                        >
                            {it}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function getDaysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
function getFirstDayOfWeek(y: number, m: number) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }

function buildISO(
    selected: { day: number; month: number; year: number },
    hour: string, minute: string, ampm: string, timezone: string
): string {
    let h = parseInt(hour)
    if (ampm === "PM" && h < 12) h += 12
    if (ampm === "AM" && h === 12) h = 0
    const tz = TIMEZONES.find(t => t.value === timezone)
    const off = tz ? tz.offset : 0
    const sign = off >= 0 ? "+" : "-"
    const absOff = Math.abs(off)
    const offH = String(Math.floor(absOff)).padStart(2, "0")
    const offM = String((absOff % 1) * 60).padStart(2, "0")
    const ds = `${selected.year}-${String(selected.month + 1).padStart(2, "0")}-${String(selected.day).padStart(2, "0")}`
    const ts = `${String(h).padStart(2, "0")}:${minute}:00`
    return `${ds}T${ts}${sign}${offH}:${offM}`
}

function formatDisplay(
    selected: { day: number; month: number; year: number } | null,
    hour: string, minute: string, ampm: string, timezone: string
): string {
    if (!selected) return ""
    return `${MONTHS[selected.month].slice(0, 3)} ${selected.day}, ${selected.year} · ${hour}:${minute} ${ampm} ${timezone}`
}


interface DateTimeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    disablePastDate?: boolean
}


export const CustomDateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
    ({ label, error, disablePastDate = true, className = '', value, onChange, onBlur, name, ...props }, ref) => {

        const today = new Date()

        const [open, setOpen] = useState(false)
        const [calMonth, setCalMonth] = useState(today.getMonth())
        const [calYear, setCalYear] = useState(today.getFullYear())
        const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>(null)
        const [committedDate, setCommittedDate] = useState<{ day: number; month: number; year: number } | null>(null)
        const [committedTime, setCommittedTime] = useState<{ hour: string; minute: string; ampm: string; timezone: string } | null>(null)
        const [yearPage, setYearPage] = useState(0)
        const [panelOpen, setPanelOpen] = useState(false)
        const [hour, setHour] = useState("10")
        const [minute, setMinute] = useState("00")
        const [ampm, setAmpm] = useState("AM")
        const [timezone, setTimezone] = useState("UTC+1")
        const [showTzDropdown, setShowTzDropdown] = useState(false)
        const [inputValue, setInputValue] = useState("")

        const tzRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            if (committedDate && committedTime) {
                setInputValue(formatDisplay(committedDate, committedTime.hour, committedTime.minute, committedTime.ampm, committedTime.timezone))
            } else {
                setInputValue("")
            }
        }, [committedDate, committedTime])

        useEffect(() => {
            if (!value || typeof value !== 'string') return
            if (committedDate) return
            try {
                const date = new Date(value)
                if (isNaN(date.getTime())) return
                const day = date.getDate()
                const month = date.getMonth()
                const year = date.getFullYear()
                let h = date.getHours()
                const min = date.getMinutes()
                const ap = h >= 12 ? "PM" : "AM"
                if (h > 12) h -= 12
                if (h === 0) h = 12
                const hourStr = String(h).padStart(2, "0")
                const minuteStr = String(min).padStart(2, "0")
                setSelectedDate({ day, month, year })
                setCommittedDate({ day, month, year })
                setCalMonth(month)
                setCalYear(year)
                setHour(hourStr)
                setMinute(minuteStr)
                setAmpm(ap)
                setCommittedTime({ hour: hourStr, minute: minuteStr, ampm: ap, timezone })
            } catch { }
        }, [value])

        const yearsList = useMemo(() => {
            const base = today.getFullYear() - 4 + yearPage * VISIBLE_YEARS
            return Array.from({ length: VISIBLE_YEARS }, (_, i) => base + i)
        }, [yearPage])

        useEffect(() => {
            function handle(e: MouseEvent) {
                if (tzRef.current && !tzRef.current.contains(e.target as Node)) setShowTzDropdown(false)
            }
            document.addEventListener("mousedown", handle)
            return () => document.removeEventListener("mousedown", handle)
        }, [])

        useEffect(() => {
            if (!open) { setPanelOpen(false); setShowTzDropdown(false) }
        }, [open])

        const firstDay = getFirstDayOfWeek(calYear, calMonth)
        const daysInMonth = getDaysInMonth(calYear, calMonth)
        const prevDays = getDaysInMonth(calYear, calMonth === 0 ? 11 : calMonth - 1)
        const calCells: { day: number; cur: boolean }[] = []
        for (let i = 0; i < firstDay; i++) calCells.push({ day: prevDays - firstDay + i + 1, cur: false })
        for (let i = 1; i <= daysInMonth; i++) calCells.push({ day: i, cur: true })
        while (calCells.length % 7 !== 0) calCells.push({ day: calCells.length - firstDay - daysInMonth + 1, cur: false })

        const isPastDate = useCallback((day: number) => {
            if (!disablePastDate) return false
            const d = new Date(calYear, calMonth, day); d.setHours(0, 0, 0, 0)
            const t = new Date(); t.setHours(0, 0, 0, 0)
            return d < t
        }, [calYear, calMonth, disablePastDate])

        const isSelected = (day: number) =>
            selectedDate?.day === day && selectedDate?.month === calMonth && selectedDate?.year === calYear
        const isToday = (day: number) =>
            day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()

        const fireChange = useCallback((iso: string) => {
            onChange?.({ target: { value: iso, name: name ?? "" } } as React.ChangeEvent<HTMLInputElement>)
        }, [onChange, name])

        const handleDone = () => {
            if (!selectedDate) return
            const iso = buildISO(selectedDate, hour, minute, ampm, timezone)
            setCommittedDate(selectedDate)
            setCommittedTime({ hour, minute, ampm, timezone })
            fireChange(iso)
            setOpen(false)
        }

        const handleCancel = () => {
            setSelectedDate(committedDate)
            if (committedTime) {
                setHour(committedTime.hour)
                setMinute(committedTime.minute)
                setAmpm(committedTime.ampm)
                setTimezone(committedTime.timezone)
            }
            setOpen(false)
        }

        const displayValue = committedDate && committedTime
            ? formatDisplay(committedDate, committedTime.hour, committedTime.minute, committedTime.ampm, committedTime.timezone)
            : ""

        const chipStyle = (active: boolean): React.CSSProperties => ({
            padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500,
            border: active ? `1.5px solid ${B6}` : "1px solid #d1d5db",
            background: active ? B1 : "#fff",
            color: active ? B6 : "#374151",
            cursor: "pointer", transition: "all 0.12s", outline: "none", whiteSpace: "nowrap" as const,
        })

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            setInputValue(val)

            try {
                const timezoneRegex = /\s*UTC[+-]\d+(:\d+)?(\s*\(.*\))?$/i
                const cleanVal = val.replace("·", "").replace(timezoneRegex, "").replace(/\s+/g, " ").trim()
                const hasTime = cleanVal.includes(":") || /am|pm/i.test(cleanVal)
                const parsed = new Date(cleanVal)
                if (!isNaN(parsed.getTime())) {
                    const day = parsed.getDate()
                    const month = parsed.getMonth()
                    const year = parsed.getFullYear()
                    
                    setSelectedDate({ day, month, year })
                    setCalMonth(month)
                    setCalYear(year)

                    if (hasTime) {
                        let h = parsed.getHours()
                        const min = parsed.getMinutes()
                        const ap = h >= 12 ? "PM" : "AM"
                        if (h > 12) h -= 12
                        if (h === 0) h = 12
                        
                        setHour(String(h).padStart(2, "0"))
                        setMinute(String(min).padStart(2, "0"))
                        setAmpm(ap)
                    }
                }
            } catch (err) {}
        }

        const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            try {
                const timezoneRegex = /\s*UTC[+-]\d+(:\d+)?(\s*\(.*\))?$/i
                const cleanVal = inputValue.replace("·", "").replace(timezoneRegex, "").replace(/\s+/g, " ").trim()
                const hasTime = cleanVal.includes(":") || /am|pm/i.test(cleanVal)
                const parsed = new Date(cleanVal)
                if (!isNaN(parsed.getTime())) {
                    const day = parsed.getDate()
                    const month = parsed.getMonth()
                    const year = parsed.getFullYear()
                    
                    const newDate = { day, month, year }
                    setSelectedDate(newDate)
                    setCommittedDate(newDate)

                    let hStr = hour
                    let mStr = minute
                    let apStr = ampm

                    if (hasTime) {
                        let h = parsed.getHours()
                        const min = parsed.getMinutes()
                        const ap = h >= 12 ? "PM" : "AM"
                        if (h > 12) h -= 12
                        if (h === 0) h = 12
                        hStr = String(h).padStart(2, "0")
                        mStr = String(min).padStart(2, "0")
                        apStr = ap
                        
                        setHour(hStr)
                        setMinute(mStr)
                        setAmpm(apStr)
                    }

                    const iso = buildISO(newDate, hStr, mStr, apStr, timezone)
                    setCommittedTime({ hour: hStr, minute: mStr, ampm: apStr, timezone })
                    fireChange(iso)
                } else if (!inputValue) {
                    setSelectedDate(null)
                    setCommittedDate(null)
                    setCommittedTime(null)
                    fireChange("")
                } else {
                    if (committedDate && committedTime) {
                        setInputValue(formatDisplay(committedDate, committedTime.hour, committedTime.minute, committedTime.ampm, committedTime.timezone))
                    } else {
                        setInputValue("")
                    }
                }
            } catch (err) {
                if (committedDate && committedTime) {
                    setInputValue(formatDisplay(committedDate, committedTime.hour, committedTime.minute, committedTime.ampm, committedTime.timezone))
                } else {
                    setInputValue("")
                }
            }
            onBlur?.(e as any)
        }

        return (
            <div className="w-full">
                <style>{`
                    .dtp-cal-day:hover { background: #f3f4f6 !important; }
                    .dtp-chip-c:hover { border-color: ${B6} !important; color: ${B6} !important; }
                    .dtp-nav-c:hover { background: #f3f4f6; }
                    .tz-scroll-c::-webkit-scrollbar { display: none; }
                `}</style>

                <label className="block text-sm font-medium text-brand-secondary-9 mb-2">
                    {label}
                </label>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <input
                            type="text"
                            value={inputValue}
                            placeholder="Select date & time"
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                            className={cn(
                                "w-full h-14 px-4 py-3 text-xs rounded-lg bg-white outline-none transition-all text-left",
                                "border border-brand-secondary-2 focus:border-brand-accent-4 hover:border-brand-secondary-6",
                                error && "border-red-400 focus:border-red-500 ring-1 ring-red-400/20",
                                !inputValue && "text-brand-secondary-4",
                                className
                            )}
                        />
                    </PopoverTrigger>

                    <input
                        ref={ref}
                        type="hidden"
                        name={name}
                        value={typeof value === 'string' ? value : (selectedDate ? buildISO(selectedDate, hour, minute, ampm, timezone) : "")}
                        onChange={() => { }}
                        {...props}
                    />

                    <PopoverContent
                        align="start"
                        sideOffset={6}
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        className="p-0 w-[340px] max-w-[calc(100vw-16px)] rounded-2xl border border-[#e5e7eb] shadow-xl"
                        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                    >
                        {/* Calendar grid */}
                        <div style={{ padding: "16px 18px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <button type="button" onClick={() => setPanelOpen(o => !o)} style={{
                                    display: "flex", alignItems: "center", gap: 5,
                                    background: panelOpen ? B1 : "transparent",
                                    border: panelOpen ? `1.5px solid ${B6}` : "1.5px solid transparent",
                                    borderRadius: 8, padding: "3px 8px 3px 6px", cursor: "pointer", outline: "none",
                                }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: panelOpen ? B6 : "#111827" }}>
                                        {MONTHS[calMonth]} {calYear}
                                    </span>
                                    <ChevronDownIcon className={cn("size-4 transition-transform duration-200", panelOpen && "rotate-180")} style={{ color: B6 }} />
                                </button>
                                <div style={{ display: "flex", gap: 2 }}>
                                    <button type="button" className="dtp-nav-c" onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) } else setCalMonth(m => m - 1) }}
                                        style={{ background: "none", border: "none", cursor: "pointer", padding: "3px 8px", borderRadius: 6, color: "#6b7280", fontSize: 16 }}>‹</button>
                                    <button type="button" className="dtp-nav-c" onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) } else setCalMonth(m => m + 1) }}
                                        style={{ background: "none", border: "none", cursor: "pointer", padding: "3px 8px", borderRadius: 6, color: "#6b7280", fontSize: 16 }}>›</button>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 4 }}>
                                {DAYS.map(d => <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 500, color: "#9ca3af" }}>{d}</div>)}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
                                {calCells.map((cell, i) => {
                                    const sel = cell.cur && isSelected(cell.day)
                                    const tod = cell.cur && isToday(cell.day)
                                    const past = cell.cur && isPastDate(cell.day)
                                    return (
                                        <button key={i} type="button"
                                            className={cell.cur && !past ? "dtp-cal-day" : ""}
                                            onClick={() => cell.cur && !past && setSelectedDate({ day: cell.day, month: calMonth, year: calYear })}
                                            style={{
                                                height: 32, borderRadius: 7,
                                                border: !sel && tod ? `1.5px solid ${B6}` : "none",
                                                cursor: cell.cur && !past ? "pointer" : "default",
                                                fontSize: 12, fontWeight: sel ? 600 : 400,
                                                background: sel ? B6 : "transparent",
                                                color: sel ? "#fff" : past ? "#d1d5db" : cell.cur ? (tod ? B6 : "#111827") : "#d1d5db",
                                                transition: "all 0.12s",
                                            }}>
                                            {cell.day}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Month/Year selector panel */}
                        {panelOpen && (
                            <div style={{ borderTop: "1px solid #e5e7eb", padding: "12px 18px 16px" }}>
                                <div style={{ marginBottom: 12 }}>
                                    <span style={{ display: "block", fontSize: 10, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Month</span>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {MONTHS.map(m => (
                                            <button type="button" key={m} className="dtp-chip-c" onClick={() => setCalMonth(MONTHS.indexOf(m))} style={chipStyle(calMonth === MONTHS.indexOf(m))}>{m.slice(0, 3)}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                        <span style={{ fontSize: 10, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Year</span>
                                        <div style={{ display: "flex", gap: 2 }}>
                                            <button type="button" className="dtp-nav-c" onClick={() => setYearPage(p => p - 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 6, color: "#6b7280", fontSize: 12 }}>‹</button>
                                            <button type="button" className="dtp-nav-c" onClick={() => setYearPage(p => p + 1)} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 6, color: "#6b7280", fontSize: 12 }}>›</button>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                        {yearsList.map(y => (
                                            <button type="button" key={y} className="dtp-chip-c" onClick={() => setCalYear(y)} style={chipStyle(calYear === y)}>{y}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Time bar */}
                        <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 18px", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <TimeInputDropdown val={hour} set={setHour} items={HOURS_12} minVal={1} maxVal={12} />
                                <span style={{ fontSize: 16, fontWeight: 300, color: "#d1d5db" }}>:</span>
                                <TimeInputDropdown val={minute} set={setMinute} items={MINUTES} minVal={0} maxVal={59} />
                                <AmPmSelector val={ampm} set={setAmpm} />
                            </div>

                            {/* Timezone dropdown */}
                            <div style={{ position: "relative", marginLeft: 2 }} ref={tzRef}>
                                <button type="button" onClick={() => setShowTzDropdown(v => !v)} style={{
                                    padding: "6px 10px", borderRadius: 8, border: `1.5px solid ${B6}`,
                                    fontSize: 12, fontWeight: 500, background: B1, color: B6,
                                    cursor: "pointer", outline: "none", display: "flex", alignItems: "center", gap: 4,
                                }}>
                                    {timezone}
                                    <ChevronDownIcon className={cn("size-3.5 transition-transform duration-200", showTzDropdown && "rotate-180")} />
                                </button>
                                {showTzDropdown && (
                                    <div className="tz-scroll-c" style={{
                                        position: "absolute", bottom: "calc(100% + 4px)", left: 0, zIndex: 60,
                                        background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb",
                                        maxHeight: 180, overflowY: "auto", minWidth: 180,
                                        boxShadow: "0 -6px 20px rgba(0,0,0,0.08)",
                                    }}>
                                        {TIMEZONES.map(tz => (
                                            <div key={tz.value} onClick={() => { setTimezone(tz.value); setShowTzDropdown(false) }}
                                                style={{ padding: "8px 12px", fontSize: 12, cursor: "pointer", fontWeight: tz.value === timezone ? 600 : 400, color: tz.value === timezone ? B6 : "#111827", background: tz.value === timezone ? B1 : "transparent" }}>
                                                {tz.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bottom bar */}
                        <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                            <div style={{ fontSize: 11, color: "#6b7280", flex: 1, minWidth: 0 }}>
                                {selectedDate
                                    ? <span style={{ color: "#111827", fontSize: 11, fontWeight: 500 }}>{MONTHS[selectedDate.month].slice(0, 3)} {selectedDate.day}, {selectedDate.year} · {hour}:{minute} {ampm}</span>
                                    : "Pick a date"}
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                                <button type="button" onClick={handleCancel} style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: "none", color: "#6b7280", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                                <button type="button" onClick={handleDone} style={{
                                    padding: "7px 18px", borderRadius: 8, border: "none",
                                    background: selectedDate ? B6 : B2,
                                    color: "#fff", fontSize: 12, fontWeight: 600,
                                    cursor: selectedDate ? "pointer" : "not-allowed", transition: "background 0.2s"
                                }}>Done</button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {error && (
                    <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium" role="alert">{error}</p>
                )}
            </div>
        )
    }
)

CustomDateTimeInput.displayName = "CustomDateTimeInput"