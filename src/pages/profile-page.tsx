import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/auth-store'
import { NotFoundPage } from './not-found-page'
import { useBarbershop } from '../hooks/use-barbershop'

export function ProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading, error } = useBarbershop(slug ?? '')

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/auth?redirect=/${slug}/perfil`)
    }
  }, [isAuthenticated, slug, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
      </div>
    )
  }

  if (error || !data) return <NotFoundPage />

  return (
    <div className="min-h-screen p-6">
      {/* histórico e cancelamentos — implementado em components/profile/ */}
    </div>
  )
}