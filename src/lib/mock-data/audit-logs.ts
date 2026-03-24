import type { AuditLog } from '@/lib/types'

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-0001',
    orgId: 'org-acme-0001',
    actorId: 'user-0002',
    actorName: 'Jamie Chen',
    entityType: 'asset',
    entityId: 'ast-0003',
    entityName: 'MacBook Pro 14" — Dev Pool',
    action: 'checked_out',
    changes: null,
    createdAt: '2026-02-10T09:00:00.000Z',
  },
  {
    id: 'log-0002',
    orgId: 'org-acme-0001',
    actorId: 'user-0003',
    actorName: 'Sam Patel',
    entityType: 'asset',
    entityId: 'ast-0008',
    entityName: 'HP LaserJet Pro M404dn',
    action: 'status_changed',
    changes: {
      status: { old: 'active', new: 'under_maintenance' },
    },
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'log-0003',
    orgId: 'org-acme-0001',
    actorId: 'user-0002',
    actorName: 'Jamie Chen',
    entityType: 'asset',
    entityId: 'ast-0011',
    entityName: 'Dell Latitude 5540 — Spare',
    action: 'checked_out',
    changes: null,
    createdAt: '2026-01-20T09:00:00.000Z',
  },
  {
    id: 'log-0004',
    orgId: 'org-acme-0001',
    actorId: 'user-0004',
    actorName: 'Morgan Lee',
    entityType: 'asset',
    entityId: 'ast-0026',
    entityName: 'Ergonomic Chair — Ops 2',
    action: 'status_changed',
    changes: {
      status: { old: 'active', new: 'under_maintenance' },
    },
    createdAt: '2026-02-20T10:00:00.000Z',
  },
  {
    id: 'log-0005',
    orgId: 'org-acme-0001',
    actorId: 'user-0001',
    actorName: 'Alex Rivera',
    entityType: 'asset',
    entityId: 'ast-0032',
    entityName: 'HP ProDesk 400 — Ops Reception',
    action: 'created',
    changes: null,
    createdAt: '2024-05-10T09:00:00.000Z',
  },
  {
    id: 'log-0006',
    orgId: 'org-acme-0001',
    actorId: 'user-0002',
    actorName: 'Jamie Chen',
    entityType: 'asset',
    entityId: 'ast-0020',
    entityName: 'HP OfficeJet Pro 9015e — Lost',
    action: 'status_changed',
    changes: {
      status: { old: 'active', new: 'lost' },
    },
    createdAt: '2024-03-15T09:00:00.000Z',
  },
  {
    id: 'log-0007',
    orgId: 'org-acme-0001',
    actorId: 'user-0001',
    actorName: 'Alex Rivera',
    entityType: 'asset',
    entityId: 'ast-0012',
    entityName: 'Dell XPS Tower — Retired',
    action: 'status_changed',
    changes: {
      status: { old: 'active', new: 'retired' },
    },
    createdAt: '2024-11-01T10:00:00.000Z',
  },
  {
    id: 'log-0008',
    orgId: 'org-acme-0001',
    actorId: 'user-0003',
    actorName: 'Sam Patel',
    entityType: 'asset',
    entityId: 'ast-0013',
    entityName: 'HP EliteDisplay E243 Monitor — Spare',
    action: 'created',
    changes: null,
    createdAt: '2024-02-05T09:00:00.000Z',
  },
]

/** Most recent logs first, filtered to a specific asset */
export function getAssetAuditLogs(assetId: string): AuditLog[] {
  return MOCK_AUDIT_LOGS.filter((l) => l.entityId === assetId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

/** Most recent 10 logs across all entities */
export function getRecentAuditLogs(limit = 10): AuditLog[] {
  return [...MOCK_AUDIT_LOGS]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
}
