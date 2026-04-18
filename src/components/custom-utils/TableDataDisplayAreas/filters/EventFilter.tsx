"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EventFilterTypeBtn from "./buttons-and-inputs/EventFilterTypeBtn"
import { getUpcomingEvents } from "@/actions/dashboard"

interface EventOption {
    id: string
    title: string
}

interface EventFilterProps {
    value?: string | null
    onChange: (value: string | null) => void
    icon: string
}

export function EventFilter({ value, onChange, icon }: EventFilterProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [events, setEvents] = useState<EventOption[]>([])
    const [loading, setLoading] = useState(false)

    // Cache for "All Events" + searched results
    const allEventsCache = useRef<EventOption[]>([])
    const searchCache = useRef<Map<string, EventOption[]>>(new Map())

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Fetch function with caching
    const fetchEvents = useCallback(async (query: string = ""): Promise<void> => {
        const cacheKey = query.trim().toLowerCase()

        // Return from cache if available
        if (cacheKey === "" && allEventsCache.current.length > 0) {
            setEvents(allEventsCache.current)
            return
        }
        if (searchCache.current.has(cacheKey)) {
            setEvents(searchCache.current.get(cacheKey)!)
            return
        }

        setLoading(true)
        try {
            const result = await getUpcomingEvents({ 
                search: query,
                page: 1,
            })

            if (result.success && result.data?.results) {
                const mapped = result.data.results.map((v: any) => ({
                    id: v.id,
                    title: v.title,
                }))

                setEvents(mapped)

                // Store in cache
                if (cacheKey === "") {
                    allEventsCache.current = mapped
                } else {
                    searchCache.current.set(cacheKey, mapped)
                }
            } else {
                setEvents([])
            }
        } catch (err) {
            console.error("Failed to fetch events:", err)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }, [])

    // Only fetch when dropdown is opened OR search changes (with debounce)
    useEffect(() => {
        if (!isOpen) return

        if (debounceRef.current) clearTimeout(debounceRef.current)

        debounceRef.current = setTimeout(() => {
            fetchEvents(search)
        }, search ? 350 : 100)

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [isOpen, search, fetchEvents])

    // Reset search when closing
    useEffect(() => {
        if (!isOpen) {
            setSearch("")
        }
    }, [isOpen])

    const handleSelect = (eventId: string) => {
        onChange(eventId)
        setIsOpen(false)
    }

    const selectedTitle = events.find(e => e.id === value)?.title || value || "Select Event"

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <EventFilterTypeBtn
                    icon={icon}
                    displayText={value ? selectedTitle : "All Events"}
                    hasActiveFilter={!!value}
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                sideOffset={8}
                className={cn(
                    "w-80 p-4 pb-6 rounded-2xl shadow-xl bg-white border-none z-50",
                    // Open animation
                    "data-[state=open]:animate-in",
                    "data-[state=open]:fade-in-0",
                    "data-[state=open]:duration-500 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
                    "data-[state=open]:zoom-in-90",
                    "data-[state=open]:slide-in-from-top-4",
                    // Close animation
                    "data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0",
                    "data-[state=closed]:duration-400 data-[state=closed]:ease-in",
                    "data-[state=closed]:zoom-out-90",
                    "data-[state=closed]:slide-out-to-top-4"
                )}
            >
                {/* Mode Toggle */}
                <div className="flex bg-[#F2F2F2] p-1 rounded-lg mb-4">
                    <button
                        onClick={() => {
                            onChange(null)
                            setIsOpen(false)
                        }}
                        className={cn(
                            "flex-1 py-2 text-xs font-medium rounded-md transition-all",
                            !value ? "bg-white text-brand-primary-6 shadow-sm" : "text-brand-neutral-7"
                        )}
                    >
                        All Events
                    </button>
                    <button
                        onClick={() => {
                            if (!value) onChange(events[0]?.id || null)
                            setIsOpen(false)
                        }}
                        className={cn(
                            "flex-1 py-2 text-xs font-medium rounded-md transition-all",
                            value ? "bg-white text-brand-primary-6 shadow-sm" : "text-brand-neutral-7"
                        )}
                    >
                        Select Event
                    </button>
                </div>

                {/* Search + List */}
                <div className="space-y-4">
                    <div className="relative">
                        <Icon icon="mage:search" className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-brand-neutral-5" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search events..."
                            className="w-full bg-brand-neutral-1 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-brand-primary-4"
                        />
                        {loading && (
                            <Icon icon="svg-spinners:ring-resize" className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-brand-primary-5" />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
                        {events.map((event) => (
                            <label key={event.id} className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="event"
                                    checked={value === event.id}
                                    onChange={() => handleSelect(event.id)}
                                    className="peer size-4 aspect-square shrink-0 rounded-full border-2 border-brand-neutral-4 checked:border-brand-primary-6"
                                />
                                <span className={cn(
                                    "text-xs truncate",
                                    value === event.id ? "text-brand-primary-6 font-medium" : "text-brand-neutral-7 group-hover:text-brand-neutral-9"
                                )}>
                                    {event.title}
                                </span>
                            </label>
                        ))}

                        {!loading && events.length === 0 && search && (
                            <p className="col-span-2 py-6 text-center text-xs text-brand-neutral-5">
                                No events found
                            </p>
                        )}
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}