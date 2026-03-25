import { useMemo } from 'react'

import type { AssetStatus, AssetWithRelations } from '@/lib/types'
import { canManage } from '@/lib/utils/permissions'
import { useAssetsStore } from '@/providers/AssetsProvider'
import { useAuth } from '@/providers/AuthProvider'
import { useOrgData } from '@/providers/OrgDataProvider'

export type AssetFilters = {
  search?: string
  status?: AssetStatus | ''
  departmentId?: string
  categoryId?: string
}

/** Enrich raw assets with resolved relation names from OrgDataProvider */
function useEnrichedAssets(): AssetWithRelations[] {
  const { assets } = useAssetsStore()
  const { departments, categories, locations, vendors } = useOrgData()

  return useMemo(() => {
    const deptMap = Object.fromEntries(departments.map((d) => [d.id, d.name]))
    const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))
    const locMap = Object.fromEntries(locations.map((l) => [l.id, l.name]))
    const venMap = Object.fromEntries(vendors.map((v) => [v.id, v.name]))

    return assets.map((a) => ({
      ...a,
      departmentName: a.departmentId ? (deptMap[a.departmentId] ?? a.departmentName) : null,
      categoryName: a.categoryId ? (catMap[a.categoryId] ?? a.categoryName) : null,
      locationName: a.locationId ? (locMap[a.locationId] ?? a.locationName) : null,
      vendorName: a.vendorId ? (venMap[a.vendorId] ?? a.vendorName) : null,
    }))
  }, [assets, departments, categories, locations, vendors])
}

export function useAssets(filters: AssetFilters = {}): {
  data: AssetWithRelations[]
  isLoading: boolean
} {
  const enriched = useEnrichedAssets()
  const { user } = useAuth()

  const data = useMemo(() => {
    let result = enriched

    // Scope to user's departments for editor/viewer
    if (user && !canManage(user.role)) {
      result = result.filter((a) => a.departmentId && user.departmentIds.includes(a.departmentId))
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.assetTag.toLowerCase().includes(q) ||
          a.categoryName?.toLowerCase().includes(q) ||
          a.departmentName?.toLowerCase().includes(q)
      )
    }

    if (filters.status) {
      result = result.filter((a) => a.status === filters.status)
    }

    if (filters.departmentId) {
      result = result.filter((a) => a.departmentId === filters.departmentId)
    }

    if (filters.categoryId) {
      result = result.filter((a) => a.categoryId === filters.categoryId)
    }

    return result
  }, [enriched, user, filters.search, filters.status, filters.departmentId, filters.categoryId])

  return { data, isLoading: false }
}

export function useAsset(id: string): { data: AssetWithRelations | null; isLoading: boolean } {
  const enriched = useEnrichedAssets()
  const data = useMemo(() => enriched.find((a) => a.id === id) ?? null, [enriched, id])
  return { data, isLoading: false }
}
