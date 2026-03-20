// src/themes/resolver.tsx

import { lazy, Suspense } from 'react'
import type { BarbershopPageProps } from './types'

const THEMES = {
  vintage: lazy(() => import('./default')),
  modern: lazy(() => import('./premium-a')),
  minimalist: lazy(() => import('./premium-b')),
  dark: lazy(() => import('./premium-c')),
}

const PLAN_ALLOWED_TEMPLATES: Record<string, (keyof typeof THEMES)[]> = {
  iniciante: ['vintage'],
  profissional: ['vintage', 'modern', 'minimalist'],
  master: ['vintage', 'modern', 'minimalist', 'dark'],
}

function resolveTemplate(
  template: keyof typeof THEMES,
  plan: string
): keyof typeof THEMES {
  const allowed = PLAN_ALLOWED_TEMPLATES[plan] ?? ['vintage']
  return allowed.includes(template) ? template : 'vintage'
}

interface ThemeResolverProps extends BarbershopPageProps {
  plan: string
}

export function ThemeResolver({ plan, ...props }: ThemeResolverProps) {
  const resolvedTemplate = resolveTemplate(props.template, plan)
  const Theme = THEMES[resolvedTemplate]

  return (
    <Suspense fallback={<ThemeLoadingFallback />}>
      <Theme {...props} />
    </Suspense>
  )
}

function ThemeLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-800" />
        <span className="text-sm text-neutral-500">Carregando...</span>
      </div>
    </div>
  )
}