"use client"

import { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import EventInfo from "../event/EventInfo"
import { getUpcomingEvents } from "@/actions/dashboard/client"


interface EventOption {
    id: string
    title: string
    category: string
    image: string
}

interface SearchableEventSelectProps {
    value?: string
    onValueChange: (value: string) => void
    error?: string
}

export default function SearchableEventSelect({
    value,
    onValueChange,
    error,
}: SearchableEventSelectProps) {

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [events, setEvents] = useState<EventOption[]>([])
    const [loading, setLoading] = useState(false)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const selected = events.find(e => e.id === value)

    const fetchEvents = async (query: string) => {
        setLoading(true)
        try {
            const result = await getUpcomingEvents({
                search: query,
                page: 1,
            })
            if (result.success) {
                const all = result.data?.results ?? []
                setEvents(
                    (query ? all : all.slice(0, 3)).map(v => ({
                        category: v.category,
                        id: v.id,
                        image: v.event_image?.image_url,
                        title: v.title,
                    }))
                )
            }
        } finally {
            setLoading(false)
        }
    }

    const [hasInitialized, setHasInitialized] = useState(false)

    useEffect(() => {
        if (open && !hasInitialized) {
            fetchEvents("")
            setHasInitialized(true)
        }
    }, [open])

    // Debounced search — only fires when user actually types
    useEffect(() => {
        if (!open || !hasInitialized) return
        if (search === "") {
            // User cleared search — show initial results again
            fetchEvents("")
            return
        }
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => fetchEvents(search), 400)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [search, open])

    return (
        <div className="w-full space-y-2">
            <label className="block text-sm font-medium text-brand-secondary-9">
                Event Applicable
            </label>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full min-h-11 px-3 flex items-center justify-between gap-2 rounded-lg bg-[#F2F2F2] text-sm transition-all outline-none",
                            error
                                ? "border border-red-400"
                                : "border border-transparent hover:border-brand-neutral-5 focus:border-[1.5px] focus:border-brand-neutral-6"
                        )}
                    >
                        {selected ? (
                            <EventInfo
                                variant="mobile"
                                category={selected.category}
                                image={selected.image}
                                title={selected.title}
                            />
                        ) : (
                            <span className="text-brand-neutral-6 py-2.5">Select an event</span>
                        )}
                        <Icon icon="hugeicons:arrow-down-01" className="size-4 text-brand-neutral-6 shrink-0" />
                    </button>
                </PopoverTrigger>

                <PopoverContent
                    align="start"
                    className="p-0 w-(--radix-popover-trigger-width) max-w-[24em]"
                    sideOffset={6}
                >
                    <Command shouldFilter={false}>
                        <div className="flex items-center border-b border-brand-neutral-3 px-3">
                            <Icon icon="mage:search" className="size-4 text-brand-neutral-6 shrink-0 mr-2" />
                            <CommandInput
                                placeholder="Search events..."
                                value={search}
                                onValueChange={setSearch}
                                className="h-10 text-sm border-0 outline-none focus:ring-0 bg-transparent flex-1 placeholder:text-brand-neutral-5"
                            />
                            {loading && (
                                <Icon icon="svg-spinners:ring-resize" className="size-4 text-brand-primary-5 shrink-0" />
                            )}
                        </div>

                        <CommandList className="max-h-56 overflow-y-auto">
                            {!loading && events.length === 0 && (
                                <CommandEmpty className="py-8 text-center text-sm text-brand-secondary-7">
                                    {search ? `No events found for "${search}"` : "No events available."}
                                </CommandEmpty>
                            )}

                            {loading && events.length === 0 && (
                                <div className="py-8 flex flex-col items-center gap-2">
                                    <Icon icon="svg-spinners:3-dots-fade" className="size-6 text-brand-primary-5" />
                                    <p className="text-xs text-brand-neutral-7">Loading events...</p>
                                </div>
                            )}

                            <CommandGroup>
                                {events.map(event => (
                                    <CommandItem
                                        key={event.id}
                                        value={event.id}
                                        onSelect={() => {
                                            onValueChange(event.id)
                                            setOpen(false)
                                            setSearch("")
                                        }}
                                        className={cn(
                                            "cursor-pointer px-3 py-2 rounded-lg my-0.5 transition-colors",
                                            value === event.id && "bg-brand-primary-1"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <EventInfo
                                                variant="mobile"
                                                category={event.category}
                                                image={event.image}
                                                title={event.title}
                                            />
                                            {value === event.id && (
                                                <Icon icon="iconamoon:check-bold" className="size-4 text-brand-primary-6 shrink-0 ml-auto" />
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
        </div>
    )
}