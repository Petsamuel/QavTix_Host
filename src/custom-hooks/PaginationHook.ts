import { useEffect, useMemo, useState } from "react"

export interface PaginationResult<T> {
  currentPage: number
  totalPages: number
  pageSize: number
  totalItems: number
  currentItems: T[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  startIndex: number
  endIndex: number
  remainingItems: number
  nextPage: () => void
  previousPage: () => void
  goToPage: (page: number) => void
  setPageSize: (size: number) => void
}

export function usePagination<T>(
  data: T[],
  pageSizeInput: number = 12
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeInput)

  useEffect(() => {
    setPageSize(pageSizeInput)
    setCurrentPage(1)
  }, [pageSizeInput])

  const paginationData = useMemo(() => {
    const totalItems = data.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalItems)
    const currentItems = data.slice(startIndex, endIndex)
    const remainingItems = Math.max(0, totalItems - endIndex)

    return {
      currentPage,
      totalPages,
      pageSize,
      totalItems,
      currentItems,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      startIndex: startIndex + 1,
      endIndex,
      remainingItems
    }
  }, [data, currentPage, pageSize])

  const nextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(p => p + 1)
    }
  }

  const previousPage = () => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage(p => p - 1)
    }
  }

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, paginationData.totalPages))
    setCurrentPage(validPage)
  }

  const updatePageSize = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return {
    ...paginationData,
    nextPage,
    previousPage,
    goToPage,
    setPageSize: updatePageSize
  }
}
