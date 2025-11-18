'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SecuritySettings } from '@/components/SecuritySettings'
import { formatPhone, unformatPhone } from '@/lib/utils'
import toast from 'react-hot-toast'
import { 
  Settings, 
  User, 
  Shield,
  Bell,
  Database,
  Palette,
  Download,
  Upload,
  Save,
  Eye,
  EyeOff,
  LogOut
} from 'lucide-react'

export default function ConfiguracoesPage() {
  const { user, signOut, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Estados para os formulários
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Atualizar o estado quando o usuário mudar
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone ? formatPhone(user.phone) : ''
      }))
    }
  }, [user])

  const [systemSettings, setSystemSettings] = useState({
    companyName: 'VendasPro',
    companyEmail: 'contato@vendaspro.com',
    companyPhone: '(11) 99999-9999',
    companyAddress: 'Rua das Empresas, 123',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    lowStockAlert: 5,
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false
  })

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'company', label: 'Empresa', icon: Settings },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield },
    { id: 'data', label: 'Dados', icon: Database },
    { id: 'appearance', label: 'Aparência', icon: Palette }
  ]

  const handleSaveProfile = async () => {
    if (!user) {
      toast.error('Usuário não encontrado')
      return
    }

    setSaving(true)
    try {
      // Validar nome
      if (!profile.name || profile.name.trim().length < 2) {
        toast.error('Nome deve ter pelo menos 2 caracteres')
        setSaving(false)
        return
      }

      // Atualizar perfil no banco
      await updateProfile({
        name: profile.name.trim(),
        phone: profile.phone ? unformatPhone(profile.phone) : null
      })

      toast.success('✅ Perfil atualizado com sucesso!')
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error(`❌ Erro ao atualizar perfil: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSystem = async () => {
    // TODO: Implementar atualização das configurações do sistema
    console.log('Salvando configurações:', systemSettings)
    alert('Configurações salvas com sucesso!')
  }

  const handleExportData = () => {
    // TODO: Implementar exportação de dados
    alert('Exportação iniciada! Você receberá um email quando estiver pronto.')
  }

  const handleImportData = () => {
    // TODO: Implementar importação de dados
    alert('Função de importação em desenvolvimento.')
  }

  const handleSignOut = async () => {
    try {
      console.log('🚪 Fazendo logout...')
      await signOut()
      console.log('✅ Logout realizado com sucesso!')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
      alert('Erro ao fazer logout. Tente novamente.')
    }
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nome Completo
              </label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Seu nome completo"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Email
              </label>
              <Input
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                placeholder="seu@email.com"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Email não pode ser alterado por questões de segurança
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Telefone
              </label>
              <Input
                value={profile.phone}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  setProfile({...profile, phone: formatted})
                }}
                placeholder="(11) 99999-9999"
                maxLength={15}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Cargo/Role
              </label>
              <Badge variant="outline" className="text-sm">
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Alterar Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Senha Atual
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={profile.currentPassword}
                onChange={(e) => setProfile({...profile, currentPassword: e.target.value})}
                placeholder="Digite sua senha atual"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nova Senha
              </label>
              <Input
                type="password"
                value={profile.newPassword}
                onChange={(e) => setProfile({...profile, newPassword: e.target.value})}
                placeholder="Digite a nova senha"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Confirmar Nova Senha
              </label>
              <Input
                type="password"
                value={profile.confirmPassword}
                onChange={(e) => setProfile({...profile, confirmPassword: e.target.value})}
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>
          <Button variant="outline">
            Alterar Senha
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <LogOut className="w-5 h-5" />
            Sair da Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Você será desconectado de todas as sessões ativas. Certifique-se de salvar qualquer trabalho pendente antes de sair.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderCompanyTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Nome da Empresa
            </label>
            <Input
              value={systemSettings.companyName}
              onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email da Empresa
            </label>
            <Input
              value={systemSettings.companyEmail}
              onChange={(e) => setSystemSettings({...systemSettings, companyEmail: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Telefone
            </label>
            <Input
              value={systemSettings.companyPhone}
              onChange={(e) => setSystemSettings({...systemSettings, companyPhone: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Moeda Padrão
            </label>
            <select
              value={systemSettings.currency}
              onChange={(e) => setSystemSettings({...systemSettings, currency: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BRL">Real Brasileiro (R$)</option>
              <option value="USD">Dólar Americano ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Endereço Completo
          </label>
          <Input
            value={systemSettings.companyAddress}
            onChange={(e) => setSystemSettings({...systemSettings, companyAddress: e.target.value})}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Alerta de Estoque Baixo
          </label>
          <Input
            type="number"
            value={systemSettings.lowStockAlert}
            onChange={(e) => setSystemSettings({...systemSettings, lowStockAlert: Number(e.target.value)})}
          />
          <p className="text-xs text-gray-500 mt-1">
            Quantidade mínima para disparar alertas de estoque baixo
          </p>
        </div>
        <Button onClick={handleSaveSystem}>
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </CardContent>
    </Card>
  )

  const renderDataTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exportar Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Exporte todos os seus dados para backup ou migração.
          </p>
          <Button onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Todos os Dados
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Importar Dados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Importe dados de outros sistemas ou backups.
          </p>
          <Button onClick={handleImportData} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Selecionar Arquivo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Ações irreversíveis que podem afetar seus dados.
          </p>
          <div className="flex gap-2">
            <Button variant="destructive" size="sm">
              Limpar Todos os Dados
            </Button>
            <Button variant="outline" size="sm" className="text-red-600">
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab()
      case 'company':
        return renderCompanyTab()
      case 'data':
        return renderDataTab()
      case 'security':
        return <SecuritySettings />
      default:
        return (
          <Card>
            <CardContent className="p-12 text-center">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-600">
                Esta seção está em desenvolvimento.
              </p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ⚙️ Configurações
        </h1>
        <p className="text-gray-600">Gerencie suas preferências e configurações do sistema</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar de Navegação */}
        <div className="w-full lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}

