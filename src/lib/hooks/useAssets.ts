import { useMemo } from 'react'

import type { AssetStatus, AssetWithRelations } from '@/lib/types'
import { canManage } from '@/lib/utils/permissions'
import { useAssetsStore } from '@/providers/AssetsProvider'
import { useAuth } from '@/providers/AuthProvider'

export type AssetFilters = {
  search?: string
  status?: AssetStatus | ''
  departmentId?: string
  categoryId?: string
}

export function useAssets(filters: AssetFilters = {}): {
  data: AssetWithRelations[]
  isLoading: boolean
} {
  const { assets } = useAssetsStore()
  const { user } = useAuth()

  const data = useMemo(() => {
    let result = assets

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
  }, [assets, user, filters.search, filters.status, filters.departmentId, filters.categoryId])

  return { data, isLoading: false }
}

export function useAsset(id: string): { data: AssetWithRelations | null; isLoading: boolean } {
  const { assets } = useAssetsStore()
  const data = useMemo(() => assets.find((a) => a.id === id) ?? null, [assets, id])
  return { data, isLoading: false }
}
