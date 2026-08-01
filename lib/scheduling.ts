import { scheduling } from "@/lib/site";

/**
 * Estimate visits happen on weekends, booked a few days out, because the crew is on
 * site during the week. The rule is enforced in the browser and again on the server,
 * so a hand-crafted POST cannot book a Tuesday.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Local calendar date at midnight, so comparisons ignore the time of day. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, year, month, day] = match;
  // Constructed as a local date so "2026-08-08" is Saturday everywhere, rather
  // than shifting a day for anyone west of UTC.
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }
  return date;
}

function isAllowedWeekday(date: Date): boolean {
  return (scheduling.allowedWeekdays as readonly number[]).includes(date.getDay());
}

/** The first and last dates the picker should offer. */
export function estimateDateBounds(today: Date = new Date()) {
  const base = startOfDay(today);
  const min = new Date(base.getTime() + scheduling.minLeadDays * DAY_MS);
  // Enough runway to always include at least two weekends past the minimum notice.
  const max = new Date(base.getTime() + 90 * DAY_MS);
  return { min: toDateInput(min), max: toDateInput(max) };
}

export function toDateInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export type EstimateDateError = "invalid" | "weekday" | "too-soon";

/**
 * Returns null when the requested day is acceptable, otherwise why it is not.
 * An empty value is acceptable — choosing a preferred day is optional.
 */
export function validateEstimateDate(
  value: string,
  today: Date = new Date(),
): EstimateDateError | null {
  if (!value.trim()) return null;

  const requested = parseDateInput(value);
  if (!requested) return "invalid";

  if (!isAllowedWeekday(requested)) return "weekday";

  const earliest = startOfDay(today).getTime() + scheduling.minLeadDays * DAY_MS;
  if (requested.getTime() < earliest) return "too-soon";

  return null;
}
