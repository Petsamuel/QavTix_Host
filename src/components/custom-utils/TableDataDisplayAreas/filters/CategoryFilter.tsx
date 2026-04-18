'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/custom-hooks/UseMediaQuery'
import CategoryItemBtn from './buttons-and-inputs/CategoryItemBtn'
import EventFilterTypeBtn from './buttons-and-inputs/EventFilterTypeBtn'
import FilterButtonsActions1 from './buttons-and-inputs/FilterActionButtons1'
import { MobileBottomSheet } from '../../dropdown/EventFilterDropdownMobileBottomSheet'


interface CategoryFilterProps {
    value?: string[]
    onChange: (value: string[]) => void
    categories?: Category[]
}

export default function CategoryFilter({
    value = [],
    onChange,
    categories = [],
}: CategoryFilterProps) {

    
    const [isOpen, setIsOpen] = useState(false)
    const isTablet = useMediaQuery('(min-width: 768px)')
    
    const [selectedCategories, setSelectedCategories] = useState<string[]>(value)

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (open) {
            setSelectedCategories(value)
        }
    }

    const handleToggle = (categoryValue: string) => {
        if (categoryValue === 'all') {
            setSelectedCategories([])
            return
        }

        setSelectedCategories((prev) =>
            prev.includes(categoryValue)
                ? prev.filter((v) => v !== categoryValue)
                : [...prev, categoryValue]
        )
    }

    const handleApply = () => {
        onChange(selectedCategories)
        setIsOpen(false)
    }

    const handleClear = () => {
        setSelectedCategories([])
    }

    const hasActiveFilter = value.length > 0
    const displayText = hasActiveFilter
        ? `${value.length} selected`
        : 'Event category'
    

    const categoryList = (
        <div className="space-y-1 max-h-[50vh] overflow-y-auto md:max-h-[unset]">
            {categories.map((category, index) => {
                const isSelected =
                    category.value === 'all'
                        ? selectedCategories.length === 0
                        : selectedCategories.includes(category.value)

                return (
                    <CategoryItemBtn
                        key={index}
                        category={category}
                        isSelected={isSelected}
                        handleToggle={handleToggle} // Only updates local state
                    />
                )
            })}
        </div>
    )

    return (
        <>
            {/* Mobile & Tablet - Bottom Sheet */}
            {!isTablet && (
                <>
                    <EventFilterTypeBtn 
                        onClick={() => setIsOpen(true)}
                        displayText={displayText} 
                        hasActiveFilter={hasActiveFilter}
                    />

                    <MobileBottomSheet
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Event Category"
                    >
                        {categoryList}
                        <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                    </MobileBottomSheet>
                </>
            )}

            {/* Tablet - Dropdown Menu */}
            {isTablet && (
                <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
                    <DropdownMenuTrigger asChild>
                        <EventFilterTypeBtn 
                            displayText={displayText} 
                            hasActiveFilter={hasActiveFilter}
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                        className={cn(
                            "w-full min-w-[18em] z-100! p-4 rounded-xl shadow-[0px_3.69px_14.76px_0px_rgba(51,38,174,0.08)]",
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
                        align="start"
                    >
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-900">Category</h3>
                            {categoryList}
                            <FilterButtonsActions1 onApply={handleApply} onClear={handleClear} />
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>
    )
}