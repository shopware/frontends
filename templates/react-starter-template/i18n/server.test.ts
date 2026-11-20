import { describe, expect, it, vi } from "vitest";

import { getMessages } from "./messages";
import { getMessagesFor, getTranslator, localeFromParams } from "./server";

vi.mock("server-only", () => ({}));

describe("getTranslator", () => {
  it("translates with the messages of the locale", () => {
    expect(getTranslator("en-GB")("loginForm.submitButtonLabel")).toBe(
      "Sign in",
    );
    expect(getTranslator("de-DE")("loginForm.submitButtonLabel")).toBe(
      "Anmelden",
    );
    expect(getTranslator("pl-PL")("search.result", undefined, 22)).toBe(
      "wyniki",
    );
  });

  it("keeps one translator per locale", () => {
    expect(getTranslator("pl-PL")).toBe(getTranslator("pl-PL"));
    expect(getTranslator("pl-PL")).not.toBe(getTranslator("de-DE"));
  });
});

describe("getMessagesFor", () => {
  it("returns the merged messages of the locale", () => {
    expect(getMessagesFor("de-DE")).toBe(getMessages("de-DE"));
  });
});

describe("localeFromParams", () => {
  it("resolves a supported locale", async () => {
    await expect(
      localeFromParams(Promise.resolve({ locale: "pl-PL" })),
    ).resolves.toBe("pl-PL");
  });

  it.each(["pl-pl", "favicon.ico", ""])(
    "calls notFound() for %j",
    async (locale) => {
      await expect(
        localeFromParams(Promise.resolve({ locale })),
      ).rejects.toMatchObject({ digest: expect.stringContaining("404") });
    },
  );
});
