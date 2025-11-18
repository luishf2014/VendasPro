'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Settings,
  Menu,
  X,
  Zap,
  ChevronRight,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    description: 'Visão geral do sistema'
  },
  {
    title: 'PDV',
    icon: ShoppingCart,
    href: '/dashboard/pdv',
    description: 'Ponto de venda'
  },
  {
    title: 'Produtos',
    icon: Package,
    href: '/dashboard/produtos',
    description: 'Gestão de produtos'
  },
  {
    title: 'Vendas',
    icon: BarChart3,
    href: '/dashboard/vendas',
    description: 'Histórico de vendas'
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/dashboard/configuracoes',
    description: 'Configurações do sistema'
  }
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-gray-900">VendasPro</h1>
              <p className="text-xs text-gray-500">Sistema de Vendas</p>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hidden lg:flex"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon 
                size={20} 
                className={cn(
                  "flex-shrink-0",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                )}
              />
              {!isCollapsed && (
                <div className="flex-1">
                  <p className="font-medium">{item.title}</p>
                  <p className={cn(
                    "text-xs",
                    isActive ? "text-blue-100" : "text-gray-500"
                  )}>
                    {item.description}
                  </p>
                </div>
              )}
            </Link>
          )
        })}
        
        {/* Menu de Usuários - Apenas para Admin e Managers */}
        {(user?.role === 'manager' || user?.role === 'admin') && (
          <Link
            href="/dashboard/usuarios"
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              pathname === '/dashboard/usuarios'
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md"
            )}
            onClick={() => setIsMobileOpen(false)}
          >
            <Users 
              size={20} 
              className={cn(
                "flex-shrink-0",
                pathname === '/dashboard/usuarios' ? "text-white" : "text-gray-500 group-hover:text-gray-700"
              )}
            />
            {!isCollapsed && (
              <div className="flex-1">
                <p className="font-medium">Usuários</p>
                <p className={cn(
                  "text-xs",
                  pathname === '/dashboard/usuarios' ? "text-blue-100" : "text-gray-500"
                )}>
                  Gerenciar usuários
                </p>
              </div>
            )}
          </Link>
        )}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && user && (
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <p className="text-xs text-blue-600 font-medium capitalize">{user.role}</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobile}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white shadow-lg"
      >
        <Menu size={20} />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white shadow-xl transition-all duration-300 lg:relative lg:translate-x-0",
          isCollapsed ? "w-20" : "w-80",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
