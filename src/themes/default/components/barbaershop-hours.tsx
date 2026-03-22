import { Clock } from "lucide-react";
import { formatTime } from "../../../utils/format-time";
import { DAYS_FULL, type OpeningHour } from "../../types";
import { groupByDay } from "../../../utils/Group-bay-day";

interface Props {
  openingHours: OpeningHour[];
}

export function BarberShopHours({ openingHours }: Props) {
  const byDay = groupByDay(openingHours);
  const today = new Date().getDay();

  return (
    <section id="horarios" className="mt-18 flex flex-col items-center">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={18} />
        <h2 className="text-2xl font-medium md:text-4xl">Horários</h2>
      </div>

      <div className="w-full max-w-156 divide-y divide-zinc-300 overflow-hidden rounded-xl border border-zinc-300 dark:divide-neutral-800 dark:border-neutral-800">
        {Array.from({ length: 7 }, (_, i) => {
          const periods = byDay[i];
          const isToday = i === today;
          const hasPeriods = periods?.some(p => p.is_open);

          return (
            <div
              key={i}
              className={`flex items-center justify-between px-4 py-3 ${isToday ? "bg-neutral-50 dark:bg-neutral-900" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${hasPeriods ? "bg-green-500" : "bg-red-500"}`}
                />
                <span
                  className={`text-sm ${isToday ? "font-semibold" : "text-neutral-600 dark:text-neutral-400"}`}
                >
                  {DAYS_FULL[i]}
                  {isToday && (
                    <span className="ml-2 text-xs font-normal text-neutral-400">
                      hoje
                    </span>
                  )}
                </span>
              </div>

              <div className="flex flex-col items-end gap-0.5">
                {hasPeriods ? (
                  periods
                    .filter(p => p.is_open)
                    .sort((a, b) => a.period_order - b.period_order)
                    .map(p => (
                      <span
                        key={p.id}
                        className="text-sm whitespace-nowrap text-neutral-600 dark:text-neutral-400"
                      >
                        {formatTime(p.opens_at)} – {formatTime(p.closes_at)}
                      </span>
                    ))
                ) : (
                  <span className="text-sm text-neutral-400">Fechado</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
