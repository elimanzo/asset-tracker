import type { Department, DepartmentWithStats } from '@/lib/types'

export const MOCK_DEPARTMENTS: Department[] = [
  {
    id: 'dept-0001',
    orgId: 'org-acme-0001',
    name: 'IT',
    description: 'Information Technology — hardware, software, and network infrastructure.',
    deletedAt: null,
    createdAt: '2024-01-15T09:05:00.000Z',
    updatedAt: '2024-01-15T09:05:00.000Z',
  },
  {
    id: 'dept-0002',
    orgId: 'org-acme-0001',
    name: 'Finance',
    description: 'Finance and Accounting — workstations, printers, and office equipment.',
    deletedAt: null,
    createdAt: '2024-01-15T09:06:00.000Z',
    updatedAt: '2024-01-15T09:06:00.000Z',
  },
  {
    id: 'dept-0003',
    orgId: 'org-acme-0001',
    name: 'Operations',
    description: 'Operations — facility equipment, tools, and field devices.',
    deletedAt: null,
    createdAt: '2024-01-15T09:07:00.000Z',
    updatedAt: '2024-01-15T09:07:00.000Z',
  },
]

export const MOCK_DEPARTMENTS_WITH_STATS: DepartmentWithStats[] = [
  { ...MOCK_DEPARTMENTS[0], assetCount: 18, memberCount: 3 },
  { ...MOCK_DEPARTMENTS[1], assetCount: 8, memberCount: 2 },
  { ...MOCK_DEPARTMENTS[2], assetCount: 6, memberCount: 2 },
]
