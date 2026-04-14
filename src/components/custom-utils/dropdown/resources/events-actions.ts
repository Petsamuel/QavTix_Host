export type EventAction = {
    id: string
    label: string
    icon: string
    variant?: 'default' | 'danger'
    requiresConfirmation?: boolean
    onClick?: () => void | Promise<void>
}

export const liveEventActions: EventAction[] = [
    {
        id: 'edit',
        label: 'Edit Event',
        icon: 'hugeicons:pencil-edit-01',
    },
    {
        id: 'duplicate',
        label: 'Duplicate Event',
        icon: 'system-uicons:duplicate',
    },
    {
        id: 'view',
        label: 'View On Site',
        icon: 'uil:search',
    },
    {
        id: 'download',
        label: 'Download Attendee List',
        icon: 'hugeicons:download-01',
    },
    {
        id: 'send-update',
        label: 'Send Update to Buyers',
        icon: 'lucide:mail',
    },
    {
        id: 'share',
        label: 'Share Event Link',
        icon: 'mynaui:send-solid',
    },
    {
        id: 'feature',
        label: 'Add to Featured',
        icon: 'flowbite:rectangle-list-outline',
    },
    {
        id: 'unpublish',
        label: 'Unpublish Event',
        icon: 'octicon:eye-closed-24',
    },
    {
        id: 'cancel',
        label: 'Cancel Event',
        icon: 'iconoir:cancel',
        variant: 'danger',
    },
    {
        id: 'delete',
        label: 'Delete Event',
        icon: 'hugeicons:delete-02',
        variant: 'danger',
    }
]



export const endedEventActions: EventAction[] = [
    {
        id: 'edit',
        label: 'Edit Event',
        icon: 'hugeicons:pencil-edit-01',
    },
    {
        id: 'download',
        label: 'Download Attendee List',
        icon: 'hugeicons:download-01',
    },
    {
        id: 'send-update',
        label: 'Send Update to Buyers',
        icon: 'lucide:mail',
    },
    {
        id: 'delete',
        label: 'Delete Event',
        icon: 'hugeicons:delete-02',
        variant: 'danger',
    }
]
