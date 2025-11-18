'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Bell, 
  Settings, 
  User,
  Sun,
  Moon,
  Zap
} from 'lucide-react'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { user } = useAuth()

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Implementar lógica de dark mode aqui
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar lógica de busca aqui
    console.log('Searching for:', searchQuery)
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full text-sm bg-gray-50 border-gray-300 focus:bg-white focus:border-blue-500 transition-all"
              />
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Quick Stats - Only on larger screens */}
            <div className="hidden xl:flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">R$ 0,00</p>
                <p className="text-xs text-gray-500">Vendas Hoje</p>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Produtos</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Dark Mode Toggle - Hidden on mobile */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hidden sm:flex text-gray-500 hover:text-gray-700 h-8 w-8 sm:h-10 sm:w-10"
              >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              </Button>

              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 h-8 w-8 sm:h-10 sm:w-10"
                >
                  <Bell size={16} className="sm:w-[18px] sm:h-[18px]" />
                </Button>
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 p-0 flex items-center justify-center text-[10px]"
                >
                  3
                </Badge>
              </div>

              {/* Settings - Hidden on mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex text-gray-500 hover:text-gray-700 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Settings size={16} />
              </Button>
            </div>

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-gray-300">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Bar - Hidden on mobile */}
        <div className="mt-3 sm:mt-4 hidden md:flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              🔥 Vendas em alta
            </Badge>
            <Badge variant="outline" className="text-xs">
              📦 5 produtos em baixo estoque
            </Badge>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Zap size={14} className="text-green-500" />
            <span className="hidden lg:inline">Sistema funcionando normalmente</span>
          </div>
        </div>
      </div>
    </header>
  )
}
