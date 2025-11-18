'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Package, 
  BarChart3,
  AlertTriangle,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { getDashboardStats, getRecentSales, getLowStockProducts, getDailyRevenue } from '@/lib/database/queries'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface DashboardStats {
  sales_today: number
  sales_month: number
  sales_growth: number
  total_products: number
  low_stock_products: number
  average_ticket: number
}

interface RecentSale {
  id: string
  sale_number: string
  customer_name: string
  total_amount: number
  payment_method: string
  created_at: string
}

interface LowStockProduct {
  id: string
  name: string
  stock: number
  min_stock: number
}

interface DailyRevenue {
  date: string
  dateFormatted: string
  revenue: number
  dayOfWeek: string
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    sales_today: 0,
    sales_month: 0,
    sales_growth: 0,
    total_products: 0,
    low_stock_products: 0,
    average_ticket: 0
  })
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([])
  const [dailyRevenue, setDailyRevenue] = useState<DailyRevenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return
      
      setLoading(true)
      try {
        // Verificar se é manager ou admin antes de buscar faturamento diário
        const isManagerOrAdmin = user.role === 'manager' || user.role === 'admin'
        
        const promises = [
          getDashboardStats(user.id),
          getRecentSales(3),
          getLowStockProducts(5)
        ]
        
        // Adicionar busca de faturamento apenas se for manager/admin
        if (isManagerOrAdmin) {
          promises.push(getDailyRevenue(7))
        }

        const results = await Promise.all(promises)
        
        setStats(results[0])
        setRecentSales(results[1])
        setLowStockProducts(results[2])
        
        // Só definir faturamento se for manager/admin
        if (isManagerOrAdmin && results[3]) {
          setDailyRevenue(results[3])
        } else {
          setDailyRevenue([])
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [user])

  const getPaymentMethodLabel = (method: string) => {
    const methods = {
      cash: '💵 Dinheiro',
      card: '💳 Cartão',
      pix: '📱 PIX'
    }
    return methods[method as keyof typeof methods] || method
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 min-h-screen px-3 sm:px-0">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Aqui está um resumo do seu negócio hoje
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard/pdv">
              <Plus className="w-4 h-4 mr-2" />
              Nova Venda
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/produtos">
              <Package className="w-4 h-4 mr-2" />
              Produtos
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Vendas Hoje
            </CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.sales_today)}
            </div>
            <div className="flex items-center space-x-1 text-blue-100 text-xs">
              {stats.sales_growth >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{stats.sales_growth >= 0 ? '+' : ''}{stats.sales_growth}% vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Vendas do Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.sales_month)}
            </div>
            <p className="text-green-100 text-xs">
              Meta: R$ 25.000,00
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Produtos
            </CardTitle>
            <Package className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total_products}
            </div>
            <div className="flex items-center space-x-1 text-purple-100 text-xs">
              <AlertTriangle className="h-3 w-3" />
              <span>{stats.low_stock_products} com estoque baixo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Ticket Médio
            </CardTitle>
            <DollarSign className="h-4 w-4 opacity-90" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.average_ticket || 0)}
            </div>
            <p className="text-orange-100 text-xs">
              Valor médio por venda
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Faturamento Diário - Apenas para Managers e Admins */}
      {(user?.role === 'manager' || user?.role === 'admin') && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <span>Faturamento Diário</span>
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Últimos 7 dias de faturamento
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dailyRevenue.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {dailyRevenue.map((day, index) => {
                  const maxRevenue = Math.max(...dailyRevenue.map(d => d.revenue))
                  const percentage = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0
                  const isToday = day.date === new Date().toISOString().split('T')[0]
                  
                  return (
                    <div key={day.date} className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1">
                          <div className={`w-16 sm:w-20 text-left text-xs sm:text-sm ${isToday ? 'font-bold text-blue-600' : 'text-gray-600'}`}>
                            {day.dateFormatted}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-5 sm:h-6 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    isToday 
                                      ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                                      : 'bg-gradient-to-r from-green-500 to-green-600'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className={`w-20 sm:w-24 text-right font-semibold text-xs sm:text-sm ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                {formatCurrency(day.revenue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div className="pt-3 sm:pt-4 border-t mt-3 sm:mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Total (7 dias):</span>
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(dailyRevenue.reduce((sum, day) => sum + day.revenue, 0))}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum faturamento registrado nos últimos dias</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Vendas Recentes</CardTitle>
                <CardDescription>
                  Últimas vendas realizadas
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/vendas">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Todas
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.length > 0 ? recentSales.map((sale, index) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">
                        {sale.sale_number}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {getPaymentMethodLabel(sale.payment_method)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {sale.customer_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(sale.created_at)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(sale.total_amount)}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma venda recente encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <span>Estoque Baixo</span>
                </CardTitle>
                <CardDescription>
                  Produtos que precisam de reposição
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/produtos">
                  <Package className="w-4 h-4 mr-2" />
                  Gerenciar
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Estoque mínimo: {product.min_stock}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={product.stock === 0 ? "destructive" : "warning"}
                      className="font-semibold"
                    >
                      {product.stock === 0 ? 'Esgotado' : `${product.stock} unid.`}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhum produto com estoque baixo</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-dashed border-2 border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Ações Rápidas
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/dashboard/pdv">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Abrir PDV
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/dashboard/produtos">
                  <Package className="w-5 h-5 mr-2" />
                  Cadastrar Produto
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/dashboard/vendas">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Ver Vendas
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
