import { getOpenStatus } from "@/utils/open-status";
import type { OpeningHour } from "@/app/themes/types";

interface StatusBadgeProps {
  classTailwind?: string;
  openingHours: OpeningHour[];
}

export function StatusBadge({ openingHours, classTailwind }: StatusBadgeProps) {
  const { open, closesAt } = getOpenStatus(openingHours);

  return (
    <div className={`${classTailwind ?? ""} flex items-center gap-1.5`}>
      <span className={`h-2 w-2 rounded-full ${open ? "bg-green-500" : "bg-red-500"}`} />
      <span className={`text-sm font-medium ${open ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
        {open ? "Aberto" : "Fechado"}
      </span>
      {open && closesAt && (
        <span className="text-sm text-neutral-400">· até {closesAt}</span>
      )}
    </div>
  );
}
