'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useSecurityContext } from '@/contexts/SecurityContext'
import { Shield, Save, RotateCcw, Clock, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

export function SecuritySettings() {
  const { config, updateConfig } = useSecurityContext()
  const [localConfig, setLocalConfig] = useState(config)
  const [isChanged, setIsChanged] = useState(false)

  const handleInputChange = (field: keyof typeof config, value: any) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }))
    setIsChanged(true)
  }

  const handleSave = () => {
    updateConfig(localConfig)
    setIsChanged(false)
    toast.success('Configurações de segurança atualizadas!')
  }

  const handleReset = () => {
    const defaultConfig = {
      inactivityTimeout: 30,
      warningTime: 5,
      logoutOnPageClose: true,
      enableWarnings: true
    }
    setLocalConfig(defaultConfig)
    setIsChanged(true)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Configurações de Segurança
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timeout de Inatividade */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-base font-medium">
            <Clock className="h-4 w-4" />
            Timeout de Inatividade
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inactivity-timeout" className="text-sm">
                Tempo limite (minutos)
              </Label>
              <Input
                id="inactivity-timeout"
                type="number"
                min="5"
                max="480"
                value={localConfig.inactivityTimeout}
                onChange={(e) => handleInputChange('inactivityTimeout', parseInt(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Recomendado: 15-60 minutos para PDV
              </p>
            </div>
            
            <div>
              <Label htmlFor="warning-time" className="text-sm">
                Aviso antecipado (minutos)
              </Label>
              <Input
                id="warning-time"
                type="number"
                min="1"
                max="30"
                value={localConfig.warningTime}
                onChange={(e) => handleInputChange('warningTime', parseInt(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tempo de aviso antes do logout
              </p>
            </div>
          </div>
        </div>

        {/* Logout ao Fechar Página */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label className="text-base font-medium">
              Logout ao Fechar Navegador
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Fazer logout automaticamente quando a aba/navegador for fechado
            </p>
          </div>
          <Switch
            checked={localConfig.logoutOnPageClose}
            onCheckedChange={(checked) => handleInputChange('logoutOnPageClose', checked)}
          />
        </div>

        {/* Avisos Habilitados */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <Label className="text-base font-medium">
              Avisos de Sessão
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Exibir avisos antes da sessão expirar
            </p>
          </div>
          <Switch
            checked={localConfig.enableWarnings}
            onCheckedChange={(checked) => handleInputChange('enableWarnings', checked)}
          />
        </div>

        {/* Informações de Segurança */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Dicas de Segurança</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Para PDV, recomendamos 15-30 minutos de timeout</li>
                <li>Sempre habilite logout ao fechar navegador</li>
                <li>Avisos ajudam a evitar perda de dados não salvos</li>
                <li>Qualquer ação no sistema reinicia o timer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={handleSave}
            disabled={!isChanged}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
          
          <Button 
            onClick={handleReset}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrões
          </Button>
        </div>

        {/* Status Atual */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <strong>Status atual:</strong> Logout automático em {localConfig.inactivityTimeout} minutos
          {localConfig.enableWarnings && ` (aviso aos ${localConfig.warningTime} minutos)`}
        </div>
      </CardContent>
    </Card>
  )
}
