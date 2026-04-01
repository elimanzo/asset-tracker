import type { EntityType } from '@/app/actions/_audit'
import { logAudit } from '@/app/actions/_audit'
import type { ActionContext } from '@/app/actions/_context'

type SoftDeleteOptions = {
  /** Supabase table name, e.g. 'categories' */
  entityTable: string
  /** Audit log entity type */
  entityType: EntityType
  /** Row id to soft-delete */
  entityId: string
  /**
   * FK column on `public.assets` to null out.
   * Common case: a single string, e.g. 'category_id'.
   */
  assetFkColumn: string
}

/**
 * Soft-deletes an entity and atomically nulls the FK on all referencing
 * assets via a single Postgres RPC call. Both UPDATEs run inside the
 * implicit transaction that wraps every PL/pgSQL function — if either
 * fails, both are rolled back.
 *
 * The audit entry is fire-and-forget after a successful RPC.
 */
export async function softDeleteWithCascade(
  ctx: ActionContext,
  { entityTable, entityType, entityId, assetFkColumn }: SoftDeleteOptions
): Promise<{ error: string } | null> {
  // Fetch display name before deleting so the audit log stays readable
  const { data: row } = await ctx.admin
    .from(entityTable)
    .select('name')
    .eq('id', entityId)
    .maybeSingle()

  const { error } = await ctx.admin.rpc('soft_delete_with_cascade', {
    p_entity_table: entityTable,
    p_entity_id: entityId,
    p_org_id: ctx.orgId,
    p_asset_fk_col: assetFkColumn,
  })

  if (error) return { error: error.message }

  await logAudit(ctx, {
    entityType,
    entityId,
    entityName: (row?.name as string) ?? 'Unknown',
    action: 'deleted',
  })

  return null
}
