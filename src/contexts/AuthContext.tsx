'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser, Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User, Role } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string, role?: Role) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Buscar perfil do usuário na tabela users
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Usar maybeSingle em vez de single para evitar erro se não existir

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro inesperado ao buscar perfil:', error)
      return null
    }
  }

  // Criar perfil do usuário na tabela users
  const createUserProfile = async (
    userId: string, 
    email: string, 
    name: string, 
    role: Role = 'user'
  ): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          name,
          email,
          role,
          active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar perfil:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro inesperado ao criar perfil:', error)
      return null
    }
  }

  // Garantir que o perfil existe
  const ensureUserProfile = async (
    supabaseUser: SupabaseUser,
    additionalData?: { name?: string; role?: Role }
  ): Promise<User | null> => {
    // Aguardar um pouco para o trigger criar o perfil
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let profile = await fetchUserProfile(supabaseUser.id)
    
    if (!profile) {
      const name = additionalData?.name || 
                   supabaseUser.user_metadata?.name || 
                   supabaseUser.email?.split('@')[0] || 
                   'Usuário'
      
      const role = additionalData?.role || 'user'
      
      console.log('Criando perfil para usuário:', supabaseUser.id)
      profile = await createUserProfile(supabaseUser.id, supabaseUser.email!, name, role)
      
      // Tentar buscar novamente após criar
      if (!profile) {
        await new Promise(resolve => setTimeout(resolve, 300))
        profile = await fetchUserProfile(supabaseUser.id)
      }
    }
    
    return profile
  }

  // Configurar sessão inicial
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const profile = await ensureUserProfile(session.user)
          setUser(profile)
          setSession(session)
        }
      } catch (error) {
        console.error('Erro ao obter sessão inicial:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.id)
        
        if (session?.user) {
          const profile = await ensureUserProfile(session.user)
          setUser(profile)
          setSession(session)
        } else {
          setUser(null)
          setSession(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        const profile = await ensureUserProfile(data.user)
        setUser(profile)
        setSession(data.session)
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
      throw new Error(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string, role: Role = 'user') => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      })

      if (error) throw error

      if (data.user) {
        const profile = await ensureUserProfile(data.user, { name, role })
        setUser(profile)
        setSession(data.session)
      }
    } catch (error: any) {
      console.error('Erro no registro:', error)
      throw new Error(error.message || 'Erro ao fazer registro')
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
      
      // Redirecionar para a página de login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    } catch (error: any) {
      console.error('Erro no logout:', error)
      throw new Error(error.message || 'Erro ao fazer logout')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('Usuário não está logado')
    
    // Não usar setLoading aqui para evitar spinner na tela durante atualização de perfil
    try {
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      setUser(updatedUser)
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      throw new Error(error.message || 'Erro ao atualizar perfil')
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
