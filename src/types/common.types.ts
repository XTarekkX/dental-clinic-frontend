export interface ApiErrorResponse {
  success: false
  status: number
  message: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}