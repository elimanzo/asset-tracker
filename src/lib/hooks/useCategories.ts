import type { Category } from '@/lib/types'
import { useOrgData } from '@/providers/OrgDataProvider'

export function useCategories(): { data: Category[]; isLoading: boolean } {
  const { categories } = useOrgData()
  return { data: categories, isLoading: false }
}
