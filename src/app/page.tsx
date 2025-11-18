import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirecionar para o dashboard - o middleware cuidará da autenticação
  redirect('/dashboard')
}