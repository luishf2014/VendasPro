'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getProducts, createSale } from '@/lib/database/queries'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Calculator,
  CreditCard,
  Banknote,
  Smartphone,
  Check,
  Keyboard
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Product {
  id: string
  internalCode: string
  name: string
  price: number
  stock: number
  barcode: string
}

interface CartItem {
  id: string
  internalCode: string
  name: string
  price: number
  quantity: number
  total: number
}

export default function PDVPage() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'pix'>('cash')
  const [barcodeMessage, setBarcodeMessage] = useState('')
  const [isFinalizing, setIsFinalizing] = useState(false)
  
  // Estados para desconto e acréscimo (valor e porcentagem separados)
  const [discount, setDiscount] = useState({ value: 0, percent: 0 })
  const [addition, setAddition] = useState({ value: 0, percent: 0 })
  
  // Refs para navegação por teclado
  const searchInputRef = useRef<HTMLInputElement>(null)
  const discountValueRef = useRef<HTMLInputElement>(null)
  const discountPercentRef = useRef<HTMLInputElement>(null)
  const additionValueRef = useRef<HTMLInputElement>(null)
  const additionPercentRef = useRef<HTMLInputElement>(null)
  const finalizeButtonRef = useRef<HTMLButtonElement>(null)

  // Carregar produtos do banco quando a página carrega
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        const productsData = await getProducts()
        const formattedProducts = productsData.map((p: any) => ({
          id: p.id,
          internalCode: p.internalCode,
          name: p.name,
          price: p.price,
          stock: p.stock,
          barcode: p.barcode
        }))
        setProducts(formattedProducts)
      } catch (error) {
        console.error('Erro ao carregar produtos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
    
    // Focar no campo de busca ao carregar
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }, [])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Verificar se não está digitando em um input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case 'F1':
          e.preventDefault()
          setPaymentMethod('cash')
          toast.success('💵 Pagamento: Dinheiro')
          break
        case 'F2':
          e.preventDefault()
          setPaymentMethod('card')
          toast.success('💳 Pagamento: Cartão')
          break
        case 'F3':
          e.preventDefault()
          setPaymentMethod('pix')
          toast.success('📱 Pagamento: PIX')
          break
        case 'F4':
          e.preventDefault()
          discountValueRef.current?.focus()
          break
        case 'F5':
          e.preventDefault()
          additionValueRef.current?.focus()
          break
        case 'F9':
          e.preventDefault()
          if (cart.length > 0) {
            finalizeSale()
          }
          break
        case 'F10':
          e.preventDefault()
          clearCart()
          break
        case 'F12':
          e.preventDefault()
          searchInputRef.current?.focus()
          break
        case 'Escape':
          searchInputRef.current?.focus()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart.length])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm) ||
    product.internalCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calcular subtotal dos produtos
  const subtotal = cart.reduce((total, item) => total + item.total, 0)

  // Calcular desconto (valor R$ + porcentagem)
  const discountValue = discount.value || 0
  const discountPercent = ((subtotal * (discount.percent || 0)) / 100)
  const discountAmount = discountValue + discountPercent

  // Calcular acréscimo (valor R$ + porcentagem)
  const additionValue = addition.value || 0
  const additionPercent = ((subtotal * (addition.percent || 0)) / 100)
  const additionAmount = additionValue + additionPercent

  // Total final
  const finalTotal = Math.max(0, subtotal - discountAmount + additionAmount)

  // Função para detectar e processar código de barras AUTOMÁTICO
  const handleBarcodeSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
    setBarcodeMessage('')
    
    // Detectar código de barras (números, 8+ dígitos) OU código interno (PRD001)
    const isBarcodePattern = /^\d{8,}$/.test(searchValue)
    const isInternalCodePattern = /^PRD\d{3}$/i.test(searchValue)
    
    if (isBarcodePattern || isInternalCodePattern) {
      const product = products.find(p => 
        p.barcode === searchValue || 
        p.internalCode.toUpperCase() === searchValue.toUpperCase()
      )
      
      if (product && product.stock > 0) {
        // ✅ ADIÇÃO AUTOMÁTICA IMEDIATA!
        addToCart(product)
        setBarcodeMessage(`🛒 ${product.name} adicionado ao carrinho!`)
        
        // Limpar campo e mensagem rapidamente
        setTimeout(() => {
          setSearchTerm('')
          setBarcodeMessage('')
        }, 1500)
        
      } else if (product && product.stock === 0) {
        setBarcodeMessage(`❌ ${product.name} - SEM ESTOQUE!`)
        setTimeout(() => {
          setBarcodeMessage('')
          setSearchTerm('')
        }, 2500)
        
      } else if (isBarcodePattern && searchValue.length >= 10) {
        setBarcodeMessage(`❌ Produto não encontrado!`)
        setTimeout(() => {
          setBarcodeMessage('')
          setSearchTerm('')
        }, 2500)
      }
    }
    
    // Se não for código de barras/interno, manter busca normal
  }

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      const newItem: CartItem = {
        id: product.id,
        internalCode: product.internalCode,
        name: product.name,
        price: product.price,
        quantity: 1,
        total: product.price
      }
      setCart([...cart, newItem])
    }
    
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id)
      return
    }

    setCart(cart.map(item => 
      item.id === id 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const clearCart = useCallback(() => {
    if (cart.length === 0) {
      toast.error('Carrinho já está vazio!')
      return
    }

    setCart([])
    setDiscount({ value: 0, percent: 0 })
    setAddition({ value: 0, percent: 0 })
    toast.success('🧹 Carrinho limpo!')
    
    // Retornar foco para busca
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }, [cart.length])

  const finalizeSale = useCallback(async () => {
    if (cart.length === 0) {
      toast.error('Adicione produtos ao carrinho primeiro!')
      return
    }

    if (isFinalizing) {
      return // Evitar múltiplas chamadas
    }

    setIsFinalizing(true)

    try {
      // Preparar dados da venda
      const saleItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.total
      }))

      // Criar venda no banco de dados
      const result = await createSale({
        userId: user?.id || null,
        items: saleItems,
        subtotal: subtotal,
        discount: discountAmount,
        addition: additionAmount,
        totalAmount: finalTotal,
        paymentMethod: paymentMethod
      })

      if (result.success && result.data) {
        toast.success(`🎉 Venda ${result.data.sale_number} finalizada com sucesso!`)
        
        // Limpar carrinho
        clearCart()
        
        // Aguardar um pouco para garantir que o trigger do banco execute antes de recarregar
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Recarregar produtos para atualizar estoque
        const productsData = await getProducts()
        const formattedProducts = productsData.map((p: any) => ({
          id: p.id,
          internalCode: p.internalCode,
          name: p.name,
          price: p.price,
          stock: p.stock,
          barcode: p.barcode
        }))
        setProducts(formattedProducts)
        
        // Disparar evento customizado para atualizar outras páginas (como a página de produtos)
        // Aguardar um pouco mais para garantir que o estoque tenha sido atualizado
        setTimeout(() => {
          console.log('📢 Disparando evento saleCompleted para atualizar outras páginas')
          window.dispatchEvent(new CustomEvent('saleCompleted', { 
            detail: { saleNumber: result.data.sale_number } 
          }))
        }, 500)
        
        // Retornar foco para busca
        setTimeout(() => {
          searchInputRef.current?.focus()
        }, 100)
      } else {
        toast.error(`Erro ao finalizar venda: ${result.error || 'Erro desconhecido'}`)
      }
    } catch (error: any) {
      console.error('Erro ao finalizar venda:', error)
      toast.error(`Erro ao finalizar venda: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setIsFinalizing(false)
    }
  }, [cart, subtotal, discountValue, discountPercent, discountAmount, additionValue, additionPercent, additionAmount, finalTotal, paymentMethod, user, clearCart, isFinalizing])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div 
      className="h-screen bg-gray-50 overflow-hidden" 
      data-pdv="true"
      style={{ 
        transition: 'none !important', 
        transform: 'none !important',
        animation: 'none !important'
      }}
    >
      <style jsx>{`
        * {
          transition: none !important;
          animation: none !important;
          transform: none !important;
          outline: none !important;
        }
        *:hover,
        *:focus,
        *:focus-visible,
        *:active {
          transform: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
      `}</style>
      <div className="h-full max-w-5xl mx-auto flex flex-col">
        {/* Header Compacto */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            🛒 PDV - Ponto de Venda
          </h1>
          {/* <p className="text-sm text-gray-600 mb-2">Digite o código de barras para adicionar automaticamente</p>
          
          Legenda de Atalhos
          <div className="flex flex-wrap justify-center gap-3 text-xs bg-blue-50 rounded-lg p-2 border border-blue-200">
            <span className="flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              <strong>Atalhos:</strong>
            </span>
            <span className="text-blue-700">F1=Dinheiro</span>
            <span className="text-blue-700">F2=Cartão</span>
            <span className="text-blue-700">F3=PIX</span>
            <span className="text-blue-700">F4=Desconto</span>
            <span className="text-blue-700">F5=Acréscimo</span>
            <span className="text-blue-700">F9=Finalizar</span>
            <span className="text-blue-700">F10=Limpar</span>
            <span className="text-blue-700">F12/ESC=Buscar</span>
          </div> */}
        </div>

        {/* Layout Principal - 2 Colunas */}
        <div className="flex-1 flex gap-4 min-h-0">
          
          {/* Coluna 1 - Busca + Lista de Produtos do Carrinho */}
          <div className="flex-1 flex flex-col min-h-0 lg:min-h-0">
            <Card className="flex flex-col transition-none">
              <CardHeader className="pb-2 sm:pb-3 flex-shrink-0 px-3 sm:px-6">
                <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                  <span className="flex items-center gap-2">
                    <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-sm sm:text-base">Carrinho ({getTotalItems()})</span>
                  </span>
                  <Badge className="text-xs sm:text-sm">R$ {subtotal.toFixed(2)}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col p-3 sm:p-4" style={{ height: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
                {/* Busca de Produtos - Integrada */}
                <div className="flex-shrink-0 mb-3 sm:mb-4">
                  <Input
                    ref={searchInputRef}
                    placeholder="🔍 Código ou nome do produto"
                    value={searchTerm}
                    onChange={(e) => handleBarcodeSearch(e.target.value)}
                    tabIndex={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Se tiver só um produto filtrado, adicionar automaticamente
                        if (filteredProducts.length === 1 && filteredProducts[0].stock > 0) {
                          addToCart(filteredProducts[0])
                          setBarcodeMessage(`🛒 ${filteredProducts[0].name} adicionado!`)
                          setSearchTerm('')
                          setTimeout(() => setBarcodeMessage(''), 1500)
                        }
                      }
                    }}
                    className="w-full text-sm sm:text-lg font-mono rounded-lg border-gray-300 h-9 sm:h-11"
                    autoFocus
                  />
                  
                  {/* Mensagem de feedback */}
                  {barcodeMessage && (
                    <div className={`mt-2 p-2 rounded text-xs sm:text-sm font-medium ${
                      barcodeMessage.includes('🛒') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {barcodeMessage}
                    </div>
                  )}
                </div>

                {/* Lista de Itens - Com Scroll */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto pr-1 sm:pr-2" style={{ maxHeight: 'calc(100vh - 400px)' }}>
                    <div className="space-y-2 pb-4">
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-6 sm:py-8 text-sm">
                          Carrinho vazio
                        </p>
                      ) : (
                        cart.map((item) => (
                          <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded transition-none">
                            <div className="flex-1 min-w-0 mr-2 sm:mr-3">
                              <h4 className="font-medium text-xs sm:text-sm truncate">{item.internalCode} - {item.name}</h4>
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                R$ {item.price.toFixed(2)} × {item.quantity} = R$ {item.total.toFixed(2)}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 sm:h-7 sm:w-7 transition-none"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                              </Button>
                              
                              <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium">
                                {item.quantity}
                              </span>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 sm:h-7 sm:w-7 transition-none"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 sm:h-7 sm:w-7 text-red-600 ml-0.5 sm:ml-1 transition-none"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="w-2 h-2 sm:w-3 sm:h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna 2 - Controles de Finalização */}
          <div className="w-full lg:w-80 flex flex-col min-h-0">
            {cart.length > 0 ? (
              <Card className="flex flex-col transition-none">
                <CardHeader className="pb-2 sm:pb-3 flex-shrink-0 px-3 sm:px-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                    Finalização
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {/* Resumo */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Subtotal:</span>
                      <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                    </div>

                    {/* Desconto */}
                    <div>
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Desconto</label>
                        <span className="text-red-600 text-xs sm:text-sm font-medium">-R$ {discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <div className="relative">
                          <Input
                            ref={discountValueRef}
                            type="number"
                            placeholder="0,00"
                            value={discount.value || ''}
                            onChange={(e) => setDiscount({...discount, value: Number(e.target.value) || 0})}
                            className="text-sm h-9 pr-12 rounded-lg border-gray-300"
                            tabIndex={2}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault()
                                discountPercentRef.current?.focus()
                              }
                            }}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">R$</span>
                        </div>
                        <div className="relative">
                          <Input
                            ref={discountPercentRef}
                            type="number"
                            placeholder="0"
                            value={discount.percent || ''}
                            onChange={(e) => setDiscount({...discount, percent: Number(e.target.value) || 0})}
                            className="text-sm h-9 pr-8 rounded-lg border-gray-300"
                            tabIndex={3}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault()
                                additionValueRef.current?.focus()
                              }
                            }}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Acréscimo */}
                    <div>
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <label className="text-xs sm:text-sm font-medium text-gray-700">Acréscimo</label>
                        <span className="text-green-600 text-xs sm:text-sm font-medium">+R$ {additionAmount.toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <div className="relative">
                          <Input
                            ref={additionValueRef}
                            type="number"
                            placeholder="0,00"
                            value={addition.value || ''}
                            onChange={(e) => setAddition({...addition, value: Number(e.target.value) || 0})}
                            className="text-sm h-9 pr-12 rounded-lg border-gray-300"
                            tabIndex={4}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault()
                                additionPercentRef.current?.focus()
                              }
                            }}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">R$</span>
                        </div>
                        <div className="relative">
                          <Input
                            ref={additionPercentRef}
                            type="number"
                            placeholder="0"
                            value={addition.percent || ''}
                            onChange={(e) => setAddition({...addition, percent: Number(e.target.value) || 0})}
                            className="text-sm h-9 pr-8 rounded-lg border-gray-300"
                            tabIndex={5}
                            onKeyDown={(e) => {
                              if (e.key === 'Tab' && !e.shiftKey) {
                                e.preventDefault()
                                finalizeButtonRef.current?.focus()
                              }
                            }}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Total Final */}
                    <div className="border-t pt-2 sm:pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-bold">Total Final:</span>
                        <span className="text-xl sm:text-2xl font-bold text-green-600">
                          R$ {finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Método de Pagamento */}
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 block">Método de Pagamento</label>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                      {[
                        { value: 'cash', label: 'Dinheiro', icon: Banknote },
                        { value: 'card', label: 'Cartão', icon: CreditCard },
                        { value: 'pix', label: 'PIX', icon: Smartphone }
                      ].map((method, index) => {
                        const Icon = method.icon
                        return (
                            <Button
                              key={method.value}
                              variant={paymentMethod === method.value ? "default" : "outline"}
                              className={`flex flex-col p-2 sm:p-3 h-12 sm:h-16 rounded-lg sm:rounded-xl transition-none ${
                                paymentMethod === method.value 
                                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent' 
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              onClick={() => setPaymentMethod(method.value as any)}
                              tabIndex={6 + index}
                            >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 sm:mb-1" />
                            <span className="text-[10px] sm:text-xs font-medium">{method.label}</span>
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="w-full sm:flex-1 h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 transition-none text-sm"
                      onClick={clearCart}
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Limpar
                    </Button>
                    <Button
                      ref={finalizeButtonRef}
                      className="w-full sm:flex-1 h-10 sm:h-12 text-sm sm:text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg sm:rounded-xl transition-none"
                      onClick={finalizeSale}
                      disabled={isFinalizing}
                      tabIndex={9}
                    >
                      <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {isFinalizing ? 'Finalizando...' : 'Finalizar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center transition-none">
                <CardContent className="text-center p-6 sm:p-8">
                  <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-gray-500">Adicione produtos para<br />finalizar a venda</p>
                </CardContent>
              </Card>
            )}
          </div>
          
        </div>
      </div>
    </div>
  )
}

