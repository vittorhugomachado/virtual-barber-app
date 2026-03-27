import { Users } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { useBarbershopData } from "../../../contexts/barbershop-data/barbershop-data-context";

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase();
}

export function Team() {
  const { barbers } = useBarbershopData();
  
  if (!barbers.length) return null;

  return (
    <section id="equipe" className="mt-16">
      <div className="mb-4 flex items-center justify-center gap-2">
        <Users size={18} />
        <h2 className="text-2xl font-medium md:text-4xl">Nossa equipe</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {barbers.map(barber => (
          <div key={barber.id} className="flex flex-col items-center gap-2">
            <Avatar className="h-16 w-16 ring-2 ring-neutral-100 md:h-23 md:w-23 dark:ring-neutral-800">
              <AvatarImage
                src={barber.avatar_url ?? undefined}
                alt={barber.name}
                className="object-cover"
              />
              <AvatarFallback className="text-base font-medium">
                {getInitials(barber.name)}
              </AvatarFallback>
            </Avatar>
            <span className="max-w-20 text-center text-sm leading-tight font-medium">
              {barber.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
