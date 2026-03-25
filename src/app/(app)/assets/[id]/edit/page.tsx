'use client'

import { notFound, redirect } from 'next/navigation'
import { use } from 'react'

import { AssetForm } from '@/components/assets/AssetForm'
import { PageHeader } from '@/components/shared/PageHeader'
import { useAsset } from '@/lib/hooks/useAssets'
import { canEdit } from '@/lib/utils/permissions'
import { useAuth } from '@/providers/AuthProvider'

interface EditAssetPageProps {
  params: Promise<{ id: string }>
}

export default function EditAssetPage({ params }: EditAssetPageProps) {
  const { id } = use(params)
  const { user } = useAuth()
  const { data: asset } = useAsset(id)

  if (user && !canEdit(user.role)) {
    redirect('/assets')
  }

  if (!asset) return notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Edit asset" description={asset.name} />
      <AssetForm asset={asset} />
    </div>
  )
}
