import { describe, expect, it } from "vitest";

import { testTranslator } from "@/test/i18n";

import {
  RESET_PASSWORD_MIN_LENGTH,
  createResetPasswordSchema,
  emptyRecoverRequestValues,
  emptyResetPasswordValues,
  validateRecoverRequest,
  validateResetPassword,
} from "./recoverySchema";

const t = testTranslator();

describe("validateRecoverRequest", () => {
  it("requires an email address", () => {
    expect(validateRecoverRequest(emptyRecoverRequestValues, t)).toEqual({
      email: "Value is required",
    });
    expect(validateRecoverRequest({ email: "   " }, t)).toEqual({
      email: "Value is required",
    });
  });

  it("requires a valid email address", () => {
    expect(validateRecoverRequest({ email: "jane@" }, t)).toEqual({
      email: "Value is not a valid email address",
    });
    expect(validateRecoverRequest({ email: "jane@example.com" }, t)).toEqual(
      {},
    );
  });

  it("speaks German", () => {
    expect(
      validateRecoverRequest({ email: "jane" }, testTranslator("de-DE")),
    ).toEqual({ email: "Der Wert ist keine gültige E-Mail-Adresse" });
  });
});

describe("validateResetPassword", () => {
  it("uses the registration minimum of eight characters", () => {
    expect(RESET_PASSWORD_MIN_LENGTH).toBe(8);
  });

  it("requires both fields", () => {
    expect(validateResetPassword(emptyResetPasswordValues, t)).toEqual({
      newPassword: "Value is required",
      newPasswordConfirm: "Value is required",
    });
  });

  it("asks for eight characters", () => {
    expect(
      validateResetPassword(
        { newPassword: "1234567", newPasswordConfirm: "1234567" },
        t,
      ),
    ).toEqual({ newPassword: "This minimum length should be at least 8" });
    expect(
      validateResetPassword(
        { newPassword: "12345678", newPasswordConfirm: "12345678" },
        t,
      ),
    ).toEqual({});
  });

  it("reports a mismatch only once the confirmation is filled", () => {
    expect(
      validateResetPassword(
        { newPassword: "new-secret", newPasswordConfirm: "" },
        t,
      ),
    ).toEqual({ newPasswordConfirm: "Value is required" });
    expect(
      validateResetPassword(
        { newPassword: "new-secret", newPasswordConfirm: "new-secrets" },
        t,
      ),
    ).toEqual({ newPasswordConfirm: "The passwords needs to be the same" });
  });

  it("reports a blank confirmation as required only", () => {
    const issues = createResetPasswordSchema(t).safeParse({
      newPassword: "new-secret",
      newPasswordConfirm: "",
    }).error?.issues;

    expect(issues?.map(({ path, message }) => ({ path, message }))).toEqual([
      { path: ["newPasswordConfirm"], message: "Value is required" },
    ]);
  });

  it("takes another minimum", () => {
    expect(
      validateResetPassword(
        { newPassword: "12345678", newPasswordConfirm: "12345678" },
        t,
        12,
      ),
    ).toEqual({ newPassword: "This minimum length should be at least 12" });
  });
});
