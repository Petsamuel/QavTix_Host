// handleApiErrors.ts

type ApiErrorResponse =
  | string
  | { message: string }
  | Record<string, string | string[]>
  | unknown

function formatFieldName(fieldName: string): string {
  return fieldName
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

export function handleApiError(errorData: ApiErrorResponse): string {
  if (typeof errorData === 'string') return errorData

  if (!errorData || typeof errorData !== 'object') return 'An error occurred'
  const errorObj = errorData as Record<string, any>

  // 1. If it's the { message: { ... } } pattern, dig into message
  if ('message' in errorObj && typeof errorObj.message === 'object' && errorObj.message !== null) {
    return handleApiError(errorObj.message)
  }

  // 2. If message is a string
  if ('message' in errorObj && typeof errorObj.message === 'string') {
    return errorObj.message
  }

  // 3. Django non_field_errors
  if ('non_field_errors' in errorObj) {
    const errs = errorObj.non_field_errors
    if (Array.isArray(errs) && errs.length > 0) return String(errs[0])
    if (typeof errs === 'string') return errs
  }

  // 4. DRF detail
  if ('detail' in errorObj && typeof errorObj.detail === 'string') {
    return errorObj.detail
  }

  // 5. Recursive Field-specific errors
  for (const key of Object.keys(errorObj)) {
    const val = errorObj[key]
    if (val === null || val === undefined) continue
    
    if (Array.isArray(val) && val.length > 0) {
      const first = val[0]
      if (typeof first === 'string') return `${formatFieldName(key)}: ${first}`
      if (typeof first === 'object') return `${formatFieldName(key)}: ${handleApiError(first)}`
    }

    if (typeof val === 'object' && !Array.isArray(val)) {
      const nested = handleApiError(val)
      if (nested && !nested.includes('An error occurred')) return `${formatFieldName(key)}: ${nested}`
    }

    if (typeof val === 'string') return `${formatFieldName(key)}: ${val}`
  }

  return 'An error occurred while processing your request'
}