export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

export interface ApiError {
  error: string
  details?: string
}

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: string
  ) {
    super(message)
    this.name = 'ApiException'
  }
}
