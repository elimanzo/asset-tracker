import { differenceInDays, parseISO } from 'date-fns'

import { WARRANTY_ALERT_DAYS } from '@/lib/constants'
import type { DashboardStats } from '@/lib/types'

import { MOCK_ASSETS } from './assets'

function computeDashboardStats(): DashboardStats {
  const activeAssets = MOCK_ASSETS.filter((a) => a.deletedAt === null)

  // Total value
  const totalValue = activeAssets.reduce((sum, a) => sum + (a.purchaseCost ?? 0), 0)

  // By status
  const statusCounts = new Map<string, number>()
  for (const asset of activeAssets) {
    statusCounts.set(asset.status, (statusCounts.get(asset.status) ?? 0) + 1)
  }

  const byStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status: status as DashboardStats['byStatus'][number]['status'],
    count,
  }))

  // By department
  const deptMap = new Map<string, { name: string; count: number; value: number }>()
  for (const asset of activeAssets) {
    if (!asset.departmentId || !asset.departmentName) continue
    const existing = deptMap.get(asset.departmentId) ?? {
      name: asset.departmentName,
      count: 0,
      value: 0,
    }
    deptMap.set(asset.departmentId, {
      name: existing.name,
      count: existing.count + 1,
      value: existing.value + (asset.purchaseCost ?? 0),
    })
  }

  const byDepartment = Array.from(deptMap.entries()).map(([id, { name, count, value }]) => ({
    departmentId: id,
    departmentName: name,
    count,
    value,
  }))

  // Warranty alerts
  const today = new Date()
  const warrantyAlerts = activeAssets
    .filter((a) => {
      if (!a.warrantyExpiry) return false
      const days = differenceInDays(parseISO(a.warrantyExpiry), today)
      return days >= 0 && days <= WARRANTY_ALERT_DAYS
    })
    .map((a) => ({
      assetId: a.id,
      assetTag: a.assetTag,
      assetName: a.name,
      departmentName: a.departmentName,
      warrantyExpiry: a.warrantyExpiry!,
      daysRemaining: differenceInDays(parseISO(a.warrantyExpiry!), today),
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining)

  return {
    totalAssets: activeAssets.length,
    totalValue,
    byStatus,
    byDepartment,
    warrantyAlerts,
    recentActivityCount: 8,
  }
}

export const MOCK_DASHBOARD_STATS: DashboardStats = computeDashboardStats()
