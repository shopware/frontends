import { describe, expect, it } from "vitest";

import { emptyLoginValues, validateLogin } from "./loginSchema";

describe("validateLogin", () => {
  it("requires both fields", () => {
    expect(validateLogin(emptyLoginValues)).toEqual({
      username: "Value is required",
      password: "Value is required",
    });
    expect(validateLogin({ username: "  ", password: " " })).toEqual({
      username: "Value is required",
      password: "Value is required",
    });
  });

  it("requires an email address as the username", () => {
    expect(validateLogin({ username: "jane", password: "secret" })).toEqual({
      username: "Value is not a valid email address",
    });
  });

  it("requires a password of at least three characters", () => {
    expect(
      validateLogin({ username: "jane@example.com", password: "ab" }),
    ).toEqual({ password: "This minimum length should be at least 3" });
  });

  it("accepts valid credentials", () => {
    expect(
      validateLogin({ username: "jane@example.com", password: "secret" }),
    ).toEqual({});
  });
});
