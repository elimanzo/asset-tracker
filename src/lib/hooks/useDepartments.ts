import type { Department } from '@/lib/types'
import { useOrgData } from '@/providers/OrgDataProvider'

export function useDepartments(): { data: Department[]; isLoading: boolean } {
  const { departments } = useOrgData()
  return { data: departments, isLoading: false }
}
