'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/database/queries'
import toast from 'react-hot-toast'
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Filter,
  TrendingUp,
  AlertTriangle,
  Barcode,
  RefreshCw
} from 'lucide-react'

const mockCategories = ['Todas', 'Eletrônicos', 'Roupas', 'Casa & Decoração', 'Esportes', 'Livros']

interface Product {
  id: string
  internalCode: string
  name: string
  description: string
  price: number
  costPrice: number
  stock: number
  minStock: number
  barcode: string
  category: string
  active: boolean
  createdAt: string
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  // Estados do formulário de produto
  const [formData, setFormData] = useState({
    internalCode: '',
    name: '',
    description: '',
    price: '',
    costPrice: '',
    stock: '',
    minStock: '',
    barcode: '',
    category: 'Eletrônicos'
  })

  // Função para carregar produtos
  const loadProducts = useCallback(async () => {
    console.log('🔄 Carregando produtos do banco de dados...')
    setLoading(true)
    try {
      const productsData = await getProducts()
      console.log(`✅ Produtos carregados: ${productsData.length} produtos encontrados`)
      if (productsData.length > 0) {
        console.log('📊 Primeiros 3 produtos:', productsData.slice(0, 3).map((p: Product) => ({
          nome: p.name,
          estoque: p.stock,
          id: p.id
        })))
      }
      setProducts(productsData)
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error)
      toast.error('❌ Erro ao carregar produtos. Tente atualizar a página.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Carregar produtos do banco quando a página carrega
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Recarregar produtos quando a página ganha foco (para atualizar estoque após vendas)
  useEffect(() => {
    const handleFocus = () => {
      loadProducts()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProducts()
      }
    }

    // Listener para evento customizado quando uma venda é finalizada
    const handleSaleCompleted = (event: Event) => {
      const customEvent = event as CustomEvent
      console.log('📦 Evento saleCompleted recebido, recarregando produtos...', customEvent.detail)
      loadProducts()
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('saleCompleted', handleSaleCompleted)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('saleCompleted', handleSaleCompleted)
    }
  }, [loadProducts])

  // Atualizar produtos periodicamente (a cada 30 segundos) quando a página está visível
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        loadProducts()
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [loadProducts])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm) ||
                         product.internalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory
    
    return matchesSearch && matchesCategory && product.active
  })

  const lowStockProducts = products.filter(p => p.stock <= p.minStock)
  const totalProducts = products.filter(p => p.active).length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  // Funções do formulário
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generateInternalCode = () => {
    const lastCode = products.length > 0 
      ? products
          .map(p => parseInt(p.internalCode.replace('PRD', '')))
          .filter(num => !isNaN(num))
          .sort((a, b) => b - a)[0] || 0
      : 0
    
    const newCode = `PRD${String(lastCode + 1).padStart(3, '0')}`
    setFormData(prev => ({ ...prev, internalCode: newCode }))
  }

  const resetForm = () => {
    setFormData({
      internalCode: '',
      name: '',
      description: '',
      price: '',
      costPrice: '',
      stock: '',
      minStock: '',
      barcode: '',
      category: 'Eletrônicos'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Validar valores numéricos
      const price = parseFloat(formData.price)
      const costPrice = parseFloat(formData.costPrice)
      const stock = parseInt(formData.stock)
      const minStock = parseInt(formData.minStock)

      if (isNaN(price) || price < 0) {
        toast.error('❌ Preço inválido!')
        setSubmitting(false)
        return
      }

      if (isNaN(costPrice) || costPrice < 0) {
        toast.error('❌ Preço de custo inválido!')
        setSubmitting(false)
        return
      }

      if (isNaN(stock) || stock < 0) {
        toast.error('❌ Estoque inválido!')
        setSubmitting(false)
        return
      }

      if (isNaN(minStock) || minStock < 0) {
        toast.error('❌ Estoque mínimo inválido!')
        setSubmitting(false)
        return
      }

      if (editingProduct) {
        // Atualizar produto existente
        console.log('📝 Iniciando atualização do produto:', editingProduct.id)
        console.log('📋 Dados do formulário:', formData)
        console.log('🔢 Valores validados:', { price, costPrice, stock, minStock })
        
        const result = await updateProduct(editingProduct.id, {
          name: formData.name,
          description: formData.description || undefined,
          price: price,
          cost_price: costPrice,
          stock_quantity: stock,
          min_stock: minStock,
          barcode: formData.barcode || undefined,
          category_name: formData.category // Passar nome da categoria para converter em ID
        })
        
        console.log('📊 Resultado da atualização:', result)

        if (result.success) {
          toast.success('✅ Produto atualizado com sucesso!')
          
          // Recarregar lista de produtos do banco após um pequeno delay
          // para garantir que o banco tenha processado a atualização
          setTimeout(async () => {
            await loadProducts()
          }, 300)
          
          setIsEditModalOpen(false)
          setEditingProduct(null)
          resetForm()
        } else {
          console.error('❌ Erro ao atualizar produto:', result.error)
          toast.error(`❌ Erro ao atualizar produto: ${result.error}`)
        }
      } else {
        // Criar novo produto
        console.log('➕ Criando novo produto')
        console.log('📋 Dados do formulário:', formData)
        console.log('🔢 Valores validados:', { price, costPrice, stock, minStock })
        
        const result = await createProduct({
          name: formData.name,
          description: formData.description,
          price: price,
          cost_price: costPrice,
          stock_quantity: stock,
          min_stock: minStock,
          barcode: formData.barcode || undefined,
          category_name: formData.category // Passar nome da categoria para converter em ID
        })
        
        console.log('📊 Resultado da criação:', result)

        if (result.success) {
          // Recarregar lista de produtos do banco
          await loadProducts()
          
          setIsAddModalOpen(false)
          resetForm()
          toast.success('✅ Produto cadastrado com sucesso!')
        } else {
          toast.error(`❌ Erro ao cadastrar produto: ${result.error}`)
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      toast.error('❌ Erro ao salvar produto. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      internalCode: product.internalCode,
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      costPrice: product.costPrice.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      barcode: product.barcode,
      category: product.category
    })
    setIsEditModalOpen(true)
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      return
    }

    try {
      const result = await deleteProduct(product.id)
      
      if (result.success) {
        // Recarregar lista de produtos do banco
        await loadProducts()
        toast.success('✅ Produto excluído com sucesso!')
      } else {
        toast.error(`❌ Erro ao excluir produto: ${result.error}`)
      }
    } catch (error: any) {
      console.error('Erro ao excluir produto:', error)
      toast.error('❌ Erro ao excluir produto. Tente novamente.')
    }
  }

  const openAddModal = () => {
    resetForm()
    setEditingProduct(null)
    generateInternalCode()
    setIsAddModalOpen(true)
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingProduct(null)
    resetForm()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📦 Gestão de Produtos
        </h1>
        <p className="text-gray-600">Gerencie seu estoque e catálogo de produtos</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Produtos</p>
                <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-3xl font-bold text-green-600">
                  R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estoque Baixo</p>
                <p className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categorias</p>
                <p className="text-3xl font-bold text-purple-600">{mockCategories.length - 1}</p>
              </div>
              <Filter className="w-8 h-8 text-purple-600" />
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
                  placeholder="Buscar produtos por nome, código ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {mockCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <Button 
                variant="outline"
                onClick={() => loadProducts()}
                title="Atualizar lista de produtos"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
              
              <Button onClick={openAddModal}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{product.name}</CardTitle>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <Badge variant={product.stock > product.minStock ? "default" : "destructive"}>
                  {product.stock} un
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Códigos */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">{product.internalCode}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">Código Interno</span>
                </div>
                {product.barcode && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Barcode className="w-4 h-4" />
                    <span>{product.barcode}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Preço de Venda</p>
                  <p className="text-lg font-bold text-green-600">
                    R$ {product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Custo</p>
                  <p className="text-lg font-medium text-gray-700">
                    R$ {product.costPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Badge variant="outline">{product.category}</Badge>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {product.stock <= product.minStock && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">Estoque baixo!</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou adicione novos produtos ao seu estoque.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Adicionar Produto */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Cadastrar Novo Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Códigos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Interno *
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.internalCode}
                        onChange={(e) => handleInputChange('internalCode', e.target.value)}
                        placeholder="PRD001"
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateInternalCode}
                        className="px-3"
                      >
                        Auto
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Barras
                    </label>
                    <Input
                      value={formData.barcode}
                      onChange={(e) => handleInputChange('barcode', e.target.value)}
                      placeholder="7891234567890"
                    />
                  </div>
                </div>

                {/* Nome e Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Smartphone Samsung Galaxy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Ex: Celular Samsung com 128GB"
                  />
                </div>

                {/* Preços */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Custo *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => handleInputChange('costPrice', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Venda *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Estoque */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estoque Inicial *
                    </label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estoque Mínimo *
                    </label>
                    <Input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => handleInputChange('minStock', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {mockCategories.filter(cat => cat !== 'Todas').map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Cadastrar Produto'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Editar Produto */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Editar Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Códigos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código Interno *
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.internalCode}
                        onChange={(e) => handleInputChange('internalCode', e.target.value)}
                        placeholder="PRD001"
                        required
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateInternalCode}
                        className="px-3"
                      >
                        Auto
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Barras
                    </label>
                    <Input
                      value={formData.barcode}
                      onChange={(e) => handleInputChange('barcode', e.target.value)}
                      placeholder="7891234567890"
                    />
                  </div>
                </div>

                {/* Nome e Descrição */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ex: Smartphone Samsung Galaxy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Ex: Celular Samsung com 128GB"
                  />
                </div>

                {/* Preços */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Custo *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => handleInputChange('costPrice', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço de Venda *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Estoque */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estoque Inicial *
                    </label>
                    <Input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estoque Mínimo *
                    </label>
                    <Input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => handleInputChange('minStock', e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {mockCategories.filter(cat => cat !== 'Todas').map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeEditModal}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

