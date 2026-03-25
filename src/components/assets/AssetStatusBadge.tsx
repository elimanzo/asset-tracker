import { Badge } from '@/components/ui/badge'
import { ASSET_STATUS_CONFIG } from '@/lib/constants'
import type { AssetStatus } from '@/lib/types'

interface AssetStatusBadgeProps {
  status: AssetStatus
}

export function AssetStatusBadge({ status }: AssetStatusBadgeProps) {
  const config = ASSET_STATUS_CONFIG[status]
  return <Badge variant={config.badgeVariant}>{config.label}</Badge>
}
