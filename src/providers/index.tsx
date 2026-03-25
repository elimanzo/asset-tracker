'use client'

import { Toaster } from '@/components/ui/sonner'

import { AssetsProvider } from './AssetsProvider'
import { AuthProvider } from './AuthProvider'
import { OrgDataProvider } from './OrgDataProvider'
import { OrgProvider } from './OrgProvider'
import { QueryProvider } from './QueryProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <OrgProvider>
          <OrgDataProvider>
            <AssetsProvider>
              {children}
              <Toaster richColors position="top-right" />
            </AssetsProvider>
          </OrgDataProvider>
        </OrgProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
