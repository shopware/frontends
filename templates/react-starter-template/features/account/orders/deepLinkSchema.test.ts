import { describe, expect, it } from "vitest";

import {
  parseDeepLinkCredentials,
  validateDeepLinkCredentials,
} from "./deepLinkSchema";

describe("validateDeepLinkCredentials", () => {
  it("requires both fields", () => {
    expect(validateDeepLinkCredentials({ email: "", zipcode: " " })).toEqual({
      email: "Value is required",
      zipcode: "Value is required",
    });
  });

  it("requires a valid email address", () => {
    expect(
      validateDeepLinkCredentials({ email: "guest", zipcode: "12345" }),
    ).toEqual({ email: "Value is not a valid email address" });
  });

  it("accepts an email address and a postal code", () => {
    expect(
      validateDeepLinkCredentials({
        email: "guest@example.com",
        zipcode: "12345",
      }),
    ).toEqual({});
  });
});

describe("parseDeepLinkCredentials", () => {
  it("trims the email address but keeps the postal code as typed, since the backend compares it untrimmed", () => {
    expect(
      parseDeepLinkCredentials({
        email: "  guest@example.com ",
        zipcode: " 12345",
      }),
    ).toEqual({ email: "guest@example.com", zipcode: " 12345" });
  });

  it("returns null for invalid input", () => {
    expect(parseDeepLinkCredentials({ email: "", zipcode: "" })).toBeNull();
  });
});
