import type { Category, CategoryWithStats } from '@/lib/types'

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-0001',
    orgId: 'org-acme-0001',
    name: 'Laptop',
    description: 'Portable computers and notebooks.',
    icon: 'laptop',
    deletedAt: null,
    createdAt: '2024-01-15T09:10:00.000Z',
    updatedAt: '2024-01-15T09:10:00.000Z',
  },
  {
    id: 'cat-0002',
    orgId: 'org-acme-0001',
    name: 'Monitor',
    description: 'Desktop and external display monitors.',
    icon: 'monitor',
    deletedAt: null,
    createdAt: '2024-01-15T09:11:00.000Z',
    updatedAt: '2024-01-15T09:11:00.000Z',
  },
  {
    id: 'cat-0003',
    orgId: 'org-acme-0001',
    name: 'Printer',
    description: 'Laser and inkjet printers.',
    icon: 'printer',
    deletedAt: null,
    createdAt: '2024-01-15T09:12:00.000Z',
    updatedAt: '2024-01-15T09:12:00.000Z',
  },
  {
    id: 'cat-0004',
    orgId: 'org-acme-0001',
    name: 'Office Chair',
    description: 'Ergonomic office seating.',
    icon: 'armchair',
    deletedAt: null,
    createdAt: '2024-01-15T09:13:00.000Z',
    updatedAt: '2024-01-15T09:13:00.000Z',
  },
  {
    id: 'cat-0005',
    orgId: 'org-acme-0001',
    name: 'Network Switch',
    description: 'Managed and unmanaged network switches.',
    icon: 'network',
    deletedAt: null,
    createdAt: '2024-01-15T09:14:00.000Z',
    updatedAt: '2024-01-15T09:14:00.000Z',
  },
]

export const MOCK_CATEGORIES_WITH_STATS: CategoryWithStats[] = [
  { ...MOCK_CATEGORIES[0], assetCount: 12 },
  { ...MOCK_CATEGORIES[1], assetCount: 10 },
  { ...MOCK_CATEGORIES[2], assetCount: 4 },
  { ...MOCK_CATEGORIES[3], assetCount: 5 },
  { ...MOCK_CATEGORIES[4], assetCount: 1 },
]
