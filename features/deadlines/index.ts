export function daysUntilIst(targetDate: string, nowIso = "2026-08-27T00:00:00+05:30"): number {
  const now = startOfIstDay(nowIso).getTime();
  const target = startOfIstDay(`${targetDate}T00:00:00+05:30`).getTime();
  return Math.ceil((target - now) / 86_400_000);
}

export function deadlineSeverity(days: number): "good" | "warn" | "bad" {
  if (days < 0) return "bad";
  if (days <= 5) return "bad";
  if (days <= 12) return "warn";
  return "good";
}

function startOfIstDay(value: string): Date {
  const date = new Date(value);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [{ value: year }, , { value: month }, , { value: day }] = formatter.formatToParts(date);
  return new Date(`${year}-${month}-${day}T00:00:00+05:30`);
}
