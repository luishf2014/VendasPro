'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SecuritySettings } from '@/components/SecuritySettings'
import { Badge } from '@/components/ui/badge'
import { Shield, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { useSecurityContext } from '@/contexts/SecurityContext'
import { useAuth } from '@/contexts/AuthContext'

export default function SecurityConfigPage() {
  const { config } = useSecurityContext()
  const { user } = useAuth()

  // Verificar se o usuário tem permissão (apenas admin)
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600">
              Apenas administradores podem acessar as configurações de segurança.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Configurações de Segurança
          </h1>
          <p className="text-gray-600 mt-2">
            Configure os parâmetros de segurança do sistema PDV
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Modo Seguro
        </Badge>
      </div>

      {/* Status Atual da Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Timeout Ativo
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {config.inactivityTimeout}min
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Logout Automático
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {config.logoutOnPageClose ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              {config.logoutOnPageClose ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avisos
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {config.enableWarnings ? 'Habilitados' : 'Desabilitados'}
                </p>
              </div>
              {config.enableWarnings ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configurações */}
      <SecuritySettings />

      {/* Informações Adicionais */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="h-5 w-5" />
            Política de Segurança Ativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Proteções Ativas:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>✅ Logout automático por inatividade</li>
                <li>✅ Monitoramento de atividade do usuário</li>
                <li>✅ Limpeza de sessão ao fechar navegador</li>
                <li>✅ Avisos preventivos de expiração</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Eventos Monitorados:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Movimentos do mouse</li>
                <li>• Cliques e toques</li>
                <li>• Digitação no teclado</li>
                <li>• Scroll da página</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
