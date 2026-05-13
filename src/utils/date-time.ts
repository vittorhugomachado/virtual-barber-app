export const APP_TIME_ZONE = "America/Sao_Paulo";

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  timeZone: APP_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function toLocalDateKey(date: Date = new Date()) {
  return DATE_KEY_FORMATTER.format(date);
}

export function formatLocalTime(isoString: string) {
  return TIME_FORMATTER.format(new Date(isoString));
}

export function getLocalTimeMinutes(isoString: string) {
  const [hours, minutes] = formatLocalTime(isoString).split(":").map(Number);
  return hours * 60 + minutes;
}

export function localDateTimeToIso(dateKey: string, time: string) {
  return new Date(`${dateKey}T${time}:00`).toISOString();
}

export function getLocalDayRange(dateKey: string) {
  const start = new Date(`${dateKey}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}
