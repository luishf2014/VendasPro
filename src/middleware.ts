import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + '?')
  )

  // Permitir acesso a rotas públicas
  if (isPublicRoute) {
    return NextResponse.next()
  }

  try {
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error('Erro na sessão:', sessionError)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Se não há sessão, redirecionar para login
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('Erro na autenticação:', authError)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirecionar root para dashboard se logado
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Rotas que requerem verificação de permissão
    if (user) {
      // Aguardar um pouco para garantir que a sessão esteja estabelecida
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userError) {
        console.error('Erro ao buscar dados do usuário:', userError)
        // Permitir acesso mesmo com erro na busca do perfil
        return response
      }

      // Verificar permissões de admin/manager
      const adminRoutes = ['/users', '/settings']
      const isAdminRoute = adminRoutes.some(route => 
        request.nextUrl.pathname.startsWith(route)
      )

      if (isAdminRoute && userData?.role !== 'admin' && userData?.role !== 'manager') {
        console.log('Acesso negado: rota de admin/manager')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return response
  } catch (error) {
    console.error('Erro no middleware:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
