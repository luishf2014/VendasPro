import { supabase } from '../supabase'
import { Role } from '@/types'

// Função para buscar estatísticas do dashboard
export async function getDashboardStats(userId: string) {
  try {
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

    // Vendas de hoje
    const { data: salesToday } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('created_at', startOfToday.toISOString())
      .lt('created_at', new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000).toISOString())

    // Vendas de ontem
    const { data: salesYesterday } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('created_at', startOfYesterday.toISOString())
      .lt('created_at', startOfToday.toISOString())

    // Vendas do mês
    const { data: salesMonth } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString())

    // Total de produtos
    const { data: products } = await supabase
      .from('products')
      .select('id, stock_quantity, min_stock')
      .eq('active', true)

    // Vendas totais para calcular ticket médio
    const { data: allSales } = await supabase
      .from('sales')
      .select('total_amount')
      .eq('status', 'completed')

    // Calcular totais
    const salesTodayTotal = salesToday?.reduce((sum: number, sale: any) => sum + sale.total_amount, 0) || 0
    const salesYesterdayTotal = salesYesterday?.reduce((sum: number, sale: any) => sum + sale.total_amount, 0) || 0
    const salesMonthTotal = salesMonth?.reduce((sum: number, sale: any) => sum + sale.total_amount, 0) || 0
    
    // Calcular crescimento
    const salesGrowth = salesYesterdayTotal > 0 
      ? ((salesTodayTotal - salesYesterdayTotal) / salesYesterdayTotal) * 100 
      : 0

    // Produtos com estoque baixo
    const lowStockProducts = products?.filter((product: any) => 
      product.stock_quantity <= product.min_stock
    ).length || 0

    // Ticket médio
    const totalSalesAmount = allSales?.reduce((sum: number, sale: any) => sum + sale.total_amount, 0) || 0
    const totalSalesCount = allSales?.length || 0
    const averageTicket = totalSalesCount > 0 ? totalSalesAmount / totalSalesCount : 0

    return {
      sales_today: salesTodayTotal,
      sales_month: salesMonthTotal,
      sales_growth: Number(salesGrowth.toFixed(1)),
      total_products: products?.length || 0,
      low_stock_products: lowStockProducts,
      average_ticket: Number(averageTicket.toFixed(2))
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return {
      sales_today: 0,
      sales_month: 0,
      sales_growth: 0,
      total_products: 0,
      low_stock_products: 0,
      average_ticket: 0
    }
  }
}

// Função para buscar faturamento diário (últimos N dias)
export async function getDailyRevenue(days: number = 7) {
  try {
    const today = new Date()
    today.setHours(23, 59, 59, 999) // Fim do dia de hoje
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - (days - 1))
    startDate.setHours(0, 0, 0, 0) // Início do primeiro dia

    console.log('📊 Buscando faturamento diário:', {
      startDate: startDate.toISOString(),
      endDate: today.toISOString(),
      days
    })

    // Buscar todas as vendas do período
    const { data: sales, error } = await supabase
      .from('sales')
      .select('total_amount, created_at')
      .eq('status', 'completed')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar faturamento diário:', error)
      return []
    }

    console.log(`✅ Encontradas ${sales?.length || 0} vendas no período`)

    // Agrupar vendas por dia
    const dailyRevenue: { [key: string]: number } = {}
    
    // Inicializar todos os dias com 0
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateKey = date.toISOString().split('T')[0] // YYYY-MM-DD
      dailyRevenue[dateKey] = 0
    }

    // Somar vendas por dia
    sales?.forEach((sale: any) => {
      const saleDate = new Date(sale.created_at)
      const dateKey = saleDate.toISOString().split('T')[0]
      if (dailyRevenue.hasOwnProperty(dateKey)) {
        dailyRevenue[dateKey] += sale.total_amount
      }
    })

    // Converter para array e formatar
    const result = Object.entries(dailyRevenue)
      .map(([date, revenue]) => {
        const dateObj = new Date(date + 'T00:00:00')
        return {
          date: date,
          dateFormatted: dateObj.toLocaleDateString('pt-BR', { 
            weekday: 'short', 
            day: '2-digit', 
            month: 'short' 
          }),
          revenue: Number(revenue.toFixed(2)),
          dayOfWeek: dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })
        }
      })
      .sort((a, b) => a.date.localeCompare(b.date)) // Ordenar por data

    return result
  } catch (error) {
    console.error('Erro ao buscar faturamento diário:', error)
    return []
  }
}

// Função para buscar vendas recentes
export async function getRecentSales(limit: number = 3) {
  try {
    const { data: sales } = await supabase
      .from('sales')
      .select(`
        id,
        sale_number,
        total_amount,
        payment_method,
        created_at
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(limit)

    return sales?.map((sale: any) => ({
      id: sale.id,
      sale_number: sale.sale_number,
      customer_name: 'Venda Direta', // Sem clientes, todas são vendas diretas
      total_amount: sale.total_amount,
      payment_method: sale.payment_method,
      created_at: sale.created_at
    })) || []
  } catch (error) {
    console.error('Erro ao buscar vendas recentes:', error)
    return []
  }
}

// Função para buscar histórico completo de vendas
export async function getSalesHistory(limit: number = 50) {
  try {
    const { data: sales } = await supabase
      .from('sales')
      .select(`
        id,
        sale_number,
        total_amount,
        discount,
        payment_method,
        status,
        notes,
        created_at,
        users (
          name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    return sales?.map((sale: any) => ({
      id: sale.id,
      sale_number: sale.sale_number,
      total_amount: sale.total_amount,
      discount: sale.discount || 0,
      payment_method: sale.payment_method,
      status: sale.status,
      notes: sale.notes,
      created_at: sale.created_at,
      user_name: sale.users?.name || 'Sistema'
    })) || []
  } catch (error) {
    console.error('Erro ao buscar histórico de vendas:', error)
    return []
  }
}

// Função para buscar estatísticas de vendas
export async function getSalesStats() {
  try {
    const { data: allSales } = await supabase
      .from('sales')
      .select('total_amount, status, created_at')

    const { data: saleItems } = await supabase
      .from('sale_items')
      .select('quantity, sale_id')

    const completedSales = allSales?.filter((sale: any) => sale.status === 'completed') || []
    const cancelledSales = allSales?.filter((sale: any) => sale.status === 'cancelled') || []
    const pendingSales = allSales?.filter((sale: any) => sale.status === 'pending') || []
    const totalSales = allSales?.length || 0
    const totalRevenue = completedSales.reduce((sum: number, sale: any) => sum + sale.total_amount, 0)
    const cancelledRevenue = cancelledSales.reduce((sum: number, sale: any) => sum + sale.total_amount, 0)
    const averageTicket = completedSales.length > 0 ? totalRevenue / completedSales.length : 0
    
    // Calcular total de itens vendidos (apenas vendas completadas)
    const completedSaleIds = new Set(completedSales.map((sale: any) => sale.id))
    const totalItems = saleItems?.filter((item: any) => 
      completedSaleIds.has(item.sale_id)
    ).reduce((sum: number, item: any) => sum + item.quantity, 0) || 0

    return {
      total_sales: totalSales,
      total_revenue: totalRevenue,
      cancelled_revenue: cancelledRevenue,
      average_ticket: averageTicket,
      total_items: totalItems,
      completed_sales: completedSales.length,
      cancelled_sales: cancelledSales.length,
      pending_sales: pendingSales.length
    }
  } catch (error) {
    console.error('Erro ao buscar estatísticas de vendas:', error)
    return {
      total_sales: 0,
      total_revenue: 0,
      cancelled_revenue: 0,
      average_ticket: 0,
      total_items: 0,
      completed_sales: 0,
      cancelled_sales: 0,
      pending_sales: 0
    }
  }
}

// Função para buscar todos os produtos
export async function getProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        cost_price,
        stock_quantity,
        min_stock,
        barcode,
        active,
        created_at,
        updated_at,
        categories (
          name
        )
      `)
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar produtos:', error)
      return []
    }

    return products?.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      costPrice: product.cost_price,
      stock: product.stock_quantity,
      minStock: product.min_stock,
      barcode: product.barcode || '',
      category: product.categories?.name || 'Sem categoria',
      active: product.active,
      createdAt: product.created_at,
      // Gerar código interno baseado no ID do banco
      internalCode: `PRD${String(parseInt(product.id.slice(-6), 36) % 999 + 1).padStart(3, '0')}`
    })) || []
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return []
  }
}

// Função auxiliar para buscar ou criar categoria por nome
async function getOrCreateCategory(categoryName: string): Promise<string | null> {
  if (!categoryName || categoryName === 'Sem categoria') {
    return null
  }

  try {
    // Buscar categoria existente
    const { data: existingCategory, error: searchError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .eq('active', true)
      .single()

    if (existingCategory && !searchError) {
      return existingCategory.id
    }

    // Se não existir, criar nova categoria
    const { data: newCategory, error: createError } = await supabase
      .from('categories')
      .insert([{ name: categoryName }])
      .select('id')
      .single()

    if (newCategory && !createError) {
      return newCategory.id
    }

    console.warn(`Não foi possível criar/buscar categoria: ${categoryName}`, createError)
    return null
  } catch (error) {
    console.error(`Erro ao buscar/criar categoria ${categoryName}:`, error)
    return null
  }
}

// Função para cadastrar novo produto
export async function createProduct(productData: {
  name: string
  description?: string
  price: number
  cost_price: number
  stock_quantity: number
  min_stock: number
  barcode?: string
  category_id?: string
  category_name?: string // Novo campo para aceitar nome da categoria
}) {
  try {
    // Verificar permissões ANTES de tentar criar
    const { hasPermission, userRole } = await checkProductManagementPermission()
    
    if (!hasPermission) {
      const roleMessage = userRole === 'user' 
        ? 'Você precisa ser Administrador ou Gerente para criar produtos.'
        : 'Você não tem permissão para criar produtos.'
      
      console.warn('⚠️ Usuário sem permissão para criar produto. Role:', userRole)
      return { 
        success: false, 
        error: `❌ Acesso negado: ${roleMessage} Entre em contato com um administrador para obter as permissões necessárias.` 
      }
    }

    // Se category_name foi fornecido, buscar ou criar a categoria
    let categoryId = productData.category_id
    if (productData.category_name && !categoryId) {
      categoryId = await getOrCreateCategory(productData.category_name) || undefined
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: productData.name,
        description: productData.description,
        price: productData.price,
        cost_price: productData.cost_price,
        stock_quantity: productData.stock_quantity,
        min_stock: productData.min_stock,
        barcode: productData.barcode,
        category_id: categoryId
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar produto:', error)
      
      // Tratar erros específicos com mensagens amigáveis
      if (error.code === 'PGRST116' || error.message?.includes('Cannot coerce') || error.message?.includes('permission')) {
        return { 
          success: false, 
          error: '❌ Você não tem permissão para criar produtos. Entre em contato com um administrador.' 
        }
      }
      
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Erro ao criar produto:', error)
    
    // Se o erro for relacionado a permissão, mostrar mensagem amigável
    if (error.message?.includes('permission') || error.message?.includes('PGRST116')) {
      return { 
        success: false, 
        error: '❌ Você não tem permissão para criar produtos. Entre em contato com um administrador.' 
      }
    }
    
    return { success: false, error: 'Erro interno do servidor' }
  }
}

// Função para buscar produtos com estoque baixo
export async function getLowStockProducts(limit: number = 5) {
  try {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, stock_quantity, min_stock')
      .eq('active', true)
      .order('stock_quantity', { ascending: true })
      .limit(limit * 2) // Buscamos mais para filtrar depois

    const lowStockProducts = products?.filter((product: any) => 
      product.stock_quantity <= product.min_stock
    ).slice(0, limit) || []

    return lowStockProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      stock: product.stock_quantity,
      min_stock: product.min_stock
    }))
  } catch (error) {
    console.error('Erro ao buscar produtos com estoque baixo:', error)
    return []
  }
}

// Função auxiliar para verificar se o usuário tem permissão para gerenciar usuários (admin e manager)
async function checkUserManagementPermission(): Promise<{ hasPermission: boolean; userRole?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { hasPermission: false }
    }

    // Buscar o perfil do usuário para verificar o role
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('role, active')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !userProfile) {
      console.warn('⚠️ Não foi possível verificar permissões do usuário:', error)
      return { hasPermission: false }
    }

    // Admin e Manager podem gerenciar usuários
    const hasPermission = userProfile.active && (userProfile.role === 'admin' || userProfile.role === 'manager')
    
    return { 
      hasPermission, 
      userRole: userProfile.role 
    }
  } catch (error) {
    console.error('Erro ao verificar permissões:', error)
    return { hasPermission: false }
  }
}

// Função auxiliar para verificar se o usuário tem permissão para gerenciar produtos
async function checkProductManagementPermission(): Promise<{ hasPermission: boolean; userRole?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { hasPermission: false }
    }

    // Buscar o perfil do usuário para verificar o role
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('role, active')
      .eq('id', user.id)
      .maybeSingle()

    if (error || !userProfile) {
      console.warn('⚠️ Não foi possível verificar permissões do usuário:', error)
      return { hasPermission: false }
    }

    const hasPermission = userProfile.active && (userProfile.role === 'admin' || userProfile.role === 'manager')
    
    return { 
      hasPermission, 
      userRole: userProfile.role 
    }
  } catch (error) {
    console.error('Erro ao verificar permissões:', error)
    return { hasPermission: false }
  }
}

// Função para atualizar um produto
export async function updateProduct(productId: string, productData: {
  name?: string
  description?: string
  price?: number
  cost_price?: number
  stock_quantity?: number
  min_stock?: number
  barcode?: string
  category_id?: string
  category_name?: string // Novo campo para aceitar nome da categoria
  active?: boolean
}) {
  try {
    console.log('🔄 Atualizando produto:', productId, productData)
    
    // Verificar permissões ANTES de tentar atualizar
    const { hasPermission, userRole } = await checkProductManagementPermission()
    
    if (!hasPermission) {
      const roleMessage = userRole === 'user' 
        ? 'Você precisa ser Administrador ou Gerente para editar produtos.'
        : 'Você não tem permissão para editar produtos.'
      
      console.warn('⚠️ Usuário sem permissão para atualizar produto. Role:', userRole)
      return { 
        success: false, 
        error: `❌ Acesso negado: ${roleMessage} Entre em contato com um administrador para obter as permissões necessárias.` 
      }
    }
    
    // Se category_name foi fornecido, buscar ou criar a categoria
    let categoryId = productData.category_id
    if (productData.category_name && !categoryId) {
      categoryId = await getOrCreateCategory(productData.category_name) || undefined
      console.log(`📁 Categoria "${productData.category_name}" -> ID: ${categoryId}`)
    }

    const updateData: any = {}
    if (productData.name !== undefined) updateData.name = productData.name
    if (productData.description !== undefined) updateData.description = productData.description
    if (productData.price !== undefined) updateData.price = productData.price
    if (productData.cost_price !== undefined) updateData.cost_price = productData.cost_price
    if (productData.stock_quantity !== undefined) updateData.stock_quantity = productData.stock_quantity
    if (productData.min_stock !== undefined) updateData.min_stock = productData.min_stock
    if (productData.barcode !== undefined) updateData.barcode = productData.barcode || null
    if (categoryId !== undefined) updateData.category_id = categoryId
    if (productData.active !== undefined) updateData.active = productData.active

    console.log('📝 Dados para atualizar:', updateData)

    // Verificar se o produto existe
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id, name, active')
      .eq('id', productId)
      .maybeSingle()

    if (checkError) {
      console.error('❌ Erro ao verificar produto:', checkError)
      return { success: false, error: `Erro ao verificar produto: ${checkError.message}` }
    }

    if (!existingProduct) {
      console.error('❌ Produto não encontrado:', productId)
      return { success: false, error: 'Produto não encontrado.' }
    }

    if (!existingProduct.active) {
      console.warn('⚠️ Produto está desativado:', existingProduct.name)
    }

    // Verificar se há dados para atualizar
    if (Object.keys(updateData).length === 0) {
      console.warn('⚠️ Nenhum dado para atualizar')
      return { success: false, error: 'Nenhum dado foi fornecido para atualização' }
    }

    // Atualizar o produto (sem .single() para evitar erro se nenhuma linha for retornada)
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', productId)
      .select()

    if (error) {
      console.error('❌ Erro ao atualizar produto:', error)
      
      // Tratar erros específicos com mensagens amigáveis
      if (error.code === 'PGRST116' || error.message?.includes('Cannot coerce')) {
        return { 
          success: false, 
          error: '❌ Você não tem permissão para editar produtos. Entre em contato com um administrador.' 
        }
      }
      
      return { success: false, error: error.message || 'Erro ao atualizar produto' }
    }

    // Verificar se alguma linha foi atualizada
    if (!data || data.length === 0) {
      console.error('❌ Nenhuma linha foi atualizada. Problema de permissão RLS.')
      return { 
        success: false, 
        error: '❌ Você não tem permissão para editar produtos. Entre em contato com um administrador para obter as permissões necessárias.' 
      }
    }

    console.log('✅ Produto atualizado com sucesso:', data[0])
    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error('❌ Erro ao atualizar produto:', error)
    
    // Se o erro for relacionado a permissão, mostrar mensagem amigável
    if (error.message?.includes('permission') || error.message?.includes('PGRST116')) {
      return { 
        success: false, 
        error: '❌ Você não tem permissão para editar produtos. Entre em contato com um administrador.' 
      }
    }
    
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}

// Função para excluir (desativar) um produto
export async function deleteProduct(productId: string) {
  try {
    // Não deletamos fisicamente, apenas desativamos
    const { data, error } = await supabase
      .from('products')
      .update({ active: false })
      .eq('id', productId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao excluir produto:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error('Erro ao excluir produto:', error)
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}

// Função para gerar número de venda único
async function generateSaleNumber(): Promise<string> {
  try {
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '') // YYYYMMDD
    
    // Buscar última venda do dia
    const { data: lastSale } = await supabase
      .from('sales')
      .select('sale_number')
      .like('sale_number', `VND${dateStr}%`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let sequence = 1
    if (lastSale?.sale_number) {
      // Extrair sequência do número da última venda
      const lastSequence = parseInt(lastSale.sale_number.slice(-4)) || 0
      sequence = lastSequence + 1
    }

    return `VND${dateStr}${String(sequence).padStart(4, '0')}`
  } catch (error) {
    console.error('Erro ao gerar número de venda:', error)
    // Fallback: usar timestamp
    return `VND${Date.now()}`
  }
}

// Função para criar uma venda completa
export async function createSale(saleData: {
  userId: string | null
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  subtotal: number
  discount: number
  addition: number
  totalAmount: number
  paymentMethod: 'cash' | 'card' | 'pix'
  notes?: string | null
}) {
  try {
    // Gerar número de venda único
    const saleNumber = await generateSaleNumber()

    // Preparar notas incluindo desconto e acréscimo
    const notesWithDetails = saleData.notes 
      ? saleData.notes 
      : (saleData.addition > 0 || saleData.discount > 0 
          ? `Subtotal: R$ ${saleData.subtotal.toFixed(2)} | Desconto: R$ ${saleData.discount.toFixed(2)} | Acréscimo: R$ ${saleData.addition.toFixed(2)}`
          : null)

    // Criar a venda
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([{
        sale_number: saleNumber,
        user_id: saleData.userId,
        total_amount: saleData.totalAmount,
        discount: saleData.discount,
        payment_method: saleData.paymentMethod,
        status: 'completed',
        notes: notesWithDetails
      }])
      .select()
      .single()

    if (saleError) {
      console.error('Erro ao criar venda:', saleError)
      return { success: false, error: saleError.message }
    }

    // Criar os itens da venda
    const saleItems = saleData.items.map(item => ({
      sale_id: sale.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice
    }))

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems)

    if (itemsError) {
      console.error('Erro ao criar itens da venda:', itemsError)
      // Tentar deletar a venda criada
      await supabase.from('sales').delete().eq('id', sale.id)
      return { success: false, error: itemsError.message }
    }

    // Atualizar estoque manualmente para garantir que funcione
    // O trigger também deve atualizar, mas fazemos manualmente como garantia
    for (const item of saleData.items) {
      try {
        // Buscar produto atual
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('stock_quantity, name')
          .eq('id', item.productId)
          .single()

        if (product && !productError) {
          const newStock = Math.max(0, product.stock_quantity - item.quantity)
          
          console.log(`Atualizando estoque: ${product.name} - De ${product.stock_quantity} para ${newStock} (vendido: ${item.quantity})`)
          
          // Atualizar estoque subtraindo a quantidade vendida
          const { error: updateError } = await supabase
            .from('products')
            .update({ 
              stock_quantity: newStock
            })
            .eq('id', item.productId)

          if (updateError) {
            console.error(`Erro ao atualizar estoque do produto ${item.productId} (${product.name}):`, updateError)
            // Não falhar a venda por causa disso, apenas logar o erro
          } else {
            console.log(`✅ Estoque atualizado com sucesso para ${product.name}`)
          }
        } else {
          console.error(`Produto não encontrado: ${item.productId}`, productError)
        }
      } catch (error) {
        console.error(`Erro ao processar atualização de estoque para produto ${item.productId}:`, error)
      }
    }

    return { 
      success: true, 
      data: {
        id: sale.id,
        sale_number: sale.sale_number
      }
    }
  } catch (error: any) {
    console.error('Erro ao criar venda:', error)
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}

// Função para cancelar uma venda
export async function cancelSale(saleId: string) {
  try {
    // Buscar a venda e seus itens
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .select(`
        id,
        status,
        sale_items (
          id,
          product_id,
          quantity
        )
      `)
      .eq('id', saleId)
      .single()

    if (saleError) {
      console.error('Erro ao buscar venda:', saleError)
      return { success: false, error: saleError.message }
    }

    if (sale.status === 'cancelled') {
      return { success: false, error: 'Venda já está cancelada' }
    }

    // Atualizar status da venda para cancelled
    const { error: updateError } = await supabase
      .from('sales')
      .update({ status: 'cancelled' })
      .eq('id', saleId)

    if (updateError) {
      console.error('Erro ao cancelar venda:', updateError)
      return { success: false, error: updateError.message }
    }

    // Restaurar estoque dos produtos (o trigger do banco faz isso automaticamente quando deletamos os itens)
    // Mas como estamos apenas mudando o status, precisamos restaurar manualmente
    if (sale.sale_items && sale.sale_items.length > 0) {
      for (const item of sale.sale_items) {
        // Buscar produto atual
        const { data: product } = await supabase
          .from('products')
          .select('stock_quantity')
          .eq('id', item.product_id)
          .single()

        if (product) {
          // Restaurar estoque
          const { error: stockError } = await supabase
            .from('products')
            .update({ 
              stock_quantity: product.stock_quantity + item.quantity 
            })
            .eq('id', item.product_id)

          if (stockError) {
            console.error(`Erro ao restaurar estoque do produto ${item.product_id}:`, stockError)
            // Continuar mesmo se houver erro no estoque
          }
        }
      }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao cancelar venda:', error)
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}

// Função para buscar todos os usuários (apenas para admin e managers)
export async function getUsers() {
  try {
    // Verificar permissões
    const { hasPermission, userRole } = await checkUserManagementPermission()
    
    console.log('🔍 Verificando permissões...', { hasPermission, userRole })
    
    if (!hasPermission) {
      console.warn('⚠️ Usuário sem permissão para listar usuários. Role:', userRole)
      return []
    }

    console.log('🔍 Buscando todos os usuários...')
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      console.error('Código do erro:', error.code)
      console.error('Mensagem:', error.message)
      console.error('Detalhes completos:', JSON.stringify(error, null, 2))
      return []
    }

    console.log(`✅ Encontrados ${users?.length || 0} usuários:`, users?.map((u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role })))
    return users || []
  } catch (error) {
    console.error('❌ Erro ao buscar usuários:', error)
    return []
  }
}

// Função para criar um novo usuário (apenas para managers)
export async function createUser(userData: {
  name: string
  email: string
  password: string
  role: Role
}) {
  try {
    // Verificar permissões ANTES de tentar criar
    const { hasPermission, userRole } = await checkUserManagementPermission()
    
    if (!hasPermission) {
      const roleMessage = userRole === 'user' 
        ? 'Você precisa ser Administrador ou Gerente para criar usuários.'
        : 'Você não tem permissão para criar usuários.'
      
      console.warn('⚠️ Usuário sem permissão para criar usuário. Role:', userRole)
      return { 
        success: false, 
        error: `❌ Acesso negado: ${roleMessage}` 
      }
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          role: userData.role
        }
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário no auth:', authError)
      return { success: false, error: authError.message }
    }

    if (!authData.user) {
      return { success: false, error: 'Erro ao criar usuário' }
    }

    // Aguardar um pouco para o trigger criar o perfil
    await new Promise(resolve => setTimeout(resolve, 500))

    // Verificar se o perfil foi criado
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle()

    if (profileError || !userProfile) {
      // Se o trigger não criou, criar manualmente
      const { data: createdProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          active: true
        })
        .select()
        .single()

      if (createError) {
        console.error('Erro ao criar perfil do usuário:', createError)
        return { success: false, error: 'Usuário criado mas erro ao criar perfil' }
      }

      return { success: true, data: createdProfile }
    }

    return { success: true, data: userProfile }
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error)
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}

// Função para atualizar um usuário (apenas para managers)
export async function updateUser(userId: string, userData: {
  name?: string
  email?: string
  role?: Role
  active?: boolean
}) {
  try {
    console.log('🔄 Iniciando atualização de usuário:', userId)
    console.log('📋 Dados a atualizar:', userData)
    
    // Verificar permissões
    const { hasPermission, userRole } = await checkUserManagementPermission()
    
    console.log('🔐 Verificação de permissões:', { hasPermission, userRole })
    
    if (!hasPermission) {
      console.warn('⚠️ Permissão negada para atualizar usuário')
      return { 
        success: false, 
        error: '❌ Você precisa ser Administrador ou Gerente para atualizar usuários.' 
      }
    }

    // Construir objeto de atualização apenas com campos definidos
    const updateData: any = {}
    if (userData.name !== undefined) updateData.name = userData.name
    if (userData.email !== undefined) updateData.email = userData.email
    if (userData.role !== undefined) updateData.role = userData.role
    if (userData.active !== undefined) updateData.active = userData.active
    
    // Adicionar updated_at
    updateData.updated_at = new Date().toISOString()

    console.log('📝 Dados finais para atualização:', updateData)

    // Tentar atualizar
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar usuário no Supabase:', error)
      console.error('Código do erro:', error.code)
      console.error('Mensagem:', error.message)
      console.error('Detalhes:', error.details)
      console.error('Hint:', error.hint)
      
      // Verificar se é erro de política RLS
      if (error.code === '42501' || error.message.includes('policy')) {
        return { 
          success: false, 
          error: '❌ Erro de permissão: As políticas RLS podem precisar ser atualizadas. Execute o script fix_user_update_policies.sql no Supabase.' 
        }
      }
      
      return { success: false, error: `❌ ${error.message}` }
    }

    console.log('✅ Usuário atualizado com sucesso:', data)
    return { success: true, data }
  } catch (error: any) {
    console.error('❌ Erro inesperado ao atualizar usuário:', error)
    return { success: false, error: error.message || 'Erro interno do servidor' }
  }
}