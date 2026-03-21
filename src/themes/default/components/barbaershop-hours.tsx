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
    <div className="mt-10 max-w-156">
      <div className="mb-4 flex items-center gap-2">
        <Clock size={18} className="text-neutral-400" />
        <h2 className="text-lg font-medium">Horários de funcionamento</h2>
      </div>

      <div className="rounded-xl">
        {Array.from({ length: 7 }, (_, i) => {
          const periods = byDay[i];
          const isToday = i === today;
          const hasPeriods = periods?.some(p => p.is_open);

          return (
            <div
              key={i}
              className={`dark:border-neut flex items-center justify-between border-b border-zinc-500 px-4 py-3 last:border-b-0 ${isToday ? "bg-neutral-50 dark:bg-neutral-900" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${hasPeriods ? "bg-green-500" : "bg-red-500"}`}
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
    </div>
  );
}
