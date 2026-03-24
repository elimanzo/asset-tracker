import type { Vendor } from '@/lib/types'

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'ven-0001',
    orgId: 'org-acme-0001',
    name: 'Dell Technologies',
    contactEmail: 'sales@dell.com',
    contactPhone: '1-800-999-3355',
    website: 'https://www.dell.com',
    notes: 'Primary laptop and monitor supplier.',
    deletedAt: null,
    createdAt: '2024-01-16T10:00:00.000Z',
  },
  {
    id: 'ven-0002',
    orgId: 'org-acme-0001',
    name: 'HP Inc.',
    contactEmail: 'support@hp.com',
    contactPhone: '1-800-474-6836',
    website: 'https://www.hp.com',
    notes: 'Printers and workstations.',
    deletedAt: null,
    createdAt: '2024-01-16T10:05:00.000Z',
  },
  {
    id: 'ven-0003',
    orgId: 'org-acme-0001',
    name: 'Cisco Systems',
    contactEmail: 'orders@cisco.com',
    contactPhone: '1-800-553-2447',
    website: 'https://www.cisco.com',
    notes: 'Networking equipment.',
    deletedAt: null,
    createdAt: '2024-01-16T10:10:00.000Z',
  },
]
