import { z } from 'zod'

// ---------------------------------------------------------------------------
// Location
// ---------------------------------------------------------------------------

export const LocationSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).nullable(),
  deletedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
})

export type Location = z.infer<typeof LocationSchema>

// ---------------------------------------------------------------------------
// Create / update forms
// ---------------------------------------------------------------------------

export const LocationFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional(),
})

export type LocationFormInput = z.infer<typeof LocationFormSchema>
