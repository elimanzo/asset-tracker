'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { toast } from 'sonner'

import { MOCK_ASSETS } from '@/lib/mock-data'
import type {
  AssetAssignment,
  AssetFormInput,
  AssetWithRelations,
  CheckoutFormInput,
} from '@/lib/types'
import { generateAssetTag } from '@/lib/utils/formatters'

type AssetsContextValue = {
  assets: AssetWithRelations[]
  createAsset: (input: AssetFormInput, createdBy: string) => AssetWithRelations
  updateAsset: (id: string, input: AssetFormInput, updatedBy: string) => void
  deleteAsset: (id: string) => void
  checkoutAsset: (
    id: string,
    input: CheckoutFormInput,
    assignedBy: string,
    assignedByName: string
  ) => void
  returnAsset: (id: string) => void
}

const AssetsContext = createContext<AssetsContextValue | null>(null)

export function AssetsProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<AssetWithRelations[]>(() =>
    MOCK_ASSETS.filter((a) => a.deletedAt === null)
  )

  const createAsset = useCallback(
    (input: AssetFormInput, createdBy: string): AssetWithRelations => {
      const now = new Date().toISOString()
      const newAsset: AssetWithRelations = {
        id: `ast-${Date.now()}`,
        orgId: 'org-acme-0001',
        assetTag: input.assetTag,
        name: input.name,
        categoryId: input.categoryId,
        categoryName: null,
        departmentId: input.departmentId,
        departmentName: null,
        locationId: input.locationId ?? null,
        locationName: null,
        status: input.status,
        purchaseDate: input.purchaseDate ?? null,
        purchaseCost: input.purchaseCost ?? null,
        warrantyExpiry: input.warrantyExpiry ?? null,
        vendorId: input.vendorId ?? null,
        vendorName: null,
        notes: input.notes ?? null,
        imageUrl: input.imageUrl ?? null,
        currentAssignment: null,
        deletedAt: null,
        createdAt: now,
        updatedAt: now,
        createdBy,
        updatedBy: createdBy,
      }
      setAssets((prev) => [newAsset, ...prev])
      return newAsset
    },
    []
  )

  const updateAsset = useCallback((id: string, input: AssetFormInput, updatedBy: string) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              ...input,
              locationId: input.locationId ?? null,
              purchaseDate: input.purchaseDate ?? null,
              purchaseCost: input.purchaseCost ?? null,
              warrantyExpiry: input.warrantyExpiry ?? null,
              vendorId: input.vendorId ?? null,
              notes: input.notes ?? null,
              updatedAt: new Date().toISOString(),
              updatedBy,
            }
          : a
      )
    )
  }, [])

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id))
    toast.success('Asset deleted')
  }, [])

  const checkoutAsset = useCallback(
    (id: string, input: CheckoutFormInput, assignedBy: string, assignedByName: string) => {
      const assignment: AssetAssignment = {
        id: `asgn-${Date.now()}`,
        assetId: id,
        assignedToUserId: input.assignedToUserId,
        assignedToName: input.assignedToName,
        assignedBy,
        assignedByName,
        assignedAt: new Date().toISOString(),
        expectedReturnAt: input.expectedReturnAt ?? null,
        returnedAt: null,
        notes: input.notes ?? null,
      }
      setAssets((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, status: 'checked_out', currentAssignment: assignment } : a
        )
      )
      toast.success(`Asset checked out to ${input.assignedToName}`)
    },
    []
  )

  const returnAsset = useCallback((id: string) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'active',
              currentAssignment: a.currentAssignment
                ? { ...a.currentAssignment, returnedAt: new Date().toISOString() }
                : null,
            }
          : a
      )
    )
    toast.success('Asset returned successfully')
  }, [])

  return (
    <AssetsContext.Provider
      value={{ assets, createAsset, updateAsset, deleteAsset, checkoutAsset, returnAsset }}
    >
      {children}
    </AssetsContext.Provider>
  )
}

export function useAssetsStore(): AssetsContextValue {
  const ctx = useContext(AssetsContext)
  if (!ctx) throw new Error('useAssetsStore must be used within <AssetsProvider>')
  return ctx
}

/** Generate the next asset tag based on current assets */
export function useNextAssetTag(): string {
  const { assets } = useAssetsStore()
  return generateAssetTag(assets.length + 1)
}
