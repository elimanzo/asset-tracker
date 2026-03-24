import { z } from 'zod'

// ---------------------------------------------------------------------------
// Organization
// ---------------------------------------------------------------------------

export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
  ownerId: z.string().uuid(),
  logoUrl: z.string().url().nullable(),
  onboardingCompleted: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type Organization = z.infer<typeof OrganizationSchema>

// ---------------------------------------------------------------------------
// Create / update forms
// ---------------------------------------------------------------------------

export const CreateOrganizationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
})

export type CreateOrganizationInput = z.infer<typeof CreateOrganizationSchema>

export const UpdateOrganizationSchema = CreateOrganizationSchema.partial()

export type UpdateOrganizationInput = z.infer<typeof UpdateOrganizationSchema>
