import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

import {
  parseDeepLinkCredentials,
  validateDeepLinkCredentials,
} from "./deepLinkSchema";

const t = testTranslator();

describe("validateDeepLinkCredentials", () => {
  it("requires both fields", () => {
    expect(validateDeepLinkCredentials({ email: "", zipcode: " " }, t)).toEqual(
      {
        email: "Value is required",
        zipcode: "Value is required",
      },
    );
  });

  it("requires a valid email address", () => {
    expect(
      validateDeepLinkCredentials({ email: "guest", zipcode: "12345" }, t),
    ).toEqual({ email: "Value is not a valid email address" });
  });

  it("accepts an email address and a postal code", () => {
    expect(
      validateDeepLinkCredentials(
        {
          email: "guest@example.com",
          zipcode: "12345",
        },
        t,
      ),
    ).toEqual({});
  });
});

describe("parseDeepLinkCredentials", () => {
  it("trims the email address but keeps the postal code as typed, since the backend compares it untrimmed", () => {
    expect(
      parseDeepLinkCredentials(
        {
          email: "  guest@example.com ",
          zipcode: " 12345",
        },
        t,
      ),
    ).toEqual({ email: "guest@example.com", zipcode: " 12345" });
  });

  it("returns null for invalid input", () => {
    expect(parseDeepLinkCredentials({ email: "", zipcode: "" }, t)).toBeNull();
  });
});

describe("validateDeepLinkCredentials in German", () => {
  it("reports the German validation messages", () => {
    expect(
      validateDeepLinkCredentials(
        { email: "guest", zipcode: "" },
        testTranslator("de-DE"),
      ),
    ).toEqual({
      email: "Der Wert ist keine gültige E-Mail-Adresse",
      zipcode: "Der Wert ist erforderlich",
    });
  });
});
