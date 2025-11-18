'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseInactivityTimerProps {
  onInactive: () => void
  inactivityTime: number // em milissegundos
  warningTime?: number // tempo para mostrar aviso antes de fazer logout
  onWarning?: () => void
}

export function useInactivityTimer({ 
  onInactive, 
  inactivityTime, 
  warningTime,
  onWarning 
}: UseInactivityTimerProps) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const warningTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const isActiveRef = useRef(true)

  const resetTimer = useCallback(() => {
    // Limpar timers existentes
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current)
    }

    // Se tem tempo de aviso, configurar aviso primeiro
    if (warningTime && onWarning) {
      const timeUntilWarning = inactivityTime - warningTime
      warningTimeoutRef.current = setTimeout(() => {
        onWarning()
      }, timeUntilWarning)
    }

    // Configurar timeout de inatividade
    timeoutRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        onInactive()
      }
    }, inactivityTime)
  }, [inactivityTime, onInactive, warningTime, onWarning])

  const handleActivity = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    // Eventos que indicam atividade do usuário
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ]

    // Adicionar listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Iniciar timer
    resetTimer()

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
      }
      isActiveRef.current = false
    }
  }, [handleActivity, resetTimer])

  return {
    resetTimer,
    clearTimer: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
      }
    }
  }
}
