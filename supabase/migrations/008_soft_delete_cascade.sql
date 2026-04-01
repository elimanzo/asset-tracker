-- ============================================================
-- Atomic soft-delete with FK cascade
--
-- Replaces the non-atomic two-step pattern in deleteCategory /
-- deleteDepartment (soft-delete entity, then null FK on assets)
-- with a single PL/pgSQL function that executes both UPDATEs
-- inside the implicit transaction that wraps every function call.
-- If the assets UPDATE fails the entity UPDATE is rolled back.
--
-- p_entity_table : table to soft-delete from (allowlisted)
-- p_entity_id    : row id
-- p_org_id       : tenant scope (applied to both UPDATEs)
-- p_asset_fk_col : column on public.assets to null out (allowlisted)
-- ============================================================

create or replace function public.soft_delete_with_cascade(
  p_entity_table  text,
  p_entity_id     uuid,
  p_org_id        uuid,
  p_asset_fk_col  text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Allowlist validation — dynamic identifiers cannot be parameterised;
  -- an explicit whitelist prevents SQL injection.
  if p_entity_table not in ('categories', 'departments', 'locations', 'vendors') then
    raise exception 'soft_delete_with_cascade: unsupported entity table ''%''', p_entity_table;
  end if;

  if p_asset_fk_col not in ('category_id', 'department_id', 'location_id', 'vendor_id') then
    raise exception 'soft_delete_with_cascade: unsupported fk column ''%''', p_asset_fk_col;
  end if;

  -- 1. Soft-delete the entity row
  execute format(
    'update public.%I
        set deleted_at = now()
      where id      = $1
        and org_id  = $2
        and deleted_at is null',
    p_entity_table
  ) using p_entity_id, p_org_id;

  -- 2. Null out the FK on all assets in the same org
  --    Mirrors what ON DELETE SET NULL would do for a hard delete.
  execute format(
    'update public.assets
        set %I = null
      where %I    = $1
        and org_id = $2',
    p_asset_fk_col,
    p_asset_fk_col
  ) using p_entity_id, p_org_id;
end;
$$;
