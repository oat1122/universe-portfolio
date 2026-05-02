const DEFAULT_LOCALE = "en-US";

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" },
  locale: string = DEFAULT_LOCALE,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

type RelativeUnit = "second" | "minute" | "hour" | "day" | "week" | "month" | "year";

export function formatRelative(date: Date | string, locale: string = DEFAULT_LOCALE): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffSeconds = Math.round((d.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const thresholds: [number, RelativeUnit][] = [
    [60, "second"],
    [3600, "minute"],
    [86400, "hour"],
    [604800, "day"],
    [2629800, "week"],
    [31557600, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  const divisors: Record<RelativeUnit, number> = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629800,
    year: 31557600,
  };

  for (const [limit, unit] of thresholds) {
    if (Math.abs(diffSeconds) < limit) {
      return rtf.format(Math.round(diffSeconds / divisors[unit]), unit);
    }
  }
  return rtf.format(Math.round(diffSeconds / divisors.year), "year");
}
