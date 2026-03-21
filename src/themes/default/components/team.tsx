// src/themes/default/components/team.tsx

import { Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar'
import type { Barber } from '../../types'

interface TeamProps {
  barbers: Barber[]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

export function Team({ barbers }: TeamProps) {
  if (!barbers.length) return null

  return (
    <section>
      <div className="mb-4 flex items-center justify-center gap-2">
        <Users size={18} />
        <h2 className="text-2xl md:text-4xl font-medium">Nossa equipe</h2>
      </div>

      <div className="flex justify-center flex-wrap gap-6">
        {barbers.map(barber => (
          <div
            key={barber.id}
            className="flex flex-col items-center gap-2"
          >
            <Avatar className="h-16 w-16 md:h-23 md:w-23 ring-2 ring-neutral-100 dark:ring-neutral-800">
              <AvatarImage
                src={barber.avatar_url ?? undefined}
                alt={barber.name}
                className="object-cover"
              />
              <AvatarFallback className="text-base font-medium">
                {getInitials(barber.name)}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-20 text-center text-sm font-medium leading-tight">
              {barber.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}