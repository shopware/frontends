import type { SelectOption } from "./SelectField";

export type BirthdayPart = "day" | "month" | "year";

export type BirthdayParts = Record<BirthdayPart, string>;

export const BIRTHDAY_PARTS: readonly BirthdayPart[] = ["day", "month", "year"];

export const BIRTH_YEAR_MIN = 1900;

const DAYS = Array.from({ length: 31 }, (_, index) => String(index + 1));
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const monthFormats = new Map<string, Intl.DateTimeFormat>();

function monthFormat(locale: string): Intl.DateTimeFormat {
  let format = monthFormats.get(locale);
  if (!format) {
    format = new Intl.DateTimeFormat(locale, {
      month: "long",
      timeZone: "UTC",
    });
    monthFormats.set(locale, format);
  }
  return format;
}

export function birthdayDayOptions(): SelectOption[] {
  return DAYS.map((day) => ({ label: day, value: day }));
}

export function birthdayMonthOptions(locale: string): SelectOption[] {
  const format = monthFormat(locale);
  return MONTHS.map((month) => ({
    label: format.format(Date.UTC(2000, month - 1, 1)),
    value: String(month),
  }));
}

export function birthdayYearOptions(birthYearMax: number): SelectOption[] {
  const options: SelectOption[] = [];
  for (let year = birthYearMax; year >= BIRTH_YEAR_MIN; year -= 1) {
    options.push({ label: String(year), value: String(year) });
  }
  return options;
}

function toWholeNumber(value: string): number | null {
  return /^\d+$/.test(value.trim()) ? Number(value) : null;
}

export function isValidBirthday(
  parts: BirthdayParts,
  birthYearMax: number,
  now: Date = new Date(),
): boolean {
  const day = toWholeNumber(parts.day);
  const month = toWholeNumber(parts.month);
  const year = toWholeNumber(parts.year);
  if (day === null || month === null || year === null) return false;
  if (year < BIRTH_YEAR_MIN || year > birthYearMax) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCMonth() !== month - 1) return false;
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return date.getTime() <= today;
}
