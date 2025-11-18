import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export function generateSaleNumber(): string {
  const now = new Date()
  const timestamp = now.getTime().toString().slice(-8)
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `VND-${timestamp}-${random}`
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
} as const

export type Role = typeof ROLES[keyof typeof ROLES]

export function hasPermission(userRole: Role, requiredRole: Role): boolean {
  const hierarchy = {
    admin: 3,
    manager: 2,
    user: 1
  }
  
  return hierarchy[userRole] >= hierarchy[requiredRole]
}

// Função para formatar telefone brasileiro: (11) 99999-9999
export function formatPhone(value: string): string {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limitedNumbers = numbers.slice(0, 11)
  
  // Aplica a máscara
  if (limitedNumbers.length === 0) {
    return ''
  } else if (limitedNumbers.length <= 2) {
    return `(${limitedNumbers}`
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`
  }
}

// Função para remover formatação do telefone (apenas números)
export function unformatPhone(value: string): string {
  return value.replace(/\D/g, '')
}