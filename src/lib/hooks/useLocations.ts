import type { Location } from '@/lib/types'
import { useOrgData } from '@/providers/OrgDataProvider'

export function useLocations(): { data: Location[]; isLoading: boolean } {
  const { locations } = useOrgData()
  return { data: locations, isLoading: false }
}
