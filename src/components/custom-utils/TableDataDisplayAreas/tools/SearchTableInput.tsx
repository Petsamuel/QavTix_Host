'use client'
import { useState, useCallback, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface SearchTableInputProps {
    placeholder?:    string
    className?:      string
    debounceMs?:     number
    currentSearch?:   string
    onSearch?:       (query: string) => void
}

export default function SearchTableInput1({
    placeholder = 'Search...',
    className,
    onSearch,
    currentSearch
}: SearchTableInputProps) {

    const [isFocused,    setIsFocused]    = useState(false)
    const [searchValue,  setSearchValue]  = useState(currentSearch || '')

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setSearchValue(val)
        onSearch?.(val)
    }, [onSearch])

    const handleClear = useCallback(() => {
        setSearchValue('')
        onSearch?.('')
    }, [onSearch])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') handleClear()
    }

    useEffect(() => {
    setSearchValue(currentSearch || "")
    },[currentSearch])

    return (
        <div className={cn('w-full', className)}>
            <div className={cn(
                'relative flex flex-row-reverse w-full items-center gap-2 px-4 py-3',
                'rounded-lg border h-11 text-sm transition-all duration-200 bg-brand-secondary-1',
                isFocused
                    ? 'border-[1.6px] border-brand-secondary-5'
                    : 'border-[0.5px] border-brand-secondary-3 hover:border-brand-secondary-4'
            )}>
                <input
                    type="text"
                    value={searchValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 outline-none h-full bg-transparent text-sm text-brand-neutral-9 placeholder:text-neutral-6"
                />

                {searchValue ? (
                    <button onClick={handleClear} className="shrink-0">
                        <Icon
                            icon="lucide:x"
                            className="size-5 text-brand-neutral-6 hover:text-brand-secondary-8 transition-colors"
                        />
                    </button>
                ) : (
                    <Icon
                        icon="lucide:search"
                        className={cn(
                            'size-6 shrink-0 transition-colors',
                            isFocused ? 'text-brand-secondary-5' : 'text-brand-neutral-6'
                        )}
                    />
                )}
            </div>
        </div>
    )
}