import type { Location } from '@/lib/types'

export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'loc-0001',
    orgId: 'org-acme-0001',
    name: 'HQ — Floor 1',
    description: 'Headquarters, first floor — reception and operations.',
    deletedAt: null,
    createdAt: '2024-01-15T09:20:00.000Z',
  },
  {
    id: 'loc-0002',
    orgId: 'org-acme-0001',
    name: 'HQ — Floor 2',
    description: 'Headquarters, second floor — finance and IT.',
    deletedAt: null,
    createdAt: '2024-01-15T09:21:00.000Z',
  },
  {
    id: 'loc-0003',
    orgId: 'org-acme-0001',
    name: 'Server Room',
    description: 'Main server room on floor 1.',
    deletedAt: null,
    createdAt: '2024-01-15T09:22:00.000Z',
  },
  {
    id: 'loc-0004',
    orgId: 'org-acme-0001',
    name: 'Remote / Off-site',
    description: 'Equipment assigned to remote or off-site employees.',
    deletedAt: null,
    createdAt: '2024-01-15T09:23:00.000Z',
  },
]
