import { z } from 'zod'

// ---------------------------------------------------------------------------
// Vendor
// ---------------------------------------------------------------------------

export const VendorSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  name: z.string().min(1).max(100),
  contactEmail: z.string().email().nullable(),
  contactPhone: z.string().max(30).nullable(),
  website: z.string().url().nullable(),
  notes: z.string().max(1000).nullable(),
  deletedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
})

export type Vendor = z.infer<typeof VendorSchema>

// ---------------------------------------------------------------------------
// Create / update forms
// ---------------------------------------------------------------------------

export const VendorFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  contactEmail: z.string().email('Enter a valid email').optional().or(z.literal('')),
  contactPhone: z.string().max(30).optional(),
  website: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  notes: z.string().max(1000).optional(),
})

export type VendorFormInput = z.infer<typeof VendorFormSchema>
