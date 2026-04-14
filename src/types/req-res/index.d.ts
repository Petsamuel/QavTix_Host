interface ApiResponse<T> {
    message: string
    status:  number
    data:    T
}

interface PaginatedResponse<T> {
    count:    number
    next:     number | null
    total_pages: number
    previous: number | null
    results:  T[]
}