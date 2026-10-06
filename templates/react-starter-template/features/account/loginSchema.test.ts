import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

import { emptyLoginValues, validateLogin } from "./loginSchema";

const t = testTranslator();

describe("validateLogin", () => {
  it("requires both fields", () => {
    expect(validateLogin(emptyLoginValues, t)).toEqual({
      username: "Value is required",
      password: "Value is required",
    });
    expect(validateLogin({ username: "  ", password: " " }, t)).toEqual({
      username: "Value is required",
      password: "Value is required",
    });
  });

  it("requires an email address as the username", () => {
    expect(validateLogin({ username: "jane", password: "secret" }, t)).toEqual({
      username: "Value is not a valid email address",
    });
  });

  it("requires a password of at least three characters", () => {
    expect(
      validateLogin({ username: "jane@example.com", password: "ab" }, t),
    ).toEqual({ password: "This minimum length should be at least 3" });
  });

  it("accepts valid credentials", () => {
    expect(
      validateLogin({ username: "jane@example.com", password: "secret" }, t),
    ).toEqual({});
  });
});

describe("validateLogin in Polish", () => {
  it("reports the Polish validation messages", () => {
    const pl = testTranslator("pl-PL");

    expect(validateLogin(emptyLoginValues, pl)).toEqual({
      username: "Wartość jest wymagana",
      password: "Wartość jest wymagana",
    });
    expect(validateLogin({ username: "jan", password: "ab" }, pl)).toEqual({
      username: "Wartość nie jest prawidłowym adresem e-mail",
      password: "Minimalna długość 3",
    });
  });
});
