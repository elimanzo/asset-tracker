import { z } from 'zod'

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

export const CategorySchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  icon: z.string().nullable(), // Lucide icon name
  deletedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Category = z.infer<typeof CategorySchema>

// ---------------------------------------------------------------------------
// Create / update forms
// ---------------------------------------------------------------------------

export const CategoryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
})

export type CategoryFormInput = z.infer<typeof CategoryFormSchema>

// ---------------------------------------------------------------------------
// Category with asset count (for display)
// ---------------------------------------------------------------------------

export type CategoryWithStats = Category & {
  assetCount: number
}
