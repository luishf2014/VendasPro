'use client'

import { useAuth } from '@/contexts/AuthContext'
import { SecurityProvider } from '@/contexts/SecurityContext'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { SessionWarning } from '@/components/SessionWarning'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <SecurityProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-3 min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Componente de aviso de sessão */}
      <SessionWarning />
    </SecurityProvider>
  )
}
