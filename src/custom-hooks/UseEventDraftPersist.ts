import { useEffect, useCallback, useRef } from 'react'
import { CompleteEventFormData } from '@/schemas/create-event.schema'

const DRAFT_KEY = 'qavtix_event_draft'
const DRAFT_MAX_AGE = 1000 * 60 * 60 * 24 * 2

interface StoredDraft {
    data: Partial<CompleteEventFormData>
    savedAt: number   // timestamp
    version: number   // bump this if schema changes to avoid restoring stale shape
}

const CURRENT_VERSION = 1


export function readEventDraft(): Partial<CompleteEventFormData> | null {
    if (typeof window === 'undefined') return null

    try {
        const raw = localStorage.getItem(DRAFT_KEY)
        if (!raw) return null

        const stored: StoredDraft = JSON.parse(raw)

        if (stored.version !== CURRENT_VERSION) {
            localStorage.removeItem(DRAFT_KEY)
            return null
        }

        if (Date.now() - stored.savedAt > DRAFT_MAX_AGE) {
            localStorage.removeItem(DRAFT_KEY)
            return null
        }

        return stored.data
    } catch {
        localStorage.removeItem(DRAFT_KEY)
        return null
    }
}

export function writeEventDraft(data: Partial<CompleteEventFormData>): void {
    if (typeof window === 'undefined') return

    try {
        const stored: StoredDraft = {
            data: stripFiles(data),
            savedAt: Date.now(),
            version: CURRENT_VERSION,
        }
        localStorage.setItem(DRAFT_KEY, JSON.stringify(stored))
    } catch { }
}

export function clearEventDraft(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(DRAFT_KEY)
}

// File objects cannot round-trip through JSON.
// We keep string URLs (existing images from edit mode) and drop File instances.

function stripFiles(data: Partial<CompleteEventFormData>): Partial<CompleteEventFormData> {
    const clone = structuredClone(
        JSON.parse(JSON.stringify(data, (_key, value) => {
            if (value instanceof File) return undefined
            return value
        }))
    )
    return clone
}


import { Control, useWatch, useFormState } from "react-hook-form"

interface UseStepDraftSyncOptions<K extends keyof CompleteEventFormData> {
    stepKey: K
    control: Control<any>
    enabled: boolean
    eventData: Partial<CompleteEventFormData>
    /**
     * A boolean computed by the caller that must be true before anything is
     * written to localStorage.  Use it to confirm at least one meaningful
     * field has real content (e.g. `!!eventTitle?.trim()`).
     * Defaults to `true` when omitted so existing call-sites stay compatible.
     */
    hasMinimumData?: boolean
}

/**
 * Persists the event creation draft to localStorage in real-time as the user types.
 * Debounced to avoid hammering storage on every keystroke.
 *
 * Guards:
 *  - `enabled`        : false in edit/duplicate mode or while a draft decision is pending
 *  - `isDirty`        : the user must have actually changed a field
 *  - `hasMinimumData` : at least one meaningful field must contain real content
 *                       (prevents setValue side-effects from saving an empty shell)
 */
export function useStepDraftSync<K extends keyof CompleteEventFormData>({
    stepKey,
    control,
    enabled,
    eventData,
    hasMinimumData = true,
}: UseStepDraftSyncOptions<K>) {
    const currentValues = useWatch({ control })
    const { isDirty } = useFormState({ control })
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!enabled || !isDirty || !hasMinimumData) return

        if (timerRef.current) clearTimeout(timerRef.current)

        timerRef.current = setTimeout(() => {
            writeEventDraft({
                ...eventData,
                [stepKey]: currentValues
            })
        }, 800)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [currentValues, eventData, enabled, stepKey, isDirty, hasMinimumData])
}