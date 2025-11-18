'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getSalesHistory, getSalesStats, cancelSale } from '@/lib/database/queries'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { 
  BarChart3, 
  Search, 
  Filter,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  CreditCard,
  Banknote,
  Smartphone,
  XCircle,
  AlertTriangle
} from 'lucide-react'

interface Sale {
  id: string
  sale_number: string
  total_amount: number
  discount: number
  payment_method: string
  status: string
  notes: string | null
  created_at: string
  user_name: string
}

interface SalesStats {
  total_sales: number
  total_revenue: number
  cancelled_revenue: number
  average_ticket: number
  total_items: number
  completed_sales: number
  cancelled_sales: number
  pending_sales: number
}

export default function VendasPage() {
  const [sales, setSales] = useState<Sale[]>([])
  const [stats, setStats] = useState<SalesStats>({
    total_sales: 0,
    total_revenue: 0,
    cancelled_revenue: 0,
    average_ticket: 0,
    total_items: 0,
    completed_sales: 0,
    cancelled_sales: 0,
    pending_sales: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [cancelConfirmModal, setCancelConfirmModal] = useState<Sale | null>(null)

  const loadSalesData = async () => {
    setLoading(true)
    try {
      const [salesData, statsData] = await Promise.all([
        getSalesHistory(100),
        getSalesStats()
      ])

      setSales(salesData)
      setStats(statsData)
    } catch (error) {
      console.error('Erro ao carregar dados de vendas:', error)
      toast.error('Erro ao carregar dados de vendas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSalesData()
  }, [])

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.sale_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sale.notes && sale.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter
    const matchesPayment = paymentFilter === 'all' || sale.payment_method === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Finalizada', variant: 'default' as const },
      pending: { label: 'Pendente', variant: 'secondary' as const },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const }
    }
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.completed
  }

  const getPaymentIcon = (method: string) => {
    const icons = {
      cash: Banknote,
      card: CreditCard,
      pix: Smartphone
    }
    return icons[method as keyof typeof icons] || Banknote
  }

  const getPaymentLabel = (method: string) => {
    const labels = {
      cash: 'Dinheiro',
      card: 'Cartão',
      pix: 'PIX'
    }
    return labels[method as keyof typeof labels] || method
  }

  const handleCancelSaleClick = (sale: Sale) => {
    if (sale.status === 'cancelled') {
      toast.error('Esta venda já está cancelada')
      return
    }
    setCancelConfirmModal(sale)
  }

  const handleCancelSaleConfirm = async () => {
    if (!cancelConfirmModal) return

    try {
      const result = await cancelSale(cancelConfirmModal.id)
      
      if (result.success) {
        toast.success(`✅ Venda ${cancelConfirmModal.sale_number} cancelada com sucesso!`)
        setCancelConfirmModal(null)
        await loadSalesData() // Recarregar dados - isso atualizará o status automaticamente
      } else {
        toast.error(`❌ Erro ao cancelar venda: ${result.error}`)
      }
    } catch (error: any) {
      console.error('Erro ao cancelar venda:', error)
      toast.error('❌ Erro ao cancelar venda. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Histórico de Vendas
        </h1>
        <p className="text-gray-600">Acompanhe o desempenho das suas vendas</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_sales}</p>
                <div className="flex gap-2 text-xs text-gray-500 mt-1">
                  <span className="text-green-600">{stats.completed_sales} finalizadas</span>
                  {stats.cancelled_sales > 0 && (
                    <span className="text-red-600">• {stats.cancelled_sales} canceladas</span>
                  )}
                </div>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(stats.total_revenue)}
                </p>
                <div className="flex flex-col text-xs text-gray-500 mt-1">
                  <span>Vendas finalizadas</span>
                  {stats.cancelled_revenue > 0 && (
                    <span className="text-red-600">Canceladas: {formatCurrency(stats.cancelled_revenue)}</span>
                  )}
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(stats.average_ticket)}
                </p>
                <p className="text-xs text-gray-500">Por venda finalizada</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Itens Vendidos</p>
                <p className="text-3xl font-bold text-orange-600">{stats.total_items}</p>
                <p className="text-xs text-gray-500">Total de produtos</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por número da venda, usuário ou observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos os Status</option>
                <option value="completed">Finalizadas</option>
                <option value="pending">Pendentes</option>
                <option value="cancelled">Canceladas</option>
              </select>
              
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todos Pagamentos</option>
                <option value="cash">Dinheiro</option>
                <option value="card">Cartão</option>
                <option value="pix">PIX</option>
              </select>
              
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Vendas */}
      <div className="space-y-4">
        {filteredSales.map((sale) => {
          const statusBadge = getStatusBadge(sale.status)
          const PaymentIcon = getPaymentIcon(sale.payment_method)
          
          return (
            <Card key={sale.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {sale.sale_number}
                      </h3>
                      <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Tipo de Venda</p>
                        <p className="font-medium text-blue-600">Venda Direta</p>
                        <p className="text-gray-500 text-xs">Sistema PDV</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600">Vendedor</p>
                        <p className="font-medium">{sale.user_name}</p>
                      </div>
                      
                      <div>
                        <p className="text-gray-600">Pagamento</p>
                        <div className="flex items-center gap-1">
                          <PaymentIcon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{getPaymentLabel(sale.payment_method)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-gray-600 text-sm">Data/Hora</p>
                      <p className="font-medium">{formatDateTime(sale.created_at)}</p>
                    </div>
                    
                    {sale.notes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Obs: {sale.notes}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col lg:items-end gap-2">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        sale.status === 'cancelled' ? 'text-red-600 line-through' : 'text-green-600'
                      }`}>
                        {formatCurrency(sale.total_amount)}
                      </p>
                      {sale.discount > 0 && (
                        <p className="text-sm text-red-600">
                          Desconto: {formatCurrency(sale.discount)}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        Venda #{sale.id.slice(-8)}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      {sale.status !== 'cancelled' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleCancelSaleClick(sale)}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancelar
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="w-3 h-3 mr-1" />
                        Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredSales.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma venda encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {sales.length === 0 
                ? 'Realize algumas vendas primeiro para ver o histórico aqui.' 
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            <Button asChild>
              <Link href="/dashboard/pdv">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Ir para PDV
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {cancelConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md border-red-200 shadow-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="w-5 h-5" />
                Confirmar Cancelamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-700">
                  Tem certeza que deseja cancelar a venda <strong>{cancelConfirmModal.sale_number}</strong>?
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      Esta ação irá restaurar o estoque dos produtos vendidos. 
                      A venda será marcada como cancelada e não poderá ser revertida.
                    </span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valor da Venda:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(cancelConfirmModal.total_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Vendedor:</span>
                    <span className="font-medium text-gray-900">{cancelConfirmModal.user_name}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelConfirmModal(null)}
                  className="flex-1"
                >
                  Não, Manter Venda
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelSaleConfirm}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Sim, Cancelar Venda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

