// Tipos base do sistema
export type Role = 'admin' | 'manager' | 'user'
export type PaymentMethod = 'cash' | 'card' | 'pix'
export type SaleStatus = 'pending' | 'completed' | 'cancelled'

// Tipos de usuário
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  active: boolean
  created_at: string
  updated_at: string
}

// Tipos de categoria
export interface Category {
  id: string
  name: string
  description?: string
  active: boolean
  created_at: string
  updated_at: string
}

// Tipos de produto
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  cost_price: number
  stock_quantity: number
  min_stock: number
  barcode?: string
  category_id?: string
  category?: Category
  active: boolean
  created_at: string
  updated_at: string
}

// Tipos de cliente
export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  document?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  total_purchases: number
  last_purchase_date?: string
  active: boolean
  created_at: string
  updated_at: string
}

// Tipos de venda
export interface Sale {
  id: string
  sale_number: string
  customer_id?: string
  customer?: Customer
  user_id?: string
  user?: User
  total_amount: number
  discount: number
  payment_method: PaymentMethod
  status: SaleStatus
  notes?: string
  created_at: string
  updated_at: string
  items?: SaleItem[]
}

// Tipos de item de venda
export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  product?: Product
  quantity: number
  unit_price: number
  total_price: number
  created_at: string
}

// Tipos para formulários
export interface CreateUserData {
  name: string
  email: string
  password: string
  role: Role
}

export interface CreateCategoryData {
  name: string
  description?: string
}

export interface CreateProductData {
  name: string
  description?: string
  price: number
  cost_price: number
  stock_quantity: number
  min_stock: number
  barcode?: string
  category_id?: string
}

export interface CreateCustomerData {
  name: string
  email?: string
  phone?: string
  document?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
}

export interface CreateSaleData {
  customer_id?: string
  items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
  discount?: number
  payment_method: PaymentMethod
  notes?: string
}

// Tipos para estatísticas do dashboard
export interface DashboardStats {
  total_sales_today: number
  total_sales_month: number
  total_products: number
  total_customers: number
  low_stock_products: number
  recent_sales: Sale[]
  top_products: Array<{
    product: Product
    total_sold: number
    revenue: number
  }>
}

// Tipos para filtros e paginação
export interface PaginationParams {
  page: number
  limit: number
}

export interface FilterParams {
  search?: string
  category_id?: string
  active?: boolean
  date_from?: string
  date_to?: string
}

// Tipos para API responses
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Tipos para autenticação
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    name?: string
    role?: Role
  }
}

export interface Session {
  access_token: string
  refresh_token: string
  expires_at: number
  user: AuthUser
}

// Tipos para contextos
export interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: CreateUserData) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

// Tipos para hooks
export interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Tipos para configuração
export interface AppConfig {
  app_name: string
  app_version: string
  pagination_limit: number
  currency: string
  locale: string
}
