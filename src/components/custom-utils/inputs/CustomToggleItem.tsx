import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Controller } from "react-hook-form"
import { Icon } from "@iconify/react"

export function ToggleItem({
    control,
    name,
    label,
    disabled,
    onChange,
}: {
    control:    any
    name:       string
    label:      string
    disabled?:  boolean
    onChange?:  () => Promise<void>
}) {
    const [isSaving, setIsSaving] = useState(false)

    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-brand-secondary-9">{label}</span>

            <div className="relative w-10 h-6 flex justify-center items-center">
                {isSaving && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Icon icon="eos-icons:three-dots-loading" className="size-10 text-brand-primary-6" />
                    </div>
                )}
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Switch
                            checked={field.value}
                            disabled={isSaving || disabled}
                            onCheckedChange={async (checked) => {
                                field.onChange(checked)
                                if (!onChange) return
                                setIsSaving(true)
                                await onChange()
                                setIsSaving(false)
                            }}
                            className={`data-[state=checked]:bg-brand-primary-6 transition-opacity ${isSaving ? "opacity-0" : "opacity-100"}`}
                        />
                    )}
                />
            </div>
        </div>
    )
}