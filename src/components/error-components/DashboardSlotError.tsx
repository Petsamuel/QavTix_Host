"use client"

import { Icon } from '@iconify/react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export default function DashboardSlotError({ title, desc }:{ title: string, desc: string}) {

    const router = useRouter()

    return (
        <div className="rounded-2xl w-full h-100 bg-white border border-brand-neutral-2 overflow-hidden flex flex-col items-center justify-center gap-3 text-center px-6">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Icon icon="hugeicons:alert-02" className="w-6 h-6 text-red-400" />
            </div>
            <div className="space-y-1">
                <p className="text-sm font-semibold text-brand-secondary-8">
                    {title}
                </p>
                <p className="text-xs text-brand-neutral-6">
                   {desc}
                </p>

                <Button onClick={() => router.refresh()} variant="outline" className='text-xs mt-3 py-3 font-medium'>Retry</Button>
            </div>
        </div>
    )
}