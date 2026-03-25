'use client'

import { LayoutGrid, List, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { AssetCard } from '@/components/assets/AssetCard'
import { AssetFiltersBar } from '@/components/assets/AssetFilters'
import { AssetTable } from '@/components/assets/AssetTable'
import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { type AssetFilters, useAssets } from '@/lib/hooks/useAssets'
import { canEdit } from '@/lib/utils/permissions'
import { useAuth } from '@/providers/AuthProvider'

export default function AssetsPage() {
  const [view, setView] = useState<'table' | 'card'>('table')
  const [filters, setFilters] = useState<AssetFilters>({})
  const { data: assets } = useAssets(filters)
  const { user } = useAuth()
  const canCreate = user ? canEdit(user.role) : false

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description={`${assets.length} asset${assets.length !== 1 ? 's' : ''}`}
        action={
          canCreate ? (
            <Button asChild>
              <Link href="/assets/new">
                <Plus className="mr-2 h-4 w-4" />
                Add asset
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div className="flex items-center gap-2">
        <AssetFiltersBar
          filters={filters}
          onFiltersChange={setFilters}
          showDepartmentFilter={canCreate}
        />
        <div className="ml-auto flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={view === 'table' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView('table')}
            title="Table view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'card' ? 'secondary' : 'ghost'}
            size="icon"
            className="h-7 w-7"
            onClick={() => setView('card')}
            title="Card view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {assets.length === 0 ? (
        <EmptyState
          icon={List}
          title="No assets found"
          description="Try adjusting your filters or add a new asset."
          action={
            canCreate ? (
              <Button asChild size="sm">
                <Link href="/assets/new">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add asset
                </Link>
              </Button>
            ) : undefined
          }
        />
      ) : view === 'table' ? (
        <AssetTable assets={assets} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  )
}
