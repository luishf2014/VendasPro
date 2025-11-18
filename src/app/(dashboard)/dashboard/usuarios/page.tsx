'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { getUsers, createUser, updateUser } from '@/lib/database/queries'
import { Role } from '@/types'
import toast from 'react-hot-toast'
import { 
  Users, 
  Plus, 
  Edit, 
  Shield,
  UserCheck,
  UserX,
  Mail,
  User,
  UserPlus
} from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  role: Role
  active: boolean
  created_at: string
}

export default function UsuariosPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as Role
  })

  // Verificar se é admin ou manager
  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin'

  useEffect(() => {
    if (!isManagerOrAdmin) return
    
    loadUsers()
  }, [isManagerOrAdmin])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const usersData = await getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingUser) {
        // Atualizar usuário
        const result = await updateUser(editingUser.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role
        })

        if (result.success) {
          await loadUsers()
          setIsEditModalOpen(false)
          setEditingUser(null)
          resetForm()
          toast.success('✅ Usuário atualizado com sucesso!')
        } else {
          toast.error(`❌ Erro ao atualizar usuário: ${result.error}`)
        }
      } else {
        // Criar novo usuário
        if (formData.password !== formData.confirmPassword) {
          toast.error('❌ As senhas não coincidem!')
          setSubmitting(false)
          return
        }

        const result = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })

        if (result.success) {
          await loadUsers()
          setIsAddModalOpen(false)
          resetForm()
          toast.success('✅ Usuário criado com sucesso!')
        } else {
          toast.error(`❌ Erro ao criar usuário: ${result.error}`)
        }
      }
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error)
      toast.error('❌ Erro ao salvar usuário. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (userData: UserData) => {
    setEditingUser(userData)
    setFormData({
      name: userData.name,
      email: userData.email,
      password: '',
      confirmPassword: '',
      role: userData.role
    })
    setIsEditModalOpen(true)
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    const result = await updateUser(userId, { active: !currentStatus })
    
    if (result.success) {
      await loadUsers()
      toast.success(`✅ Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`)
    } else {
      toast.error(`❌ Erro ao ${currentStatus ? 'desativar' : 'ativar'} usuário: ${result.error}`)
    }
  }

  const getRoleBadge = (role: Role) => {
    const variants = {
      admin: 'destructive',
      manager: 'default',
      user: 'outline'
    } as const

    const labels = {
      admin: '👑 Admin',
      manager: '👔 Gerente',
      user: '👤 Usuário'
    }

    return (
      <Badge variant={variants[role]}>
        {labels[role]}
      </Badge>
    )
  }

  // Se não for admin ou manager, mostrar mensagem de acesso negado
  if (!isManagerOrAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600">
              Apenas Administradores e Gerentes podem gerenciar usuários.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👥 Gerenciamento de Usuários
          </h1>
          <p className="text-gray-600">Gerencie os usuários do sistema</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </div>

      {/* Lista de Usuários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((userData) => (
          <Card key={userData.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{userData.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{userData.email}</span>
                  </div>
                </div>
                {getRoleBadge(userData.role)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <Badge variant={userData.active ? "default" : "secondary"}>
                  {userData.active ? (
                    <>
                      <UserCheck className="w-3 h-3 mr-1" />
                      Ativo
                    </>
                  ) : (
                    <>
                      <UserX className="w-3 h-3 mr-1" />
                      Inativo
                    </>
                  )}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleEdit(userData)}
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant={userData.active ? "outline" : "default"}
                  size="sm"
                  className="flex-1"
                  onClick={() => handleToggleActive(userData.id, userData.active)}
                >
                  {userData.active ? (
                    <>
                      <UserX className="w-3 h-3 mr-1" />
                      Desativar
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3 h-3 mr-1" />
                      Ativar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Comece criando o primeiro usuário do sistema.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Usuário
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal de Criar Usuário */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Criar Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome do usuário"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="usuario@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    required={!editingUser}
                    minLength={6}
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Senha *
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Função *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="user">👤 Usuário</option>
                    <option value="manager">👔 Gerente</option>
                    {user?.role === 'admin' && (
                      <option value="admin">👑 Administrador</option>
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {user?.role === 'admin' 
                      ? 'Nota: Apenas Administradores podem criar outros Administradores'
                      : 'Nota: Apenas Administradores podem criar outros Administradores. Gerentes podem criar Usuários e Gerentes.'
                    }
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Criar Usuário'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Editar Usuário */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Editar Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome do usuário"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="usuario@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Função *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="user">👤 Usuário</option>
                    <option value="manager">👔 Gerente</option>
                    {user?.role === 'admin' && (
                      <option value="admin">👑 Administrador</option>
                    )}
                  </select>
                  {user?.role === 'admin' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Nota: Apenas Administradores podem alterar outros usuários para Administrador
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditModalOpen(false)
                      setEditingUser(null)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

