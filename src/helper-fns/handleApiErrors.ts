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

  if (errorData && typeof errorData === 'object' && 'message' in errorData &&
    typeof (errorData as any).message === 'string') {
    return (errorData as any).message
  }

  if (errorData && typeof errorData === 'object') {
    const errorObj = errorData as Record<string, unknown>

    // non_field_errors — Django's way of saying "this isn't tied to a specific field"
    // Return the message directly without the ugly field name prefix
    if ('non_field_errors' in errorObj) {
      const errs = errorObj.non_field_errors
      if (Array.isArray(errs) && errs.length > 0) return String(errs[0])
      if (typeof errs === 'string') return errs
    }

    // detail — DRF generic error
    if ('detail' in errorObj && typeof errorObj.detail === 'string') {
      return errorObj.detail
    }

    // Field-specific errors
    const firstField = Object.keys(errorObj)[0]
    if (firstField) {
      const fieldErrors = errorObj[firstField]

      if (Array.isArray(fieldErrors) && fieldErrors.length > 0 &&
          typeof fieldErrors[0] === 'string') {
          return `${formatFieldName(firstField)}: ${fieldErrors[0]}`
      }

      if (typeof fieldErrors === 'string') return `Error: ${fieldErrors}`
    }
  }

  return 'An error occurred while processing your request'
}