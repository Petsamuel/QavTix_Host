"use client"

import { useState, useEffect, useRef } from "react"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"
import EmailTemplateEditor from "@/components/custom-utils/email-template-editor/EmailTemplateEditor"
import { AnimatedDialog } from "@/components/custom-utils/dialogs/AnimatedDialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { getUpcomingEvents } from "@/actions/dashboard/client"
import EventInfo from "@/components/custom-utils/event/EventInfo"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface AddPromoCodeProps {
    className?: string
}

interface EventOption {
    id:       string
    title:    string
    category: string
    image:    string
}

export default function ComposeMailBtn({ className }: AddPromoCodeProps) {
    // Modal states
    const [showEventModal, setShowEventModal] = useState(false)
    const [showMailModal, setShowMailModal]   = useState(false)
    
    // Data states
    const [selectedEvent, setSelectedEvent] = useState<{ id: string, campaignName: string } | null>(null)
    const [search, setSearch]                   = useState("")
    const [events, setEvents]                   = useState<EventOption[]>([])
    const [loading, setLoading]                 = useState(false)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const fetchEvents = async (query: string) => {
        setLoading(true)
        try {
            const result = await getUpcomingEvents({ search: query })
            if (result.success && result.data?.results) {
                setEvents(
                    result.data.results.map((v: any) => ({
                        category: v.category,
                        id:       v.id,
                        image:    v.event_image?.image_url,
                        title:    v.title,
                    }))
                )
            } else {
                setEvents([])
            }
        } catch (error) {
            console.error("Failed to fetch events:", error)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    // Load initial events when popover opens
    useEffect(() => {
        if (showEventModal && events.length === 0) {
            fetchEvents("")
        }
    }, [showEventModal, events.length])

    // Debounced search
    useEffect(() => {
        if (!showEventModal) return
        
        if (debounceRef.current) clearTimeout(debounceRef.current)
        
        debounceRef.current = setTimeout(() => {
            fetchEvents(search)
        }, 400)
        
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [search, showEventModal])

    const handleEventSelect = (eventId: string, campaignName: string) => {
        setSelectedEvent({ id: eventId, campaignName })
        setShowEventModal(false)
        
        setTimeout(() => {
            setShowMailModal(true)
        }, 300) 
    }

    const handleCloseEventModal = () => {
        setShowEventModal(false)
        setSearch("") 
    }

    return (
        <>
            <button
                onClick={() => setShowEventModal(true)}
                className={cn(
                    'flex items-center rounded justify-between text-xs md:text-sm font-bold gap-2 bg-brand-primary-1 p-1.5 transition-opacity',
                    'text-brand-primary-6 hover:text-brand-primary-7 hover:bg-brand-primary-2 transition-colors ease-in-out duration-200',
                    className
                )}
            >
                <span className={cn(
                    'w-6 aspect-square rounded flex justify-center items-center text-white',
                    'bg-brand-primary-3'
                )}>
                    <Icon icon="pajamas:export" width="16" height="16" />
                </span>
                <span>Compose Mail</span>
            </button>

            <AnimatedDialog 
                open={showEventModal} 
                onOpenChange={handleCloseEventModal}
                showCloseButton={false}
                className='md:max-w-md p-0 overflow-hidden'
            >
                <div className="flex flex-col">
                    <div className="p-5 border-b border-brand-neutral-3 relative">
                        <DialogTitle className="text-lg font-bold text-brand-secondary-9">Select an Event</DialogTitle>
                        <DialogDescription className="text-sm text-brand-secondary-6 mt-1">
                            Which event is this email campaign for?
                        </DialogDescription>
                        
                        <button 
                            onClick={handleCloseEventModal} 
                            className='absolute top-5 right-5 text-brand-neutral-7/80 hover:text-brand-neutral-6 transition-colors' 
                            aria-label="close modal"
                        >
                            <Icon icon="line-md:close-circle-filled" width="24" height="24" className='size-6' />
                        </button>
                    </div>

                    <Command shouldFilter={false} className="border-none rounded-none">
                        <div className="flex items-center border-b border-brand-neutral-3 px-4">
                            <Icon icon="mage:search" className="size-5 text-brand-neutral-6 shrink-0 mr-3" />
                            <CommandInput
                                placeholder="Search upcoming events..."
                                value={search}
                                onValueChange={setSearch}
                                className="h-12 text-sm border-0 outline-none focus:ring-0 bg-transparent flex-1 placeholder:text-brand-neutral-5"
                            />
                            {loading && (
                                <Icon icon="svg-spinners:ring-resize" className="size-4 text-brand-primary-5 shrink-0" />
                            )}
                        </div>

                        <CommandList className="max-h-80 overflow-y-auto p-2">
                            {!loading && events.length === 0 && (
                                <CommandEmpty className="py-10 text-center text-sm text-brand-secondary-7">
                                    {search ? `No events found for "${search}"` : "No events available."}
                                </CommandEmpty>
                            )}

                            {loading && events.length === 0 && (
                                <div className="py-10 flex flex-col items-center gap-3">
                                    <Icon icon="svg-spinners:3-dots-fade" className="size-6 text-brand-primary-5" />
                                    <p className="text-xs text-brand-neutral-7">Searching events...</p>
                                </div>
                            )}

                            <CommandGroup>
                                {events.map(event => (
                                    <CommandItem
                                        key={event.id}
                                        value={event.id}
                                        onSelect={() => handleEventSelect(event.id, event.title)}
                                        className={cn(
                                            "cursor-pointer px-3 py-3 rounded-lg mb-1 transition-colors",
                                            "hover:bg-brand-primary-1 data-[selected=true]:bg-brand-primary-1"
                                        )}
                                    >
                                        <div className="flex items-center gap-2 w-full">
                                            <EventInfo
                                                variant="mobile"
                                                category={event.category}
                                                image={event.image}
                                                title={event.title}
                                            />
                                            <Icon 
                                                icon="tabler:chevron-right" 
                                                className="size-5 text-brand-neutral-5 shrink-0 ml-auto" 
                                            />
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            </AnimatedDialog>

            {selectedEvent && (
                <EmailTemplateEditor 
                    open={showMailModal} 
                    setOpen={setShowMailModal} 
                    eventID={selectedEvent.id}
                    onClose={() => setSelectedEvent(null)}
                    campaignName={selectedEvent.campaignName}
                />
            )}
        </>
    )
}