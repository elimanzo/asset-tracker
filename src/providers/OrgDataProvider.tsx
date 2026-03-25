'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { toast } from 'sonner'

import {
  MOCK_CATEGORIES,
  MOCK_DEPARTMENTS,
  MOCK_LOCATIONS,
  MOCK_PENDING_INVITES,
  MOCK_USERS,
  MOCK_VENDORS,
} from '@/lib/mock-data'
import type {
  Category,
  CategoryFormInput,
  Department,
  DepartmentFormInput,
  Invite,
  Location,
  LocationFormInput,
  ProfileWithDepartments,
  Vendor,
  VendorFormInput,
} from '@/lib/types'

type OrgDataContextValue = {
  // Departments
  departments: Department[]
  createDepartment: (input: DepartmentFormInput) => void
  updateDepartment: (id: string, input: DepartmentFormInput) => void
  deleteDepartment: (id: string) => void
  // Categories
  categories: Category[]
  createCategory: (input: CategoryFormInput) => void
  updateCategory: (id: string, input: CategoryFormInput) => void
  deleteCategory: (id: string) => void
  // Locations
  locations: Location[]
  createLocation: (input: LocationFormInput) => void
  updateLocation: (id: string, input: LocationFormInput) => void
  deleteLocation: (id: string) => void
  // Vendors
  vendors: Vendor[]
  createVendor: (input: VendorFormInput) => void
  updateVendor: (id: string, input: VendorFormInput) => void
  deleteVendor: (id: string) => void
  // Users
  users: ProfileWithDepartments[]
  pendingInvites: Invite[]
  sendInvite: (email: string, role: Invite['role']) => void
  revokeInvite: (id: string) => void
  removeUser: (id: string) => void
}

const OrgDataContext = createContext<OrgDataContextValue | null>(null)

const now = () => new Date().toISOString()

export function OrgDataProvider({ children }: { children: React.ReactNode }) {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS)
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS)
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS)
  const [users, setUsers] = useState<ProfileWithDepartments[]>(MOCK_USERS)
  const [pendingInvites, setPendingInvites] = useState<Invite[]>(MOCK_PENDING_INVITES)

  // -------------------------------------------------------------------------
  // Departments
  // -------------------------------------------------------------------------
  const createDepartment = useCallback((input: DepartmentFormInput) => {
    const dept: Department = {
      id: `dept-${Date.now()}`,
      orgId: 'org-acme-0001',
      name: input.name,
      description: input.description ?? null,
      deletedAt: null,
      createdAt: now(),
      updatedAt: now(),
    }
    setDepartments((prev) => [...prev, dept])
    toast.success('Department created')
  }, [])

  const updateDepartment = useCallback((id: string, input: DepartmentFormInput) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, name: input.name, description: input.description ?? null, updatedAt: now() }
          : d
      )
    )
    toast.success('Department updated')
  }, [])

  const deleteDepartment = useCallback((id: string) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id))
    toast.success('Department deleted')
  }, [])

  // -------------------------------------------------------------------------
  // Categories
  // -------------------------------------------------------------------------
  const createCategory = useCallback((input: CategoryFormInput) => {
    const cat: Category = {
      id: `cat-${Date.now()}`,
      orgId: 'org-acme-0001',
      name: input.name,
      description: input.description ?? null,
      icon: input.icon ?? null,
      deletedAt: null,
      createdAt: now(),
      updatedAt: now(),
    }
    setCategories((prev) => [...prev, cat])
    toast.success('Category created')
  }, [])

  const updateCategory = useCallback((id: string, input: CategoryFormInput) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: input.name,
              description: input.description ?? null,
              icon: input.icon ?? null,
              updatedAt: now(),
            }
          : c
      )
    )
    toast.success('Category updated')
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    toast.success('Category deleted')
  }, [])

  // -------------------------------------------------------------------------
  // Locations
  // -------------------------------------------------------------------------
  const createLocation = useCallback((input: LocationFormInput) => {
    const loc: Location = {
      id: `loc-${Date.now()}`,
      orgId: 'org-acme-0001',
      name: input.name,
      description: input.description ?? null,
      deletedAt: null,
      createdAt: now(),
    }
    setLocations((prev) => [...prev, loc])
    toast.success('Location created')
  }, [])

  const updateLocation = useCallback((id: string, input: LocationFormInput) => {
    setLocations((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, name: input.name, description: input.description ?? null } : l
      )
    )
    toast.success('Location updated')
  }, [])

  const deleteLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id))
    toast.success('Location deleted')
  }, [])

  // -------------------------------------------------------------------------
  // Vendors
  // -------------------------------------------------------------------------
  const createVendor = useCallback((input: VendorFormInput) => {
    const vendor: Vendor = {
      id: `ven-${Date.now()}`,
      orgId: 'org-acme-0001',
      name: input.name,
      contactEmail: input.contactEmail || null,
      contactPhone: input.contactPhone || null,
      website: input.website || null,
      notes: input.notes || null,
      deletedAt: null,
      createdAt: now(),
    }
    setVendors((prev) => [...prev, vendor])
    toast.success('Vendor created')
  }, [])

  const updateVendor = useCallback((id: string, input: VendorFormInput) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              name: input.name,
              contactEmail: input.contactEmail || null,
              contactPhone: input.contactPhone || null,
              website: input.website || null,
              notes: input.notes || null,
            }
          : v
      )
    )
    toast.success('Vendor updated')
  }, [])

  const deleteVendor = useCallback((id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id))
    toast.success('Vendor deleted')
  }, [])

  // -------------------------------------------------------------------------
  // Users / Invites
  // -------------------------------------------------------------------------
  const sendInvite = useCallback((email: string, role: Invite['role']) => {
    const invite: Invite = {
      id: `inv-${Date.now()}`,
      orgId: 'org-acme-0001',
      email,
      role,
      token: `mock-token-${Date.now()}`,
      invitedBy: 'user-0001',
      invitedByName: 'Alex Rivera',
      acceptedAt: null,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: now(),
    }
    setPendingInvites((prev) => [...prev, invite])
    toast.success(`Invite sent to ${email}`)
  }, [])

  const revokeInvite = useCallback((id: string) => {
    setPendingInvites((prev) => prev.filter((i) => i.id !== id))
    toast.success('Invite revoked')
  }, [])

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success('User removed')
  }, [])

  return (
    <OrgDataContext.Provider
      value={{
        departments,
        createDepartment,
        updateDepartment,
        deleteDepartment,
        categories,
        createCategory,
        updateCategory,
        deleteCategory,
        locations,
        createLocation,
        updateLocation,
        deleteLocation,
        vendors,
        createVendor,
        updateVendor,
        deleteVendor,
        users,
        pendingInvites,
        sendInvite,
        revokeInvite,
        removeUser,
      }}
    >
      {children}
    </OrgDataContext.Provider>
  )
}

export function useOrgData(): OrgDataContextValue {
  const ctx = useContext(OrgDataContext)
  if (!ctx) throw new Error('useOrgData must be used within <OrgDataProvider>')
  return ctx
}
