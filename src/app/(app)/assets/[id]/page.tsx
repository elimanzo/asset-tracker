'use client'

import { ArrowLeft, LogIn, LogOut, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'
import { use, useState } from 'react'

import { AssetStatusBadge } from '@/components/assets/AssetStatusBadge'
import { CheckoutModal } from '@/components/assets/CheckoutModal'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAsset } from '@/lib/hooks/useAssets'
import { getAssetAuditLogs } from '@/lib/mock-data'
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/utils/formatters'
import { canEdit } from '@/lib/utils/permissions'
import { useAssetsStore } from '@/providers/AssetsProvider'
import { useAuth } from '@/providers/AuthProvider'

interface AssetDetailPageProps {
  params: Promise<{ id: string }>
}

export default function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { id } = use(params)
  const { data: asset } = useAsset(id)
  const { deleteAsset, returnAsset } = useAssetsStore()
  const { user } = useAuth()
  const router = useRouter()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!asset) notFound()

  const canEditAssets = user ? canEdit(user.role) : false
  const auditLogs = getAssetAuditLogs(asset.id)

  function handleReturn() {
    returnAsset(asset!.id)
  }

  function handleDelete() {
    deleteAsset(asset!.id)
    router.push('/assets')
  }

  return (
    <>
      <div className="space-y-6">
        {/* Back + actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/assets">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Assets
            </Link>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            {canEditAssets && asset.status !== 'checked_out' && (
              <Button variant="outline" size="sm" onClick={() => setCheckoutOpen(true)}>
                <LogOut className="mr-1.5 h-4 w-4" />
                Check out
              </Button>
            )}
            {canEditAssets && asset.status === 'checked_out' && (
              <Button variant="outline" size="sm" onClick={handleReturn}>
                <LogIn className="mr-1.5 h-4 w-4" />
                Return
              </Button>
            )}
            {canEditAssets && (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/assets/${asset.id}/edit`}>
                    <Pencil className="mr-1.5 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-foreground text-2xl font-bold">{asset.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground font-mono text-sm">{asset.assetTag}</span>
              <AssetStatusBadge status={asset.status} />
              {asset.categoryName && (
                <Badge variant="outline" className="text-xs">
                  {asset.categoryName}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Details tab */}
          <TabsContent value="details" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Asset info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Department" value={asset.departmentName ?? '—'} />
                  <DetailRow label="Category" value={asset.categoryName ?? '—'} />
                  <DetailRow label="Location" value={asset.locationName ?? '—'} />
                  <DetailRow label="Vendor" value={asset.vendorName ?? '—'} />
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Purchase info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow
                    label="Purchase date"
                    value={asset.purchaseDate ? formatDate(asset.purchaseDate) : '—'}
                  />
                  <DetailRow
                    label="Cost"
                    value={asset.purchaseCost != null ? formatCurrency(asset.purchaseCost) : '—'}
                  />
                  <DetailRow
                    label="Warranty expiry"
                    value={asset.warrantyExpiry ? formatDate(asset.warrantyExpiry) : '—'}
                  />
                </CardContent>
              </Card>
              {asset.notes && (
                <Card className="shadow-sm sm:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm whitespace-pre-line">
                      {asset.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Assignment tab */}
          <TabsContent value="assignment" className="mt-4">
            {asset.currentAssignment ? (
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">Current assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailRow label="Assigned to" value={asset.currentAssignment.assignedToName} />
                  <DetailRow label="Assigned by" value={asset.currentAssignment.assignedByName} />
                  <DetailRow
                    label="Assigned on"
                    value={formatDate(asset.currentAssignment.assignedAt)}
                  />
                  <DetailRow
                    label="Expected return"
                    value={
                      asset.currentAssignment.expectedReturnAt
                        ? formatDate(asset.currentAssignment.expectedReturnAt)
                        : '—'
                    }
                  />
                  {asset.currentAssignment.notes && (
                    <DetailRow label="Notes" value={asset.currentAssignment.notes} />
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-muted-foreground rounded-xl border py-12 text-center text-sm">
                This asset is not currently checked out.
              </div>
            )}
          </TabsContent>

          {/* History tab */}
          <TabsContent value="history" className="mt-4">
            {auditLogs.length === 0 ? (
              <div className="text-muted-foreground rounded-xl border py-12 text-center text-sm">
                No activity recorded for this asset.
              </div>
            ) : (
              <Card className="shadow-sm">
                <CardContent className="p-0">
                  <ul className="divide-border divide-y">
                    {auditLogs.map((log) => (
                      <li key={log.id} className="flex items-start gap-3 px-5 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground text-sm">
                            <span className="font-medium">{log.actorName}</span>{' '}
                            {ACTION_LABELS[log.action] ?? log.action}
                          </p>
                          {log.changes && (
                            <p className="text-muted-foreground text-xs">
                              {Object.entries(log.changes)
                                .map(([k, v]) => `${k}: ${String(v.old)} → ${String(v.new)}`)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs">
                          {formatRelativeTime(log.createdAt)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {checkoutOpen && (
        <CheckoutModal asset={asset} open={checkoutOpen} onOpenChange={setCheckoutOpen} />
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete asset?"
        description={`"${asset.name}" will be permanently removed. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-foreground text-right">{value}</span>
    </div>
  )
}

const ACTION_LABELS: Record<string, string> = {
  created: 'created this asset',
  updated: 'updated this asset',
  deleted: 'deleted this asset',
  checked_out: 'checked out this asset',
  returned: 'returned this asset',
  status_changed: 'changed the status',
}
