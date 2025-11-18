import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Se não tiver as variáveis de ambiente, redirecionar para login para rotas protegidas
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('⚠️ Variáveis de ambiente do Supabase não configuradas')
    
    // Permitir apenas rotas públicas
    if (!isPublicRoute && request.nextUrl.pathname !== '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Redirecionar root para login
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              supabaseResponse.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    // Verificar se o usuário está autenticado
    const { data: { session } } = await supabase.auth.getSession()

    // Se não está logado e tenta acessar rota protegida (exceto root)
    if (!session && !isPublicRoute && request.nextUrl.pathname !== '/') {
      console.log('🔒 Acesso negado - redirecionando para login:', request.nextUrl.pathname)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Se está logado e tenta acessar rota pública, redirecionar para dashboard
    if (session && isPublicRoute) {
      console.log('✅ Usuário autenticado - redirecionando para dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirecionar root para dashboard se logado, senão para login
    if (request.nextUrl.pathname === '/') {
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return supabaseResponse
  } catch (error) {
    // Se der erro no middleware, redirecionar para login para segurança
    console.error('❌ Erro no middleware:', error)
    
    // Permitir apenas rotas públicas em caso de erro
    if (!isPublicRoute && request.nextUrl.pathname !== '/') {
      console.log('⚠️ Erro no middleware - redirecionando para login por segurança')
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return supabaseResponse
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
