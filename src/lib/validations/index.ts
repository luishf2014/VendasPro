import { z } from 'zod'

// Validações de autenticação
export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

export const signUpSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  role: z.enum(['admin', 'manager', 'user']).default('user')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
})

// Validações de usuário
export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'manager', 'user']).default('user')
})

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  role: z.enum(['admin', 'manager', 'user']).optional(),
  active: z.boolean().optional()
})

// Validações de categoria
export const createCategorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional()
})

export const updateCategorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  description: z.string().optional(),
  active: z.boolean().optional()
})

// Validações de produto
export const createProductSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
  cost_price: z.number().min(0, 'Preço de custo deve ser maior ou igual a zero').default(0),
  stock_quantity: z.number().int().min(0, 'Quantidade deve ser maior ou igual a zero').default(0),
  min_stock: z.number().int().min(0, 'Estoque mínimo deve ser maior ou igual a zero').default(0),
  barcode: z.string().optional(),
  category_id: z.string().uuid('ID da categoria inválido').optional()
})

export const updateProductSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a zero').optional(),
  cost_price: z.number().min(0, 'Preço de custo deve ser maior ou igual a zero').optional(),
  stock_quantity: z.number().int().min(0, 'Quantidade deve ser maior ou igual a zero').optional(),
  min_stock: z.number().int().min(0, 'Estoque mínimo deve ser maior ou igual a zero').optional(),
  barcode: z.string().optional(),
  category_id: z.string().uuid('ID da categoria inválido').optional(),
  active: z.boolean().optional()
})

// Validações de cliente
export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  document: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional()
})

export const updateCustomerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  document: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  active: z.boolean().optional()
})

// Validações de venda
export const saleItemSchema = z.object({
  product_id: z.string().uuid('ID do produto inválido'),
  quantity: z.number().int().min(1, 'Quantidade deve ser maior que zero'),
  unit_price: z.number().min(0, 'Preço unitário deve ser maior ou igual a zero')
})

export const createSaleSchema = z.object({
  customer_id: z.string().uuid('ID do cliente inválido').optional(),
  items: z.array(saleItemSchema).min(1, 'Deve ter pelo menos um item'),
  discount: z.number().min(0, 'Desconto deve ser maior ou igual a zero').default(0),
  payment_method: z.enum(['cash', 'card', 'pix']),
  notes: z.string().optional()
})

export const updateSaleSchema = z.object({
  customer_id: z.string().uuid('ID do cliente inválido').optional(),
  discount: z.number().min(0, 'Desconto deve ser maior ou igual a zero').optional(),
  payment_method: z.enum(['cash', 'card', 'pix']).optional(),
  status: z.enum(['pending', 'completed', 'cancelled']).optional(),
  notes: z.string().optional()
})

// Validações de filtros e paginação
export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Página deve ser maior que zero').default(1),
  limit: z.number().int().min(1, 'Limite deve ser maior que zero').max(100, 'Limite não pode ser maior que 100').default(10)
})

export const filterSchema = z.object({
  search: z.string().optional(),
  category_id: z.string().uuid('ID da categoria inválido').optional(),
  active: z.boolean().optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional()
})

// Tipos exportados
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type CreateSaleInput = z.infer<typeof createSaleSchema>
export type UpdateSaleInput = z.infer<typeof updateSaleSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type FilterInput = z.infer<typeof filterSchema>
