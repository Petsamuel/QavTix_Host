"use client"

import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

interface PaginationControlsProps {
  startIndex: number
  endIndex: number
  totalItems: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onNextPage: () => void
  onPreviousPage: () => void
  currentPage: number 
  isLoadingMore: boolean
  totalPages: number
  className?: string
}

export default function PaginationControls({
  hasNextPage,
  hasPreviousPage,
  onNextPage,
  onPreviousPage,
  currentPage,
  isLoadingMore,
  totalPages,
  className = ''
}: PaginationControlsProps) {
    
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }
  
  const pageNumbers = getPageNumbers()
  
  return (
    <div className={cn("flex items-center justify-between pt-4", className)}>
      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={onPreviousPage}
          disabled={!hasPreviousPage || isLoadingMore}
          className={cn(
              "p-2.5 rounded-md text-xs font-medium transition-all flex items-center gap-1",
              hasPreviousPage 
                  ? "bg-brand-primary-6 text-white hover:bg-brand-primary-7" 
                  : "bg-brand-neutral-3 text-brand-neutral-6 cursor-not-allowed"
          )}
          aria-label="Previous page"
        >
          <Icon icon="mdi:chevron-left" width="16" height="16" />
          <span className="hidden sm:inline">Prev</span>
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span 
                  key={`ellipsis-${index}`}
                    className="min-w-9 h-9 px-3 flex items-center justify-center text-xs text-brand-neutral-6"
                >
                  ...
                </span>
              )
            }
            
            const pageNum = page as number
            const isActive = pageNum === currentPage
            
            return (
              <span
                key={pageNum}
                className={cn(
                    "min-w-7 h-7 px-3 rounded-sm text-xs font-medium flex items-center justify-center transition-colors",
                    isActive
                        ? "bg-brand-primary-6 text-white"
                        : "bg-white text-neutral-8 border border-brand-neutral-3"
                )}
              >
                {pageNum}
              </span>
            )
          })}
        </div>
        
        {/* Next Button */}
        <button
          onClick={onNextPage}
          disabled={!hasNextPage || isLoadingMore}
          className={cn(
            "p-2.5 rounded-md text-xs font-medium transition-all flex items-center gap-1",
            hasNextPage 
              ? "bg-brand-primary-6 text-white hover:bg-brand-primary-7" 
              : "bg-brand-neutral-3 text-brand-neutral-5 cursor-not-allowed"
          )}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <Icon icon="mdi:chevron-right" width="16" height="16" />
        </button>
      </div>
    </div>
  )
}