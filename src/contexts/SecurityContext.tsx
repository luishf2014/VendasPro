'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useInactivityTimer } from '@/hooks/useInactivityTimer'
import toast from 'react-hot-toast'

interface SecurityConfig {
  inactivityTimeout: number // em minutos
  warningTime: number // em minutos antes do timeout
  logoutOnPageClose: boolean
  enableWarnings: boolean
}

interface SecurityContextType {
  config: SecurityConfig
  updateConfig: (newConfig: Partial<SecurityConfig>) => void
  isWarningActive: boolean
  extendSession: () => void
  remainingTime: number
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

export function useSecurityContext() {
  const context = useContext(SecurityContext)
  if (context === undefined) {
    throw new Error('useSecurityContext deve ser usado dentro do SecurityProvider')
  }
  return context
}

interface SecurityProviderProps {
  children: React.ReactNode
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  const { signOut, user } = useAuth()
  const [isWarningActive, setIsWarningActive] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  
  // Configurações padrão de segurança para PDV
  const [config, setConfig] = useState<SecurityConfig>({
    inactivityTimeout: 30, // 30 minutos de inatividade
    warningTime: 5, // avisar 5 minutos antes
    logoutOnPageClose: true, // logout ao fechar aba
    enableWarnings: true
  })

  // Converter minutos para milissegundos
  const inactivityTimeMs = config.inactivityTimeout * 60 * 1000
  const warningTimeMs = config.warningTime * 60 * 1000

  const handleInactivity = useCallback(async () => {
    console.log('🔒 Fazendo logout por inatividade...')
    toast.error('Sessão expirada por inatividade. Faça login novamente.')
    await signOut()
  }, [signOut])

  const handleWarning = useCallback(() => {
    if (!config.enableWarnings) return
    
    setIsWarningActive(true)
    setRemainingTime(config.warningTime)
    
    // Countdown do tempo restante
    const countdown = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          setIsWarningActive(false)
          return 0
        }
        return prev - 1
      })
    }, 60000) // atualizar a cada minuto

    toast.error(
      `⚠️ Sua sessão expirará em ${config.warningTime} minutos por inatividade!`,
      {
        duration: warningTimeMs,
        id: 'inactivity-warning'
      }
    )
  }, [config.enableWarnings, config.warningTime, warningTimeMs])

  const extendSession = useCallback(() => {
    setIsWarningActive(false)
    setRemainingTime(0)
    toast.dismiss('inactivity-warning')
    toast.success('Sessão estendida com sucesso!')
  }, [])

  // Hook de inatividade
  const { resetTimer } = useInactivityTimer({
    onInactive: handleInactivity,
    inactivityTime: inactivityTimeMs,
    warningTime: config.enableWarnings ? warningTimeMs : undefined,
    onWarning: handleWarning
  })

  const updateConfig = useCallback((newConfig: Partial<SecurityConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
    // Salvar configurações no localStorage
    localStorage.setItem('pdv-security-config', JSON.stringify({ ...config, ...newConfig }))
  }, [config])

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('pdv-security-config')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Erro ao carregar configurações de segurança:', error)
      }
    }
  }, [])

  // Logout ao fechar aba/navegador
  useEffect(() => {
    if (!config.logoutOnPageClose || !user) return

    const handleBeforeUnload = async () => {
      // Fazer logout silencioso ao fechar a aba/navegador
      try {
        await signOut()
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && config.logoutOnPageClose) {
        // Página foi minimizada ou aba foi trocada
        // Opcional: fazer logout após um tempo
        setTimeout(async () => {
          if (document.visibilityState === 'hidden') {
            await signOut()
          }
        }, 5 * 60 * 1000) // 5 minutos oculto = logout
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [config.logoutOnPageClose, user, signOut])

  // Reset timer quando usuário faz uma ação
  useEffect(() => {
    if (user) {
      resetTimer()
    }
  }, [user, resetTimer])

  const value: SecurityContextType = {
    config,
    updateConfig,
    isWarningActive,
    extendSession,
    remainingTime
  }

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  )
}
