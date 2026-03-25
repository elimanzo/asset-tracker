import type { Vendor } from '@/lib/types'
import { useOrgData } from '@/providers/OrgDataProvider'

export function useVendors(): { data: Vendor[]; isLoading: boolean } {
  const { vendors } = useOrgData()
  return { data: vendors, isLoading: false }
}
