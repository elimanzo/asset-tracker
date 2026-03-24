import { z } from 'zod'

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
})

export type Pagination = z.infer<typeof PaginationSchema>

export type PaginatedResult<T> = {
  data: T[]
  pagination: Pagination
}

// ---------------------------------------------------------------------------
// API response wrapper (for Phase 2 compatibility)
// ---------------------------------------------------------------------------

export type ApiSuccess<T> = { success: true; data: T }
export type ApiError = { success: false; error: string }
export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ---------------------------------------------------------------------------
// Sort / filter helpers
// ---------------------------------------------------------------------------

export type SortDirection = 'asc' | 'desc'

export type SortState = {
  field: string
  direction: SortDirection
}
