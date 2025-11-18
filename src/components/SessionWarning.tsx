'use client'

import React from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSecurityContext } from '@/contexts/SecurityContext'
import { Clock, Shield, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function SessionWarning() {
  const { isWarningActive, remainingTime, extendSession } = useSecurityContext()
  const { signOut } = useAuth()

  if (!isWarningActive) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 border-red-200 shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            Aviso de Segurança
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4" />
            <AlertDescription className="text-amber-800">
              Sua sessão expirará em <strong>{remainingTime} minuto{remainingTime !== 1 ? 's' : ''}</strong> devido à inatividade.
            </AlertDescription>
          </Alert>

          <div className="text-sm text-gray-600">
            Por motivos de segurança, o sistema faz logout automático quando não há atividade. 
            Isso protege contra acesso não autorizado.
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              onClick={extendSession}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Clock className="h-4 w-4 mr-2" />
              Continuar Trabalhando
            </Button>
            
            <Button 
              onClick={signOut}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Fazer Logout
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            💡 Dica: Qualquer ação no sistema reinicia o timer automaticamente
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
