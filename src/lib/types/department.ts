import { z } from 'zod'

// ---------------------------------------------------------------------------
// Department
// ---------------------------------------------------------------------------

export const DepartmentSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  deletedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Department = z.infer<typeof DepartmentSchema>

// ---------------------------------------------------------------------------
// Create / update forms
// ---------------------------------------------------------------------------

export const DepartmentFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
})

export type DepartmentFormInput = z.infer<typeof DepartmentFormSchema>

// ---------------------------------------------------------------------------
// Department with asset count (for display)
// ---------------------------------------------------------------------------

export type DepartmentWithStats = Department & {
  assetCount: number
  memberCount: number
}
