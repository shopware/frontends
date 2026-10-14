import { describe, expect, it } from "vitest";

import {
  BIRTH_YEAR_MIN,
  birthdayDayOptions,
  birthdayMonthOptions,
  birthdayYearOptions,
  isValidBirthday,
} from "./birthday";

const NOW = new Date(2026, 9, 14, 12);

function valid(day: string, month: string, year: string, max = 2026) {
  return isValidBirthday({ day, month, year }, max, NOW);
}

describe("birthday options", () => {
  it("offers the days 1 to 31", () => {
    const days = birthdayDayOptions();

    expect(days).toHaveLength(31);
    expect(days[0]).toEqual({ label: "1", value: "1" });
    expect(days[30]).toEqual({ label: "31", value: "31" });
  });

  it("names the months in the page locale with their numbers as values", () => {
    expect(birthdayMonthOptions("en-GB").map(({ label }) => label)).toEqual([
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]);
    expect(birthdayMonthOptions("pl-PL")[0]).toEqual({
      label: "styczeń",
      value: "1",
    });
    expect(birthdayMonthOptions("de-DE")[2]).toEqual({
      label: "März",
      value: "3",
    });
    expect(birthdayMonthOptions("de-DE")[11]?.value).toBe("12");
  });

  it("offers the years from the newest down to 1900", () => {
    const years = birthdayYearOptions(2026);

    expect(years[0]).toEqual({ label: "2026", value: "2026" });
    expect(years.at(-1)).toEqual({ label: "1900", value: "1900" });
    expect(years).toHaveLength(2026 - BIRTH_YEAR_MIN + 1);
  });
});

describe("isValidBirthday", () => {
  it("accepts a real date", () => {
    expect(valid("5", "10", "1990")).toBe(true);
    expect(valid("31", "12", "1900")).toBe(true);
  });

  it("knows 29 February only in leap years", () => {
    expect(valid("29", "2", "2000")).toBe(true);
    expect(valid("29", "2", "2024")).toBe(true);
    expect(valid("29", "2", "1900")).toBe(false);
    expect(valid("29", "2", "2023")).toBe(false);
  });

  it("rejects days a month does not have instead of rolling them over", () => {
    expect(valid("31", "2", "2000")).toBe(false);
    expect(valid("31", "4", "2000")).toBe(false);
    expect(valid("0", "1", "2000")).toBe(false);
    expect(valid("1", "13", "2000")).toBe(false);
  });

  it("rejects a year before 1900 or after the newest one offered", () => {
    expect(valid("31", "12", "1899")).toBe(false);
    expect(valid("1", "1", "2025", 2024)).toBe(false);
  });

  it("accepts today and rejects a date after it", () => {
    expect(valid("14", "10", "2026")).toBe(true);
    expect(valid("15", "10", "2026")).toBe(false);
    expect(valid("1", "11", "2026")).toBe(false);
  });

  it("rejects parts that are not whole numbers", () => {
    expect(valid("", "1", "2000")).toBe(false);
    expect(valid("1.5", "1", "2000")).toBe(false);
    expect(valid("1", "1.5", "2000")).toBe(false);
    expect(valid("1", "-1", "2000")).toBe(false);
    expect(valid("1", "1", "20x0")).toBe(false);
  });
});
