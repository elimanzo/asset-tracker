/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import type { AssetFormInput } from '@/lib/types'

import { createAsset, deleteAsset } from '../assets'

vi.mock('@/lib/supabase/server')
vi.mock('@/lib/supabase/admin')

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeInput(overrides: Partial<AssetFormInput> = {}): AssetFormInput {
  return {
    name: 'Test Laptop',
    assetTag: 'AST-00001',
    isBulk: false,
    quantity: null,
    categoryId: null,
    departmentId: null,
    locationId: null,
    status: 'active',
    purchaseDate: null,
    purchaseCost: null,
    warrantyExpiry: null,
    vendorId: null,
    ...overrides,
  }
}

function makeChain() {
  return {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    gt: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    then: vi
      .fn()
      .mockImplementation((resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
        Promise.resolve({ data: null, error: null }).then(resolve, reject)
      ),
  }
}

let chain: ReturnType<typeof makeChain>

function setupAuthenticatedUser(userId = 'user-0001') {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: userId } } }),
    },
  } as any)
  vi.mocked(createAdminClient).mockReturnValue({
    from: vi.fn().mockReturnValue(chain),
    auth: { admin: {} },
  } as any)
  // getContext maybeSingle: org profile
  chain.maybeSingle.mockResolvedValueOnce({
    data: { org_id: 'org-0001', full_name: 'Test User' },
  })
}

function setupUnauthenticated() {
  vi.mocked(createClient).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
  } as any)
  vi.mocked(createAdminClient).mockReturnValue({
    from: vi.fn().mockReturnValue(chain),
    auth: { admin: {} },
  } as any)
}

beforeEach(() => {
  chain = makeChain()
})

// ---------------------------------------------------------------------------
// createAsset
// ---------------------------------------------------------------------------

describe('createAsset', () => {
  it('returns validation error when name is too short', async () => {
    const result = await createAsset(makeInput({ name: 'X' }))
    expect(result).toMatchObject({ error: expect.stringContaining('2 characters') })
  })

  it('returns error when user is not authenticated', async () => {
    setupUnauthenticated()
    const result = await createAsset(makeInput())
    expect(result).toEqual({ error: 'Not authenticated' })
  })

  it('returns friendly error on duplicate asset tag (23505)', async () => {
    setupAuthenticatedUser()
    chain.single.mockResolvedValueOnce({
      data: null,
      error: { code: '23505', message: 'unique violation' },
    })

    const result = await createAsset(makeInput())
    expect(result).toEqual({ error: 'Asset tag already exists. Use a unique tag.' })
  })

  it('returns the new asset id on success', async () => {
    setupAuthenticatedUser()
    chain.single.mockResolvedValueOnce({ data: { id: 'asset-new-001' }, error: null })

    const result = await createAsset(makeInput())
    expect(result).toEqual({ id: 'asset-new-001' })
  })
})

// ---------------------------------------------------------------------------
// deleteAsset
// ---------------------------------------------------------------------------

describe('deleteAsset', () => {
  it('returns error when user is not authenticated', async () => {
    setupUnauthenticated()
    const result = await deleteAsset('asset-0001')
    expect(result).toEqual({ error: 'Not authenticated' })
  })

  it('returns error when the database update fails', async () => {
    setupAuthenticatedUser()
    // maybySingle #2: asset name lookup
    chain.maybeSingle.mockResolvedValueOnce({ data: { name: 'Test Laptop' } })
    // then: assets update → DB error
    chain.then.mockImplementationOnce(
      (resolve: (v: unknown) => void, reject: (e: unknown) => void) =>
        Promise.resolve({ data: null, error: { message: 'Row not found' } }).then(resolve, reject)
    )

    const result = await deleteAsset('asset-0001')
    expect(result).toEqual({ error: 'Row not found' })
  })

  it('returns null on successful soft-delete', async () => {
    setupAuthenticatedUser()
    // maybySingle #2: asset name lookup
    chain.maybeSingle.mockResolvedValueOnce({ data: { name: 'Test Laptop' } })

    const result = await deleteAsset('asset-0001')
    expect(result).toBeNull()
  })
})
