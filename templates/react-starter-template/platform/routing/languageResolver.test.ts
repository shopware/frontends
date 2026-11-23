import { describe, expect, it, vi } from "vitest";

import {
  LANGUAGES_RETRY_MS,
  LANGUAGES_TTL_MS,
  createLanguageResolver,
} from "./languageResolver";

const OPTIONS = [
  { id: "language-en", code: "en-GB" },
  { id: "language-pl", code: "pl-PL" },
];

function clock() {
  let time = 0;
  return {
    now: () => time,
    advance(ms: number) {
      time += ms;
    },
  };
}

describe("createLanguageResolver", () => {
  it("maps a locale to the Shopware language and reads the list once per hour", async () => {
    const time = clock();
    const read = vi.fn(async () => OPTIONS);
    const resolve = createLanguageResolver({ read, now: time.now });

    expect(await resolve("pl-PL")).toEqual({
      status: "resolved",
      languageId: "language-pl",
    });
    expect(await resolve("de-DE")).toEqual({
      status: "resolved",
      languageId: null,
    });
    expect(read).toHaveBeenCalledTimes(1);

    time.advance(LANGUAGES_TTL_MS);
    await resolve("en-GB");
    expect(read).toHaveBeenCalledTimes(2);
  });

  it("reports the languages as unavailable after a failed first read and retries a minute later", async () => {
    const time = clock();
    const onFailure = vi.fn();
    const read = vi
      .fn<() => Promise<typeof OPTIONS>>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue(OPTIONS);
    const resolve = createLanguageResolver({ read, now: time.now, onFailure });

    expect(await resolve("pl-PL")).toEqual({ status: "unavailable" });
    expect(onFailure).toHaveBeenCalledTimes(1);
    expect(await resolve("pl-PL")).toEqual({ status: "unavailable" });
    expect(read).toHaveBeenCalledTimes(1);

    time.advance(LANGUAGES_RETRY_MS);
    expect(await resolve("pl-PL")).toEqual({
      status: "resolved",
      languageId: "language-pl",
    });
  });

  it("keeps the last good list when a later read fails", async () => {
    const time = clock();
    const read = vi
      .fn<() => Promise<typeof OPTIONS>>()
      .mockResolvedValueOnce(OPTIONS)
      .mockRejectedValue(new Error("offline"));
    const resolve = createLanguageResolver({ read, now: time.now });
    await resolve("pl-PL");

    time.advance(LANGUAGES_TTL_MS);

    expect(await resolve("pl-PL")).toEqual({
      status: "resolved",
      languageId: "language-pl",
    });
  });
});
